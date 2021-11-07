import {
  ApolloClient, HttpLink, InMemoryCache, split,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const url = 'https://react.eogresources.com/graphql';
const wbUrl = 'wss://react.eogresources.com/graphql';

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query) as any;
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  new WebSocketLink({
    uri: wbUrl,
    options: {
      timeout: 1000,
      reconnect: true,
    },
  }),
  new HttpLink({
    uri: url,
  }),
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default client;
