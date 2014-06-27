# DOCKER-VERSION 1.0.0

FROM    ubuntu:14.04

RUN sudo add-apt-repository ppa:chris-lea/node.js
RUN sudo apt-get update
RUN sudo apt-get install nodejs
RUN sudo apt-get install npm

ADD . /anvil
RUN cd /anvil; npm install

EXPOSE 8080

CMD ["NODE_ENV=production", "node", "/anvil/server.js"]
