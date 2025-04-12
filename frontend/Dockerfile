FROM node:23-alpine as node

WORKDIR /app
COPY ./ /app/

EXPOSE 8080

RUN npm install && npm run test:coverage && npm run build
ENTRYPOINT ["npm", "run", "deploy:build"]





