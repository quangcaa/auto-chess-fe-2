import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.API_URL || '/',
    headers: {
        'Content-Type': 'application/json',
    },
})

// interceptor tự động thêm accessToken vào header
api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers['x_authorization'] = token
        }
        return config
    },
    (error) => Promise.reject(error)
)

// interceptor để xử lý khi access token hết hạn và tự động refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const accessToken = localStorage.getItem('accessToken')
                const refreshToken = localStorage.getItem('refreshToken')

                const response = await axios.post(`/auth/refresh`,
                    { refreshToken },
                    {
                        headers: {
                            x_authorization: accessToken
                        }
                    }
                )

                const newAccessToken = response.data.accessToken
                localStorage.setItem('accessToken', newAccessToken)

                api.defaults.headers.common['x_authorization'] = newAccessToken
                originalRequest.headers['x_authorization'] = newAccessToken

                console.log('new access token')

                return api(originalRequest) // thử gọi lại request với access token mới
            } catch (err) {
                console.log('error in auto call refresh')
                return Promise.reject(err)
            }
        }
        return Promise.reject(error)
    }
)

export default api