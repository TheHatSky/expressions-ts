FROM node:argon
MAINTAINER Artem Sakhatskiy <sakhatskiy@yahoo.com>
 
RUN npm install -g typescript tslint tsd
RUN npm install -g phantomjs-prebuilt karma-cli