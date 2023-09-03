FROM node:lts-alpine as base

WORKDIR /app

####################
####### BACK #######
####################

FROM base as back

COPY back/package.json back/
COPY back/yarn.lock back/
COPY back/prisma back/prisma

RUN yarn --cwd back install --production=false
RUN yarn --cwd back prisma generate

COPY back/tsconfig.json back/
COPY back/tsconfig.build.json back/
COPY back/src back/src

RUN yarn --cwd back build
RUN yarn --cwd back install --frozen-lockfile --force --production --ignore-scripts --prefer-offline

####################
###### FRONT #######
####################

FROM base as front

COPY front/package.json front/
COPY front/yarn.lock front/

RUN yarn --cwd front install --production=false

COPY front/tsconfig.json front/
COPY front/tsconfig.build.json front/
COPY front/vite.config.ts front/
COPY front/index.html front/
COPY front/public front/public
COPY front/src front/src

RUN yarn --cwd front build

####################
##### Release ######
####################

FROM base as release

ENV PUBLIC_DIR=/app/dist/public

COPY --from=back --chown=node:node /app/back/package.json /app/package.json
COPY --from=back --chown=node:node /app/back/prisma/ /app/prisma/
COPY --from=back --chown=node:node /app/back/node_modules/ /app/node_modules/
COPY --from=back --chown=node:node /app/back/dist/ /app/dist/
COPY --from=front --chown=node:node /app/front/dist/ /app/dist/public

# Create session directory
RUN mkdir /app/sessions
RUN chown -R node:node /app/sessions

USER node

CMD ["yarn", "start"]
