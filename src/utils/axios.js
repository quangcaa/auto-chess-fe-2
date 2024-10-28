import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/',
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
                const refreshToken = localStorage.getItem('refreshToken')
                const response = await axios.post(`http://localhost:5000/auth/refresh`, { refresh_token: refreshToken })

                const newAccessToken = response.data
                localStorage.setItem('accessToken', newAccessToken)

                api.defaults.headers['x_authorization'] = newAccessToken
                originalRequest.headers['x_authorization'] = newAccessToken

                console.log('new access token')

                return api(originalRequest) // thử gọi lại request với access token mới
            } catch (err) {
                return Promise.reject(err)
            }
        }
        return Promise.reject(error)
    }
)

export default api