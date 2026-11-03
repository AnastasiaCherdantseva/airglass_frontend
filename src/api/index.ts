import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // из .env
  withCredentials: true  // для куки
})
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      const message = Array.isArray(detail)
        ? detail.map((d: any) => d.msg ?? String(d)).join('; ')
        : String(detail);

      const newError = new Error(message);
      // 👇 сохраняем оригинальный detail для разбора в методах
      (newError as any).detail = detail;
      return Promise.reject(newError);
    }
    return Promise.reject(error);
  }
)
export default api