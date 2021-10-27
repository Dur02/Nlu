FROM node:14-alpine

# Set a working directory
WORKDIR /usr/src/app

# Copy application files
COPY ./build .

# Install Node.js dependencies
RUN yarn config set registry http://192.168.10.123:8081/repository/taobao/
RUN yarn install --production --no-progress

# Run the container under "node" user by default
USER node

# Set NODE_ENV env variable to "production" for faster expressjs
ENV NODE_ENV production

CMD [ "node", "server.js" ]
