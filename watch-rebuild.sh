#!/bin/bash

APP_DIR=/var/app/lucaschmid.net/
source .env

while RES=$(inotifywait -e create $APP_DIR --format %f); do
  if [[ "restart" == $(basename ${RES}) ]]; then
    rm ${APP_DIR}restart
    cd ${APP_DIR} && \
      git pull && \
      git submodule update --init && \
      docker-compose restart
  fi
done

