# Download Docker image, Node.js running on Alpine
FROM node:alpine


# Make an app directory to hold the server files.
RUN mkdir /app


# Set the working directory to app.
WORKDIR /app


RUN mkdir data


RUN npm install -g nodemon


COPY ./package.json /app/package.json


# Install npm packages.
RUN npm install

COPY .env /app/.env
COPY tsconfig.json /app/tsconfig.json
COPY src /app/src
COPY ormconfig.json /app/ormconfig.json


RUN npm run build


# Expose port 80
EXPOSE 5555


# Start the server.
CMD nodemon dist/web/App.js
