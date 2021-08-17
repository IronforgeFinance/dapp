import React from 'react';
import IconTwitter from '@/assets/images/twitter.svg';
import IconGithub from '@/assets/images/github.svg';
import IconMedium from '@/assets/images/medium.svg';
import { useFtokenPrice, useGetBnbBalance } from '@/hooks/useTokenBalance';

import './index.less';
export default () => {
    const { price, rate } = useFtokenPrice();
    const { balance } = useGetBnbBalance();

    return (
        <div className="footer-container">
            <div className="entries">
                <button className="btn-history" />
                <button className="btn-52days" />
            </div>
            <div className="ftoken">
                <p className="price">
                    <span className="symbol">$</span>
                    {price}
                </p>
                <p className="label">
                    fToken Price <span className="rate">{rate}</span>
                </p>
            </div>
            <button className="btn-buy-token common-btn common-btn-red">
                Buy Token
            </button>
            {/* <p className="balance">Balance: {balance}</p> */}
            <div className="medias">
                <img key={1} src={IconTwitter} />
                <img key={2} src={IconGithub} />
                <img key={3} src={IconMedium} />
            </div>
        </div>
    );
};
