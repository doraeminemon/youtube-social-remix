# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

ADD package.json package-lock.json ./
RUN npm ci

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
ADD . .

CMD ["npm", "start"]
