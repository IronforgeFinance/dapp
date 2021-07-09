import styles from './index.less';
import useAuth from '@/hooks/useAuth';
import { ConnectorNames } from '@/utils/web3';
import { useWeb3React } from '@web3-react/core';
import { useIntl, setLocale } from 'umi';
import useEagerConnect from '@/hooks/useEagerConnect';
export default function IndexPage() {
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
  return (
    <div>
      <h1 className={styles.title}>
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

      <button onClick={handleConnect}>Connect Metamask</button>
      <button onClick={handleDisconnect}>Disonnect</button>
    </div>
  );
}
