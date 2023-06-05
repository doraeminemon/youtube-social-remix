# Full stack developer test
## Instruction

### Introduction
This project used [Remix Blues stack](https://remix.run/stacks) as a template, then build up as per the requirement for the front end developer test.
### Prerequisites
- NodeJS & npm
- OpenSSL for Prisma
- Postgres version >13 or Docker

### Installation
- Build all respective Docker instances by running `docker-compose build`
- Start all docker containers by running `docker-compose up -d`
- With all the Docker instances in place, run `export DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres"; npm run setup` to setup the database while pointing to the Dockerized postgres instance to setting up the tables, running seed data

### Usage
- Test the app by visiting `localhost:3000` on local
- Login using the seeded account or registering a new one.

### Testing

- Unit test can be run with command `npm run test`
- End to end testing can be run with command `npm run test:e2e:dev`

## What is missing
- Deployment to `fly.io` with Docker
- More intensive testing and E2E testing with Cypress

