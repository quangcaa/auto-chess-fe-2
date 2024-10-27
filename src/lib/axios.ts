import axios from "axios"
import { useAuth } from "../context/AuthContext"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3333/" : "/"

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers['x_authorization'] = token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refreshToken')
                const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })

                const { accessToken } = response.data
                localStorage.setItem('accessToken', accessToken)

                api.defaults.headers.common['x_authorization'] = accessToken
                originalRequest.headers['x_authorization'] = accessToken
                console.log('REFRESH TOKEN ! ! ! ')

                return api(originalRequest)
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError) 
                useAuth().logout()
            }
        }
        return Promise.reject(error)
    }
)

export default api