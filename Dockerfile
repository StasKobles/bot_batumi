FROM node:latest

# Установите Tor и другие зависимости
RUN apt-get update && \
    apt-get install -y tor && \
    rm -rf /var/lib/apt/lists/*

# Установите рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Скопируйте файлы зависимостей и package.json для установки зависимостей
COPY package*.json ./

# Установите зависимости
RUN npm install

# Установите ts-node
RUN npm install ts-node -g

# Установите Tor и запустите его
RUN tor -f /etc/tor/torrc --runasdaemon

# Копируйте исходный код приложения в контейнер
COPY . .

# Определите команду для запуска вашего приложения
CMD ["npm", "start"]
