FROM node:18.15.0

RUN mkdir -p /home/app

COPY . /home/app

WORKDIR /home/app

CMD ["node", "/home/app/index.js", "--ConfigurationFile=/home/app/tasks.json"]
