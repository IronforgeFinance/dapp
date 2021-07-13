import React from 'react';
import './index.less';
import useEagerConnect from '@/hooks/useEagerConnect';

export default () => {
  useEagerConnect();
  return <div></div>;
};
