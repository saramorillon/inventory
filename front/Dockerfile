FROM node:19-alpine

ENV NODE_ENV=production

RUN yarn global add serve

WORKDIR /app

# Install packages
COPY yarn.lock .
COPY package.json .
RUN yarn install --production=false

# Copy sources
COPY index.html ./index.html
COPY public ./public
COPY src ./src

# Build
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY vite.config.ts .
RUN yarn build

RUN yarn install --force --production --ignore-scripts --prefer-offline
RUN rm -rf vite.config.ts tsconfig.json tsconfig.build.json src

# Create logs directory
RUN mkdir /app/logs
RUN chown -R node:node /app/logs

USER node

CMD ["serve", "-s", "dist", "-l", "80"]