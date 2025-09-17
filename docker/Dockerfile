FROM node:22-alpine AS build

RUN apk --no-cache upgrade && \
 apk add --no-cache bash npm && \
 apk add --no-cache --update make && \
    rm -rf /var/cache/apk/*

WORKDIR /app

COPY ./docker/start /usr/local/bin/start
RUN chmod u+x /usr/local/bin/start

EXPOSE 5173

CMD /usr/local/bin/start