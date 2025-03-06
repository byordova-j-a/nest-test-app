#!/bin/bash
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
yarn start:dev
