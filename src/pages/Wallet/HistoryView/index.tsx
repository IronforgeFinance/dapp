import './index.less';

const HistoryView = () => {
    return (
        <div className="history-view">
            <ul className="rows">
                <li className="record">
                    <div className="function">
                        <i className="icon mint" />
                        <div className="info">
                            <span>Mint</span>
                            <time>10 Jun,2021 at 3:23 PM</time>
                        </div>
                    </div>
                    <div className="form">
                        From 20 <b>BNB</b>
                    </div>
                    <div className="to">
                        To <b>5</b> fUSD
                    </div>
                    <button className="skip" />
                </li>
                <li className="record">
                    <div className="function">
                        <i className="icon burn" />
                        <div className="info">
                            <span>Burn</span>
                            <time>10 Jun,2021 at 3:23 PM</time>
                        </div>
                    </div>
                    <div className="form">
                        From 20 <b>BNB</b>
                    </div>
                    <div className="to">
                        To <b>5</b> fUSD
                    </div>
                    <button className="skip" />
                </li>
                <li className="record">
                    <div className="function">
                        <i className="icon trade" />
                        <div className="info">
                            <span>Trade</span>
                            <time>10 Jun,2021 at 3:23 PM</time>
                        </div>
                    </div>
                    <div className="form">
                        From 20 <b>BNB</b>
                    </div>
                    <div className="to">
                        To <b>5</b> fUSD
                    </div>
                    <button className="skip" />
                </li>
                <li className="record">
                    <div className="function">
                        <i className="icon pool" />
                        <div className="info">
                            <span>Pool</span>
                            <time>10 Jun,2021 at 3:23 PM</time>
                        </div>
                    </div>
                    <div className="form">
                        From 20 <b>BNB</b>
                    </div>
                    <div className="to">
                        To <b>5</b> fUSD
                    </div>
                    <button className="skip" />
                </li>
            </ul>
        </div>
    );
};

export default HistoryView;
