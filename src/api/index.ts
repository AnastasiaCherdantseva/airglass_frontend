import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // из .env
  withCredentials: true  // для куки
})

export default api