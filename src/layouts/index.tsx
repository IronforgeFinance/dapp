import { IRouteComponentProps } from 'umi';
import './index.less';
import CommonHeader from './components/Header';
import CommonFooter from './components/Footer';
export default function Layout({
  children,
  location,
  route,
  history,
  match,
}: IRouteComponentProps) {
  return (
    <div className="container">
      <CommonHeader />
      {children}
      <CommonFooter />
    </div>
  );
}
