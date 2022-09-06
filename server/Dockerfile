FROM node:16-bullseye
LABEL maintainer="tom.nurkkala@gmail.com"

COPY apps /apps
COPY package.json tsconfig.build.json tsconfig.json /

#WORKDIR /cli
RUN yarn install
RUN yarn cli:build
