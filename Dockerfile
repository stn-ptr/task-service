FROM node:22.17.1-alpine

WORKDIR /usr/local/lib/task-service

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY . .

CMD ["node", "/usr/local/lib/task-service/app/index.js", "--ConfigurationFile=/etc/task-service/tasks.json"]
