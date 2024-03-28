# Используйте базовый образ Node.js
FROM node:latest

# Установите рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Установите Tor и другие зависимости
RUN apt-get update && \
    apt-get install -y tor && \
    rm -rf /var/lib/apt/lists/*

# Скопируйте файлы зависимостей и package.json для установки зависимостей
COPY package*.json ./

# Установите зависимости
RUN npm install

# Установите ts-node
RUN npm install ts-node -g

# Тестовая утилита
RUN apt-get update && apt-get install -y iproute2

# Скопируйте исходный код приложения в контейнер
COPY . .

# Определите команду для запуска вашего приложения
CMD ["npm", "start"]
