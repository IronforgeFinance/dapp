import React from 'react';
import { useState } from 'react';
import { useFtokenPrice } from '@/hooks/useTokenBalance';
import IconUS from '@/assets/images/us.svg';
import IconTwitter from '@/assets/images/twitter.svg';
import IconGithub from '@/assets/images/github.svg';
import IconMedium from '@/assets/images/medium.svg';

import './index.less';
export default () => {
  const { price, rate } = useFtokenPrice();
  return (
    <div className="footer-container">
      <div className="ftoken-price">
        <span>fToken Price</span>
        <span className="price">${price}</span>
        <span className="rate">{rate}</span>
      </div>
      <div className="footer-info">
        <span className="language">
          <img src={IconUS} alt="" />
          EN
        </span>
        <span className="divider"></span>
        <span className="medias">
          <img src={IconTwitter} alt="" />
          <img src={IconGithub} alt="" />
          <img src={IconMedium} alt="" />
        </span>
      </div>
    </div>
  );
};
