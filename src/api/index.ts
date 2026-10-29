import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // из .env
  withCredentials: true  // для куки
})
api.interceptors.response.use(
  (response) => response, // Успешные ответы пропускаем как есть
  (error) => {
    // Если сервер ответил с ошибкой (400, 409 и т.д.)
    if (error.response && error.response.data) {
      // Пытаемся достать detail (формат вашего бэкенда)
      const detail = error.response.data.detail;
      if (detail) {
        // Возвращаем обычную ошибку с текстом от бэкенда
        return Promise.reject(new Error(detail));
      }
    }
    
    // Если это сетевая ошибка или detail нет — пробрасываем как есть
    return Promise.reject(error);
  }
)
export default api