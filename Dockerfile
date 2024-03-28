# Используйте базовый образ Node.js
FROM node:latest

# Установите рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Скопируйте файлы зависимостей и package.json для установки зависимостей
COPY package*.json ./

# Установите зависимости
RUN npm install

# Установите ts-node
RUN npm install ts-node -g

# Скопируйте исходный код приложения в контейнер
COPY . .

# Определите команду для запуска вашего приложения
CMD ["npm", "start"]
