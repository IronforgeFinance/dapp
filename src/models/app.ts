import { useState, useEffect } from 'react';
import { throttle } from 'lodash';

const MOBILE_WIDTH = 414;
const useAppModel = () => {
  const [isMobile, setIsMobile] = useState(false);
  const getWindowScreen = throttle(() => {
    const isMobile = window.innerWidth <= MOBILE_WIDTH;
    setIsMobile(isMobile);
  }, 100);
  useEffect(() => {
    window.addEventListener('resize', getWindowScreen, false);
    return () => {
      window.removeEventListener('resize', getWindowScreen, false);
    };
  }, []);
  return { isMobile };
};

export default useAppModel;
