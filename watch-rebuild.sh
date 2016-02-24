#!/bin/bash

APP_DIR=/var/app/lucaschmid.net/

while RES=$(inotifywait -e create $APP_DIR --format %f); do
  if [[ "restart" == $(basename ${RES}) ]]; then
    rm ${APP_DIR}restart
    cd ${APP_DIR} && \
      git pull && \
      docker-compose restart
  fi
done

