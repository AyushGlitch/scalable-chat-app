FROM node:alpine3.19

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 5173 5174

CMD ["pnpm", "run", "dev"]