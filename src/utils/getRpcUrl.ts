import { sample } from 'lodash';

// Array of available nodes to connect to
export const nodes = [
    process.env.RPC_NODE_1,
    process.env.RPC_NODE_2,
    process.env.RPC_NODE_3,
];
// export const nodes = ['http://localhost:8545']
const getNodeUrl = () => {
    return sample(nodes);
};

export default getNodeUrl;
