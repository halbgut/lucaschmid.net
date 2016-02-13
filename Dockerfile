FROM alpine:edge
MAINTAINER Kriegslustig

EXPOSE 80
EXPOSE 443

WORKDIR /var/app
VOLUME /var/app
CMD npm i; npm start

ADD ./package.json /var/app/package.json

RUN apk update
RUN apk add nodejs openssl
RUN cd /var && \
  wget -q https://github.com/Kriegslustig/elm-intro/archive/master.zip && \
  unzip master.zip && \
  mv elm-intro-master elm-intro && \
  rm master.zip
RUN cd /var/elm-intro && NODE_ENV=production npm i

