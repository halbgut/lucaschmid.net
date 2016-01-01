FROM alpine:edge
MAINTAINER Kriegslustig

EXPOSE 80
EXPOSE 443

WORKDIR /var/app
VOLUME /var/app
CMD npm start

ADD ./package.json /var/app/package.json

RUN apk update
RUN apk add python make nodejs g++

CMD npm i; if [[ ${NODE_ENVIRONMENT} == "production" ]]; then npm start; else npm run watch; fi

