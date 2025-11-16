FROM node:22.17.1-alpine

WORKDIR /opt/task/srv

COPY package.json package-lock.json /opt/task/srv/
RUN npm install

COPY index.js /opt/task/srv
COPY app /opt/task/srv/app
COPY task /opt/task/srv/task
COPY persistence /opt/task/srv/persistence 

CMD ["node", "/opt/task/srv/index.js", "--ConfigurationFile=/opt/task/srv/tasks.json"]
