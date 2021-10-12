import {
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef,
    useLayoutEffect,
    useContext,
    ReactNode,
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
import { useNpcDialog } from '@/components/NpcDialog';
import { useIntl } from 'umi';

interface PaginationProps {
    client?: ApolloClient<NormalizedCacheObject>;
    size?: number;
    listGql?: DocumentNode;
    totalGql?: DocumentNode;
    none?: NoneTypes;
    /**@param {function} parser 转换器  */
    parser?(any): any;
    asyncParser?(any): any;
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
        none,
        asyncParser,
    } = props;
    const { setWords: say } = useNpcDialog();
    const { account } = useWeb3React();
    const [list, setList] = useState(null);
    const { loading, setLoading } = useContext(LoadingContext);
    const { slowRefresh } = useRefresh();
    const mounted = useMounted();
    const isClear = useRef(false);
    const refreshCount = useRef(0);
    const intl = useIntl();
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
                    let { data } = await client.query({
                        query: listGql,
                        variables: {
                            offset: pagination.current - 1,
                            limit: pagination.pageSize,
                            user: account,
                            ...extVars,
                        },
                    });
                    if (data && data[key]) {
                        if (asyncParser) {
                            data[key] = await asyncParser(data[key]);
                        }
                        if (parser) {
                            data[key] = data[key].map(parser);
                        }
                    }
                    setList(data ? data[key] : []);
                }
            } finally {
                refreshCount.current += 1;
                loading && setLoading(false);
            }
        }
    }, [account, pagination, extVars]);

    /**@description Fetch total count */
    const fetchListTotal = useCallback(async () => {
        if (account) {
            const { data } = await client.query({
                query: totalGql,
                variables: { user: account, ...extVars },
            });

            const total = data ? data[key]?.length : 0;
            setPagination({
                ...pagination,
                total,
            });

            return total;
        }
    }, [account, extVars]);

    /**@description Reset data */
    const reset = useCallback(() => {
        setList([]);
        setPagination({
            current: 1,
            pageSize: size || DEFAULT_PAGE_SIZE,
            total: 0,
        });
        isClear.current = false;
        fetchListTotal();
    }, [list, extVars]);

    /**@description Clear data */
    const clear = useCallback(() => {
        setList([]);
        isClear.current = true;
    }, [pagination, list]);

    useEffect(() => {
        if (!mounted.current) return;
        setLoading(true);
    }, []);

    useEffect(() => {
        if (!mounted.current) return;
        if (isClear.current) return;
        fetchList();
    }, [slowRefresh, pagination]);

    useEffect(() => {
        if (!mounted.current) return;
        if (isClear.current) return;
        if (customFetch) return; //自定义fetch不需要拿total
        fetchListTotal();
    }, [slowRefresh]);

    const position = useMemo(
        () => (pagination.total > pagination.pageSize ? 'bottomRight' : 'none'),
        [pagination],
    );

    const noneStatus: NoneTypes = useMemo(() => {
        if (loading) {
            return 'loading';
        }

        if (!account) {
            return 'noConnection';
        }
        if (list && !list?.length) {
            return none || 'noAssets';
        }
    }, [account, list, loading]);

    useEffect(() => {
        if (!mounted.current) return;

        if (noneStatus === 'noConnection') {
            say(intl.formatMessage({ id: 'noConnectionTip' }));
        }
        if (noneStatus === 'noRecords' || noneStatus === 'noAssets') {
            if (refreshCount.current === 1) {
                say(intl.formatMessage({ id: 'noRecordTip' }));
            }
        }
    }, [noneStatus]);

    return {
        list: (list ?? []).sort(
            (a, b) => Number(b.timestamp) - Number(a.timestamp),
        ),
        pagination,
        setList,
        setPagination,
        position,
        noneStatus,
        reset,
        clear,
        loading,
    };
};

export default usePagination;
