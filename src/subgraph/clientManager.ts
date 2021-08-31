import { ApolloClient, InMemoryCache } from '@apollo/client';

export const pancakeswapClient = new ApolloClient({
    uri: process.env.PACAKE_GRAPH_URL,
    cache: new InMemoryCache(),
});

export const ourClient = new ApolloClient({
    uri: process.env.OUR_GRAPH_URL,
    cache: new InMemoryCache(),
});
