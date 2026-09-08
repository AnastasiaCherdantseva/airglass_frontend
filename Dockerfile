FROM node:18-alpine

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем код
COPY . .

# Для Vite нужен порт
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]