FROM node:lts-alpine

ENV NODE_ENV=production

WORKDIR /app

# Install packages
COPY yarn.lock .
COPY package.json .
COPY prisma ./prisma
RUN yarn install --production=false

# Copy sources
COPY types ./types
COPY src ./src

# Build
COPY tsconfig.json .
COPY tsconfig.build.json .
RUN yarn build

RUN yarn install --force --production --ignore-scripts --prefer-offline
RUN rm -rf tsconfig.json src

# Create data directory
RUN mkdir /app/dist/sessions
RUN chown -R node:node /app/dist/sessions

# Create logs directory
RUN mkdir /app/dist/logs
RUN chown -R node:node /app/dist/logs

USER node

CMD ["yarn", "start"]
