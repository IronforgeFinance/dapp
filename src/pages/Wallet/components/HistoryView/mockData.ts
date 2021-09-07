import { HistoryViewProps } from '@/components/CommonView';

const mockData: HistoryViewProps[] = [
    {
        id: 0,
        icon: 'mint',
        type: 'Mint',
        verb: 'From',
        conj: 'To',
        token0: {
            name: 'BNB',
            amount: '20',
        },
        token1: {
            name: 'fUSD',
            amount: '5',
        },
        link: '/mint',
        dealtime: Date.now(),
    },
    {
        id: 1,
        icon: 'burn',
        type: 'Burn',
        verb: 'From',
        conj: 'To',
        token1: {
            name: 'BNB',
            amount: '20',
        },
        token0: {
            name: 'fUSD',
            amount: '5',
        },
        link: '/burn',
        dealtime: Date.now(),
    },
    {
        id: 2,
        icon: 'trade',
        type: 'Trade',
        verb: 'Send',
        conj: 'To',
        token0: {
            name: 'fBNB',
            amount: '9',
        },
        token1: {
            name: 'fUSD',
            amount: '5',
        },
        link: '/trade',
        dealtime: Date.now(),
    },
    {
        id: 4,
        icon: 'pool-mint',
        type: 'Pool',
        verb: 'Provide Liquidity',
        conj: 'and',
        token0: {
            name: 'fBNB',
            amount: '9',
        },
        token1: {
            name: 'fUSD',
            amount: '21',
        },
        link: '/farm/provide',
        dealtime: Date.now(),
    },
    {
        id: 5,
        icon: 'pool-burn',
        type: 'Pool',
        verb: 'Withdraw Liquidity',
        conj: 'and',
        token0: {
            name: 'fBNB',
            amount: '9',
        },
        token1: {
            name: 'fUSD',
            amount: '20',
        },
        link: '/farm/provide',
        dealtime: Date.now(),
    },
    {
        id: 6,
        icon: 'farm',
        type: 'Farm',
        verb: 'Stake LP',
        token0: {
            name: 'fBNB-fUSD',
            amount: '20',
        },
        link: '/farm',
        dealtime: Date.now(),
    },
];

export default mockData;
