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

# WORKDIR /usr/src/app

# COPY --from=build /usr/src/app/node_modules ./node_modules

# COPY --from=build /usr/src/app/dist ./dist

# RUN mkdir -p dist/templates && cp -r src/templates dist/templates

# RUN ls -R /usr/src/app

# EXPOSE 3000

# CMD ["node", "dist/main.js"]

# Etapa de desarrollo
FROM node:18-alpine AS development

WORKDIR /usr/src/app

# Copia archivos de configuración y descarga dependencias
COPY package*.json ./
RUN npm ci

# Copia el resto de la aplicación
COPY . .

# Etapa de build
FROM node:18-alpine AS build
WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .

# Construye la aplicación
RUN npm run build

# Copia las plantillas al directorio dist/templates
# RUN mkdir -p dist/templates && cp -r src/templates dist/templates
RUN mkdir -p dist/templates && cp -r src/templates/* dist/templates


# Elimina dev dependencies para producción
RUN npm ci --only=production && npm cache clean --force

# Etapa de producción
FROM node:18-alpine AS production
WORKDIR /usr/src/app

# Copia dependencias y el build desde la etapa de build
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/dist/templates ./dist/templates

# Expone el puerto y ejecuta la aplicación
EXPOSE 3000
CMD ["node", "dist/main.js"]