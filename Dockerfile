FROM node:20-alpine as base

WORKDIR /app

RUN npm i -g pnpm

####################
####### BACK #######
####################

FROM base as back

COPY back/package.json back/
COPY back/pnpm-lock.yaml back/
COPY back/prisma back/prisma

RUN pnpm -C back install

COPY back/tsconfig.json back/
COPY back/tsconfig.build.json back/
COPY back/src back/src

RUN pnpm -C back build
RUN pnpm -C back prune

####################
###### FRONT #######
####################

FROM base as front

COPY front/package.json front/
COPY front/pnpm-lock.yaml front/

RUN pnpm -C front install

COPY front/tsconfig.json front/
COPY front/tsconfig.build.json front/
COPY front/vite.config.ts front/
COPY front/index.html front/
COPY front/public front/public
COPY front/src front/src

RUN pnpm -C front build

####################
##### Release ######
####################

FROM base as release

ENV PUBLIC_DIR=/app/dist/public

COPY --from=back --chown=node:node /app/back/prisma/ /app/prisma/
COPY --from=back --chown=node:node /app/back/node_modules/ /app/node_modules/
COPY --from=back --chown=node:node /app/back/dist/ /app/dist/
COPY --from=front --chown=node:node /app/front/dist/ /app/dist/public

# Create session directory
RUN mkdir /app/sessions
RUN chown -R node:node /app/sessions

USER node

CMD ["node", "dist/src/index.js"]
