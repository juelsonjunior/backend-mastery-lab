# Etapa 1 build
FROM node:18-aspine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Etapa 2 produção
FROM node:18-aspine

WORKDIR /app

COPY --from=build /app /app

ENV NODE_ENV=production 

EXPOSE 3000

CMD [ "node", "src/server.js" ]


