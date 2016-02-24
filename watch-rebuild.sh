#!/bin/bash

APP_DIR=/var/app/lucaschmid.net/

while RES=$(inotifywait -e create $APP_DIR --format %f); do
  if [[ "restart" == $(basename ${RES}) ]]; then
    cd ${APP_DIR} && \
      git pull && \
      docker-compose restart && \
      rm restart
  fi
done

