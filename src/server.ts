import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import expressJwt from 'express-jwt';
import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { buildSchema } from 'type-graphql';
import { customAuthChecker } from './utils/CustomAuthChecker';

const PORT = process.env.PORT || 5000;
const GQLPATH = '/graphql';

const main = async () => {
  const sequelize = new Sequelize({
    database: 'test',
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
    modelPaths: [`${__dirname}/models`],
    url: process.env.DATABASE_URL || '',
  });

  // Uncomment force: true to reset DB
  sequelize.sync({
    // force: true,
  });

  const schema = await buildSchema({
    authChecker: customAuthChecker,
    emitSchemaFile: path.resolve(__dirname, '..', 'schema', 'schema.gql'),
    // .js instead of .ts because ts will transpile into js
    resolvers: [`${__dirname}/controllers/*.resolver.js`],
  });

  const app = express();

  const server = new ApolloServer({
    context: ({ req }: any) => {
      const context = {
        req,
        user: req.user, // `req.user` comes from `express-jwt`
      };
      return context;
    },
    introspection: true,
    playground: true,
    schema,
  });

  app.use(
    GQLPATH,
    expressJwt({
      credentialsRequired: false,
      secret: process.env.CRYPTO_KEY!,
    }),
  );

  server.applyMiddleware({ app, path: GQLPATH });

  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(
    cors({
      // Add whitelist here
      origin: ['http://localhost:8080', 'http://localhost:3000'],
    }),
  );
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  // tslint:disable-next-line: no-console
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
};

main();
