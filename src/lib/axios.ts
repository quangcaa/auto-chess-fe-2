import axios from "axios"
import { useAuth } from "../context/AuthContext"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3333/" : "/"

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

axiosInstance.interceptors.request.use(
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

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            const refreshToken = localStorage.getItem('refreshToken')
            if (refreshToken) {
                try {
                    const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken })
                    const { accessToken } = response.data
                    localStorage.setItem('accessToken', accessToken)
                    axios.defaults.headers.common['x_authorization'] = accessToken
                    console.log('REFRESH TOKEN ! ! ! ')
                    return axiosInstance(originalRequest)
                } catch (refreshError) {
                    useAuth().logout()
                }
            }
        }
        return Promise.reject(error)
    }
)

export default axiosInstance