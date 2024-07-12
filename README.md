# Movie for tonight

- App for Choosing a Movie for the Evening Screening
- **Tech Stack**: Typescript, Remix, Prisma, Tailwind, Vitest, Zod, Conform, MSW

## Development

Create new file .env with

```sh
touch .env
```

Need to setup NODE_ENV for mocking 3rd party response

```
NODE_ENV="development"
```

this will provide that search bar for new movie will for (every) string return
predefined response from MSW server. That is why we don't need MovieDB api key

#### Init DB

```sh
npx prisma init
```

#### Seed DB

```sh
yarn prisma db seed
```

#### Run

```sh
yarn dev
```

## Deployment

First, build your app for production:

```sh
yarn build
```

Then run the app in production mode:

```sh
yarn start
```
