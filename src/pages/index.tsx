import React, { useState, useEffect } from 'react';
import styles from './index.less';
import useAuth from '@/hooks/useAuth';
import { ConnectorNames } from '@/utils/web3';
import { useWeb3React } from '@web3-react/core';
import { useIntl, setLocale } from 'umi';
import useEagerConnect from '@/hooks/useEagerConnect';
import { useModel } from 'umi';
import { useERC20 } from '@/hooks/useContract';
import useRefresh from '@/hooks/useRefresh';
import { getBep20Contract } from '@/utils/contractHelper';
export default function IndexPage() {
  const [balance, setBalance] = useState(0);
  const { isMobile } = useModel('app', (model) => ({
    isMobile: model.isMobile,
  }));
  const { fastRefresh } = useRefresh();

  useEagerConnect();
  const intl = useIntl();
  const { account } = useWeb3React();
  const { login, logout } = useAuth();
  const handleConnect = () => {
    const connectorId = ConnectorNames.Injected;
    login(connectorId);
  };
  const handleDisconnect = () => {
    logout();
  };

  useEffect(() => {
    const fetchBnbBalance = async () => {
      const tokenAddress = '0x2170ed0880ac9a755fd29b2688956bd959f933f8'; // some token address
      const ERC20Contract = getBep20Contract(tokenAddress);
      try {
        const res = await ERC20Contract.totalSupply();
        console.log(res);
        setBalance(res);
      } catch (err) {
        console.log(err);
      }
    };
    if (account) {
      fetchBnbBalance();
    }
  }, [fastRefresh, account]);

  return (
    <div>
      <h1 className={styles.title}>
        <p>Is mobile: {isMobile ? '是' : '否'}</p>
        <button
          onClick={() => {
            setLocale('zh-CN', false);
          }}
        >
          中文
        </button>
        <button
          onClick={() => {
            setLocale('en-US', false);
          }}
        >
          English
        </button>
      </h1>
      <h1 className={styles.title}>
        {intl.formatMessage({ id: 'WELCOME' }, { account: account })}
      </h1>
      <p>Balance: {balance}</p>

      <button onClick={handleConnect}>Connect Metamask</button>
      <button onClick={handleDisconnect}>Disonnect</button>
    </div>
  );
}
