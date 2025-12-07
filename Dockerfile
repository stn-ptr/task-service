FROM node:22.17.1-alpine

WORKDIR /usr/local/lib/task-service

COPY package.json package-lock.json /usr/local/lib/task-service/
RUN npm install

COPY index.js ./
COPY app/ ./app/
COPY task/ ./task/
COPY persistence/ ./persistence/

CMD ["node", "/usr/local/lib/task-service/index.js", "--ConfigurationFile=/etc/task-service/tasks.json"]
