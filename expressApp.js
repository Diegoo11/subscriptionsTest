import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';

import { ApolloServer } from '@apollo/server';
import { v4 as idV4 } from 'uuid';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { PubSub } from 'graphql-subscriptions';

const app = express();
const httpServer = http.createServer(app);

const infos = [
  {
    id: idV4(),
    str: 'Info1',
    num: 1,
  },
  {
    id: idV4(),
    str: 'Info2',
    num: 2,
  },
  {
    id: idV4(),
    str: 'Info3',
    num: 3,
  },
  {
    id: idV4(),
    str: 'Info4',
    num: 4,
  },
  {
    id: idV4(),
    str: 'Info5',
    num: 5,
  },
];

const typeDefs = `
type Info {
  id: ID!
  str: String!
  num: String
}
type Mutation {
  pushInfo(
    str: String!
    num: String
    ): Info
}
type Query {
  getInfo: [Info]
}

type Subscription {
  infoCreated: Info
}
`;

const pubSub = new PubSub();

const resolvers = {
  Mutation: {
    pushInfo: (root, args) => {
      const { str, num } = args;
      const info = {
        id: idV4(),
        str,
        num,
      };
      pubSub.publish('INFO_CREATED', { infoCreated: info });
      infos.push(info);
      return info;
    },
  },
  Query: {
    getInfo: () => infos,
  },
  Subscription: {
    infoCreated: {
      subscribe: () => pubSub.asyncIterator(['INFO_CREATED']),
    },
  },
};

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const schema = makeExecutableSchema({ typeDefs, resolvers });
const serverCleanup = useServer({ schema }, wsServer);
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

app.use('/graphql', cors(), bodyParser.json(), expressMiddleware(server));

await new Promise((resolve) => {
  httpServer.listen({ port: 5000 }, resolve);
});

console.log('🚀 Server ready at http://localhost:5000/graphql');
