FROM node:18.15.0-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "/app/"]
RUN npm install --production --silent && mv node_modules ../
COPY . /app
RUN chown -R node /app
USER node