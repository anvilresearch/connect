# DOCKER-VERSION 1.0.0

FROM    ubuntu:14.04

RUN     sudo apt-get update

RUN     sudo apt-get install -y curl build-essential python
RUN     curl -sL https://deb.nodesource.com/setup_dev | sudo bash -
RUN     sudo apt-get install -y nodejs

COPY    package.json /tmp/package.json
RUN     cd /tmp && npm install

COPY    . /opt/anvil
WORKDIR /opt/anvil

RUN     rm -rf ./node_modules && cp -a /tmp/node_modules ./

RUN     npm install

EXPOSE  3000

CMD     ["node", "server.js"]
