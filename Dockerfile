# Create image based on the official Node image from dockerhub
FROM node:14.21 as cache-image

# Bundle app source
COPY ./package-lock.json /usr/src/app/
COPY ./package.json /usr/src/app/

WORKDIR /usr/src/app
RUN npm install

# Build frontend
FROM cache-image as builder

COPY . /usr/src/app
COPY .env /usr/src/app/
WORKDIR /usr/src/app

#replace new build version
RUN sed -i "s/REACT_APP_BUILD_VERSION=/REACT_APP_BUILD_VERSION=$(date +%Y%m%d%H%M)/g" .env

#read REACT_APP_API_URL from system environment
ARG REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
RUN echo $REACT_APP_API_URL
RUN echo ${REACT_APP_API_URL}

ARG PROJECT_NAME=${PROJECT_NAME}
ENV PROJECT_NAME=${PROJECT_NAME}

ARG REACT_APP_PROJECT_NAME=${REACT_APP_PROJECT_NAME}
ENV REACT_APP_PROJECT_NAME=${REACT_APP_PROJECT_NAME}

ARG REACT_APP_RUNTIME_MODE=${REACT_APP_RUNTIME_MODE}
ENV REACT_APP_RUNTIME_MODE=${REACT_APP_RUNTIME_MODE}

ARG REACT_APP_KEY_PAYLOAD=${REACT_APP_KEY_PAYLOAD}
ENV REACT_APP_KEY_PAYLOAD=${REACT_APP_KEY_PAYLOAD}

ARG REACT_APP_ENCRYPT_SECRET_KEY=${REACT_APP_ENCRYPT_SECRET_KEY}
ENV REACT_APP_ENCRYPT_SECRET_KEY=${REACT_APP_ENCRYPT_SECRET_KEY}

#replace API link follow system environment
RUN sed -i 's|REACT_APP_API_URL=.*|REACT_APP_API_URL='"$REACT_APP_API_URL"'|' .env

#run command to build and notify
RUN npm run autobuild

# PROD environment
# Create image based on the official NGINX image from dockerhub
FROM nginx:1.16.0-alpine as deploy-image

## Set timezones
RUN cp /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime

# Get all the builded code to root folder
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
COPY --from=builder /usr/src/app/public/502.html /usr/share/nginx/html

# Copy nginx template to container
COPY --from=builder /usr/src/app/ops/config/nginx.template.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/ops/config/default.template.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/start-container.sh /etc/nginx/start-container.sh
RUN chmod +x /etc/nginx/start-container.sh
RUN mkdir -p /usr/share/nginx/html/media
## Serve the app
CMD [ "/bin/sh", "-c", "/etc/nginx/start-container.sh" ]
