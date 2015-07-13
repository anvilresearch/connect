#
# Redis Dockerfile
#
# https://github.com/anvilresearch/redis
#

FROM alpine:3.2

# Install redis
RUN apk add --update redis && \
    rm -rf /var/cache/apk/* && \
    mkdir /data && \
    chown -R redis:redis /data

# Version
ENV REDIS_VERSION 3.0.2

# Add configuration
COPY etc /etc/

# Define mountable directories
VOLUME ["/data", "/logs"]

# Define working directory
WORKDIR /data

# Define default command
CMD [ "redis-server" ]

# Expose port
EXPOSE 6379

