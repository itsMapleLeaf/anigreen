FROM node:lts-slim

WORKDIR /app

COPY / ./
RUN ls -R

RUN npm i -g pnpm

RUN pnpm install --frozen-lockfile --unsafe-perm
RUN pnpm run build

ENV NODE_ENV=production
RUN pnpm prune --prod

CMD ["pnpm", "start"]
