import { ApolloServer } from '@apollo/server';
import { v4 as idV4 } from 'uuid';

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

const resolvers = {
  Mutation: {
    pushInfo: (root, args) => {
      const { str, num } = args;
      const info = {
        id: idV4(),
        str,
        num,
      };
      infos.push(info);
      return info;
    },
  },
  Query: {
    getInfo: () => infos,
  },
};

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

export default server;
