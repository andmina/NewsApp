import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { RestLink } from 'apollo-link-rest';

const restLink = new RestLink({
  uri: 'https://newsapi.org/v2/',
  headers: {
    Authorization: 'ce69474758414cc3a797ad7ca82f4342',
  },
});

export const client = new ApolloClient({
  link: restLink,
  cache: new InMemoryCache(),
});
