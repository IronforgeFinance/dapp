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
      <video loop autoPlay muted>
        <source
          // src="https://blz.nosdn.127.net/1/tm/hearthstone/activities/barrens/landing-kv-dfesffs42.webm"
          src="http://localhost:5000/files/mint.webm" // 必须是服务器提供的视频资源，本地开发使用简单的静态服务器
          type="video/webm"
        />
      </video>
      <CommonHeader />
      {children}
      <CommonFooter />
    </div>
  );
}
