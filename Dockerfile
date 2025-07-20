FROM node:22.17.1-alpine

RUN mkdir -p /home/app

COPY . /home/app

WORKDIR /home/app

CMD ["node", "/home/app/index.js", "--ConfigurationFile=/home/app/tasks.json"]
