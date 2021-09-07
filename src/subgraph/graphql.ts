import { gql } from '@apollo/client';

/**
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Pancakeswap Subgraph <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */
/**
 * @see https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2/graphql?query=%23%20Welcome%20to%20GraphiQL%0A%23%0A%23%20GraphiQL%20is%20an%20in-browser%20tool%20for%20writing%2C%20validating%2C%20and%0A%23%20testing%20GraphQL%20queries.%0A%23%0A%23%20Type%20queries%20into%20this%20side%20of%20the%20screen%2C%20and%20you%20will%20see%20intelligent%0A%23%20typeaheads%20aware%20of%20the%20current%20GraphQL%20type%20schema%20and%20live%20syntax%20and%0A%23%20validation%20errors%20highlighted%20within%20the%20text.%0A%23%0A%23%20GraphQL%20queries%20typically%20start%20with%20a%20%22%7B%22%20character.%20Lines%20that%20starts%0A%23%20with%20a%20%23%20are%20ignored.%0A%23%0A%23%20An%20example%20GraphQL%20query%20might%20look%20like%3A%0A%23%0A%23%20%20%20%20%20%7B%0A%23%20%20%20%20%20%20%20field(arg%3A%20%22value%22)%20%7B%0A%23%20%20%20%20%20%20%20%20%20subField%0A%23%20%20%20%20%20%20%20%7D%0A%23%20%20%20%20%20%7D%0A%23%0A%23%20Keyboard%20shortcuts%3A%0A%23%0A%23%20%20Prettify%20Query%3A%20%20Shift-Ctrl-P%20(or%20press%20the%20prettify%20button%20above)%0A%23%0A%23%20%20%20%20%20%20%20Run%20Query%3A%20%20Ctrl-Enter%20(or%20press%20the%20play%20button%20above)%0A%23%0A%23%20%20%20Auto%20Complete%3A%20%20Ctrl-Space%20(or%20just%20start%20typing)%0A%23%0Aquery%20%7B%0A%20%20mints(first%3A100)%20%7B%0A%20%20%20%20id%0A%20%20%20%20pair%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20token0%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20token1%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20amount0%0A%20%20%20%20amount1%0A%20%20%20%20sender%0A%20%20%7D%0A%7D
 * @description
 */
export const GET_MINTS_FROM_PANCAKE = gql`
    query PancakeMints($offset: Int, $limit: Int, $user: String) {
        mints(skip: $offset, first: $limit, where: { sender_contains: $user }) {
            id
            pair {
                name
                token0 {
                    name
                }
                token1 {
                    name
                }
            }
            amount0
            amount1
            sender
            timestamp
        }
    }
`;

/**
 * @description
 */
export const GET_BURNS_FROM_PANCAKE = gql`
    query PancakeBurns($offset: Int, $limit: Int, $user: String) {
        burns(skip: $offset, first: $limit, where: { sender_contains: $user }) {
            id
            pair {
                name
                token0 {
                    name
                }
                token1 {
                    name
                }
            }
            amount0
            amount1
            sender
            timestamp
        }
    }
`;

/**
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Our Subgraph <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */

export const GET_MINTS = gql`
    query Mints($offset: Int, $limit: Int, $user: String) {
        mints(skip: $offset, first: $limit, where: { user_contains: $user }) {
            id
            user
            collateralCurrency
            collateralAmount
            lockedAmount
            mintedCurrency
            mintedAmount
            timestamp
            ratio
            txhash
        }
    }
`;

export const GET_BURNS = gql`
    query Burns($offset: Int, $limit: Int, $user: String) {
        burns(skip: $offset, first: $limit, where: { user_contains: $user }) {
            id
            user
            unstakingAmount
            unstakingCurrency
            unlockedAmount
            cleanedDebt
            timestamp
            ratio
            txhash
        }
    }
`;

/**
 * @description 操作历史数据
 * @property {Deposit | Withdraw | Harvest | Mint | Trade | Burn} type 操作记录类型
 * @property {HexString} txhash 交易哈希
 */
export const GET_OPERATIONS = gql`
    query Operations($offset: Int, $limit: Int, $user: String, $type: String) {
        operations(
            skip: $offset
            first: $limit
            where: { user_contains: $user, type_contains: $type }
        ) {
            id
            type
            fromCurrency
            fromAmount
            toCurrency
            toAmount
            txhash
            timestamp
        }
    }
`;
export const GET_OPERATIONS_FUZZY = gql`
    query OperationsByFilter(
        $offset: Int
        $limit: Int
        $user: String
        $type: [String]
    ) {
        operations(
            skip: $offset
            first: $limit
            where: { user_contains: $user, type_in: $type }
        ) {
            id
            type
            fromCurrency
            fromAmount
            toCurrency
            toAmount
            txhash
            timestamp
        }
    }
`;

/**
 * @description
 */
export const GET_MINTS_BY_COLLATERAL = gql`
    query MintsByCollateral($offset: Int, $limit: Int, $user: String) {
        mints(
            skip: $offset
            first: $limit
            where: { user: $user, collateralCurrency_contains: "-" }
        ) {
            id
            user
            collateralCurrency
            collateralAmount
            lockedAmount
            mintedCurrency
            mintedAmount
            timestamp
            ratio
            txhash
        }
    }
`;

export const GET_TRADE_MARKET_DETAIL = gql`
    query MarketDetail($token: String) {
        tokenDayDatas(
            first: 1
            where: { token: $token }
            orderBy: date
            orderDirection: desc
        ) {
            id
            date
            priceHigh
            priceLow
            token
            tradeVolume
            tradeVolumeUSD
        }
    }
`;
