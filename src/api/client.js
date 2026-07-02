import { GraphQLClient } from 'graphql-request';

// This targets the specific WordPress GraphQL endpoint running in your Docker container
const ENDPOINT = 'http://localhost:8081/graphql';

export const graphQLClient = new GraphQLClient(ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
  },
});