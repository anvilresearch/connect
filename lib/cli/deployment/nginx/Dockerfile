#
# Nginx Dockerfile
#
# https://github.com/anvilresearch/nginx
#

# Pull base image.
FROM alpine:3.2

# Maintainer
MAINTAINER Anvil Research, Inc. <smith@anvil.io>

# Install Nginx.
RUN \
  apk add --update nginx && \
  rm -rf /var/cache/apk/*

# Copy main config file
COPY nginx.conf /etc/nginx/nginx.conf

# Define mountable directories.
VOLUME ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/etc/nginx/conf.d", "/var/log/nginx", "/var/www/html"]

# Define working directory.
WORKDIR /etc/nginx

# Define default command.
CMD ["nginx"]

# Expose ports.
EXPOSE 443
