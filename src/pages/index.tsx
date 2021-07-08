import styles from './index.less';
import useAuth from '@/hooks/useAuth';
import { ConnectorNames } from '@/utils/web3';
import { useWeb3React } from '@web3-react/core';
export default function IndexPage() {
  const { account } = useWeb3React();
  const { login, logout } = useAuth();
  const handleConnect = () => {
    login(ConnectorNames.Injected);
  };
  const handleDisconnect = () => {
    logout();
  };
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <h1 className={styles.title}>{account}</h1>

      <button onClick={handleConnect}>Connect Metamask</button>
      <button onClick={handleDisconnect}>Disonnect</button>
    </div>
  );
}
