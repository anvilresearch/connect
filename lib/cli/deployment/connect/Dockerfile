#
# Anvil Connect Dockerfile
#
# https://github.com/anvilresearch/connect
#

FROM mhart/alpine-iojs:2.3.0

# Install npm package build dependencies
RUN apk add --update python make alpine-sdk && \
    rm /var/cache/apk/*

# Define working dir
WORKDIR /opt/connect

# Copy files
COPY ./package.json /opt/connect/package.json
COPY ./server.js /opt/connect/server.js

# Install npm dependencies
RUN npm install

# Define mountable directories
VOLUME ["/opt/connect/config", "/opt/connect/views"]

# Define environment variables
ENV NODE_ENV production

# Define default command
CMD ["node", "server.js"]

# Expose port
EXPOSE 3000
