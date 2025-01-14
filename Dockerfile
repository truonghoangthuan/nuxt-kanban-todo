FROM node:23.6.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Change the CMD to use HOST=0.0.0.0
CMD ["node", ".output/server/index.mjs"]