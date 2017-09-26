# Note: Alpine currently segfaults, likely due to bcrypt
FROM node:8.5.0-slim

WORKDIR /usr/local/src

ADD package.json .
RUN npm install --quiet

ADD bin bin
ADD src src
ADD test test
ADD script script

ENTRYPOINT ["script/entrypoint.sh"]