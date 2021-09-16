import {
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef,
    useLayoutEffect,
} from 'react';
import { ourClient } from '@/subgraph/clientManager';
import {
    ApolloClient,
    DocumentNode,
    NormalizedCacheObject,
} from '@apollo/client';
import { useWeb3React } from '@web3-react/core';
import useRefresh from '@/hooks/useRefresh';
import { TablePaginationConfig } from 'antd';
import { DEFAULT_PAGE_SIZE } from '@/config/constants/constant';
import { NoneTypes } from '@/components/NoneView';

interface PaginationProps {
    client?: ApolloClient<NormalizedCacheObject>;
    size?: number;
    listGql?: DocumentNode;
    totalGql?: DocumentNode;
    key: string;
    /**@param {any} extVars 扩展query参数  */
    extVars?: any;
    /**@param {function} customFetch 自定义fetch  */
    customFetch?(any): any;
}

const usePagination = (props: PaginationProps) => {
    const {
        client = ourClient,
        size = 6,
        listGql,
        totalGql,
        key,
        extVars = {},
        customFetch,
    } = props;
    const { account } = useWeb3React();
    const [list, setList] = useState([]);
    const { fastRefresh } = useRefresh();
    const mounted = useRef(false);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: size || DEFAULT_PAGE_SIZE,
        total: 0,
    });

    /**@description Fetch data list */
    const fetchList = useCallback(async () => {
        if (account) {
            if (customFetch) {
                const { data } = await customFetch(account);
                setList(data ? data[key] : []);
            } else {
                const { data } = await client.query({
                    query: listGql,
                    variables: {
                        offset: pagination.current - 1,
                        limit: pagination.pageSize,
                        user: account,
                        ...extVars,
                    },
                });
                setList(data ? data[key] : []);
            }
        }
    }, [account, pagination]);

    /**@description Fetch total count */
    const fetchListTotal = useCallback(async () => {
        if (account) {
            const { data } = await client.query({
                query: totalGql,
                variables: { user: account },
            });
            setPagination({
                ...pagination,
                total: data ? data[key]?.length : 0,
            });
        }
    }, [account]);

    /**@description Init mounted state before fetching */
    useLayoutEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (!mounted.current) return;
        fetchList();
    }, [fastRefresh, pagination]);

    useEffect(() => {
        if (!mounted.current) return;
        if (customFetch) return; //自定义fetch不需要拿total
        fetchListTotal();
    }, []);

    const position = useMemo(
        () => (pagination.total > pagination.pageSize ? 'bottomRight' : 'none'),
        [pagination],
    );

    const noneStatus: NoneTypes = useMemo(() => {
        if (!account) {
            return 'noConnection';
        }
        if (!list?.length) {
            return 'noAssets';
        }
    }, [account, list]);

    return {
        list: list.sort((a, b) => Number(b.timestamp) - Number(a.timestamp)),
        pagination,
        setPagination,
        position,
        noneStatus,
    };
};

export default usePagination;
