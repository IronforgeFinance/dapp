import { ApolloClient, DefaultOptions, InMemoryCache } from '@apollo/client';

/**
 * @property {DefaultOptions} defaultOptions
 * @description disable cache
 */

const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
};

export const pancakeswapClient = new ApolloClient({
    uri: process.env.PACAKE_GRAPH_URL,
    cache: new InMemoryCache(),
    defaultOptions,
});

export const ourClient = new ApolloClient({
    uri: process.env.OUR_GRAPH_URL,
    cache: new InMemoryCache(),
    defaultOptions,
});
