#!/bin/bash

APP_DIR=/var/app/lucaschmid.net/

while RES=$(inotifywait -e create $APP_DIR --format %f); do
  if [[ "restart" == $(basename ${RES}) ]]; then
    cd ${APP_DIR} && \
      rm restart && \
      git pull && \
      docker-compose restart
  fi
done

