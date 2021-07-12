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

export default function IndexPage() {
  const [balance, setBalance] = useState(0);
  const { isMobile } = useModel('app', (model) => ({
    isMobile: model.isMobile,
  }));
  const { fastRefresh } = useRefresh();

  const tokenAddress = '0xdab9b5be023365825609495a6ae0e1c353ce587c'; // some token address
  const ERC20Contract = useERC20(tokenAddress);

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
    // if (account) {
    //   fetchBnbBalance();
    // }
  }, [fastRefresh, account]);
  const fetchBnbBalance = async () => {
    try {
      const res = (await ERC20Contract.totalSupply()).toString();
      console.log(res);
      setBalance(res);
    } catch (err) {
      console.log(err);
      /**
       * 遇到错误是Error: call revert exception，原因基本都是因为合约对应的链不对。
       * 比如测试网的合约，钱包连接的是主网。
       */
    }
  };
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
      <p className={styles.title}>
        {intl.formatMessage({ id: 'WELCOME' }, { account: account })}
      </p>
      <p>
        <button onClick={fetchBnbBalance}>获取TotalSupply</button>
        Balance: {balance}
      </p>

      <button onClick={handleConnect}>Connect Metamask</button>
      <button onClick={handleDisconnect}>Disonnect</button>
    </div>
  );
}
