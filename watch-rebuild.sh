#!/bin/bash

APP_DIR=/var/app/lucaschmid.net/

while $(inotifywait -me CREATE ${APP_DIR}restart); do
  cd ${APP_DIR} && \
    git pull && \
    docker-compose restart
done

