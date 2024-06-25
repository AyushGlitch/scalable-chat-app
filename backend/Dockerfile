FROM node:alpine3.19

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install
# RUN npx drizzle-kit push --config=<./drizzle.config.ts>

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "dev"]