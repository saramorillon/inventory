FROM node:20-alpine AS base

WORKDIR /usr/app

RUN npm i -g pnpm

FROM base as build

COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

COPY back/package.json back/
COPY front/package.json front/

RUN pnpm install --frozen-lockfile

COPY back/tsconfig.json back/
COPY back/tsconfig.build.json back/
COPY back/src back/src
COPY back/prisma back/prisma

COPY front/tsconfig.json front/
COPY front/tsconfig.build.json front/
COPY front/index.html front/
COPY front/vite.config.ts front/
COPY front/public front/public
COPY front/src front/src

RUN pnpm --recursive run build
RUN pnpm --filter=@inventory/back deploy --prod /usr/app/pruned
RUN cd pruned && pnpm exec prisma generate

###### Release stage #####

FROM base as release

ENV PUBLIC_DIR=/usr/app/public

COPY --from=build --chown=node:node /usr/app/pruned/package.json /usr/app/package.json
COPY --from=build --chown=node:node /usr/app/pruned/node_modules /usr/app/node_modules
COPY --from=build --chown=node:node /usr/app/pruned/prisma /usr/app/prisma
COPY --from=build --chown=node:node /usr/app/pruned/dist /usr/app/dist
COPY --from=build --chown=node:node /usr/app/front/dist /usr/app/public

RUN mkdir /usr/app/sessions && chown node:node /usr/app/sessions

USER node

CMD ["pnpm", "start"]