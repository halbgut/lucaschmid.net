FROM alpine:edge
MAINTAINER Kriegslustig

EXPOSE 3040
WORKDIR /var/app
VOLUME /var/app
CMD npm start

ADD ./package.json /var/app/package.json

RUN apk update
RUN apk add nodejs
RUN npm i --only=prod

CMD node ./src/server/main.js

