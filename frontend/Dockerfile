FROM node:20
WORKDIR /frontend
COPY package.json yarn.lock ./
RUN yarn install

COPY . .
EXPOSE 5173
