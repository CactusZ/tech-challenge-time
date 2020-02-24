FROM node:12
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build-backend
RUN npm run build-frontend
EXPOSE 8080
CMD ["node", "compiled/server.js"]