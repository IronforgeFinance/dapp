import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.RPC_NODE_1': 'https://bsc-dataseed.binance.org/',

    'process.env.RPC_NODE_2': 'https://bsc-dataseed1.defibit.io/',

    'process.env.RPC_NODE_3': 'https://bsc-dataseed1.ninicoin.io/',

    'process.env.APP_CHAIN_ID': '56',

    'process.env.BSC_SCAN_URL': 'https://bscscan.com/address/',
  },
});
