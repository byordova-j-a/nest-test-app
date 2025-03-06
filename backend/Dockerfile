FROM node:20
WORKDIR /backend
COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN chmod +x startup.sh
