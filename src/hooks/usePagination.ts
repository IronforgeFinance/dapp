import {
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef,
    useLayoutEffect,
    useContext,
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
import useMounted from './useMounted';
import { LoadingContext } from '@/contexts/LoadingContext';

interface PaginationProps {
    client?: ApolloClient<NormalizedCacheObject>;
    size?: number;
    listGql?: DocumentNode;
    totalGql?: DocumentNode;
    /**@param {function} parser 转换器  */
    parser?(any): any;
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
        parser,
        extVars = {},
        customFetch,
    } = props;
    const { account } = useWeb3React();
    const [list, setList] = useState([]);
    const { loading, setLoading } = useContext(LoadingContext);
    const { fastRefresh } = useRefresh();
    const mounted = useMounted();
    const isClear = useRef(false);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: size || DEFAULT_PAGE_SIZE,
        total: 0,
    });

    /**@description Fetch data list */
    const fetchList = useCallback(async () => {
        if (account) {
            try {
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
                    if (parser) {
                        setList(data ? data[key].map(parser) : []);
                    } else {
                        setList(data ? data[key] : []);
                    }
                }
            } finally {
                loading && setLoading(false);
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

    /**@description Reset data */
    const reset = useCallback(() => {
        setList([]);
        setPagination({
            current: 1,
            pageSize: size || DEFAULT_PAGE_SIZE,
            total: 0,
        });
        isClear.current = false;
    }, [pagination, list]);

    /**@description Reset data */
    const clear = useCallback(() => {
        setList([]);
        isClear.current = true;
    }, [pagination, list]);

    useLayoutEffect(() => setLoading(true), []);

    useEffect(() => {
        if (!mounted.current) return;
        if (isClear.current) return;
        fetchList();
    }, [fastRefresh, pagination]);

    useEffect(() => {
        if (!mounted.current) return;
        if (isClear.current) return;
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
        reset,
        clear,
        loading,
    };
};

export default usePagination;
