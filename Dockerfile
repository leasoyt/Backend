# FROM node:18-alpine AS development

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm ci

# COPY . .

# FROM node:18-alpine AS build

# WORKDIR /usr/src/app

# COPY package*.json ./

# COPY --from=development /usr/src/app/node_modules ./node_modules

# COPY . .

# RUN npm run build
 
# RUN npm ci --only=production && npm cache clean --force

# FROM node:18-alpine AS production

# COPY --from=build /usr/src/app/node_modules ./node_modules

# COPY --from=build /usr/src/app/dist ./dist

# EXPOSE 3000

# CMD ["node", "dist/main.js"]

FROM node:18-alpine AS develop

# Instalar dependencias necesarias para PostgreSQL
RUN apk add --no-cache postgresql-client postgresql-dev python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

# Si necesitas compilar código nativo
RUN npm rebuild

FROM node:18-alpine AS build

# Instalar dependencias necesarias para PostgreSQL
RUN apk add --no-cache postgresql-client postgresql-dev python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./

COPY --from=develop /usr/src/app/node_modules ./node_modules

COPY . .

RUN npm run build
 
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS production

# Instalar dependencias necesarias para PostgreSQL
RUN apk add --no-cache postgresql-client

COPY --from=build /usr/src/app/node_modules ./node_modules

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]