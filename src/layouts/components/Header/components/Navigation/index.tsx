import './less/index.less';

import { useState, Fragment, useEffect } from 'react';
import { Drawer } from 'antd';
import { history } from 'umi';
import { useCallback } from 'react';
import Footer from '@/layouts/components/Footer';

const menuItems = [
    { name: 'HOME', path: '/' },
    { name: 'MINT', path: '/mint' },
    { name: 'BURN', path: '/burn' },
    { name: 'TRADE', path: '/trade' },
    { name: 'FARM', path: '/farm' },
    { name: 'POOL', path: '/pool' },
    { name: 'WALLET', path: '/wallet' },
];

const MobileHeader = () => {
    const [visible, setVisible] = useState(false);
    const [pathname, setPathname] = useState('/');

    const showDrawer = () => setVisible(true);
    const onClose = () => setVisible(false);
    const changeLink = useCallback((path) => {
        onClose();
        setTimeout(() => history.push(path), 100);
    }, []);

    useEffect(() => {
        setPathname(location.pathname);

        return history.listen((location) => setPathname(location.pathname));
    }, []);

    return (
        <Fragment>
            <button className="icon-nav-stretch" onClick={showDrawer} />
            <Drawer
                placement="right"
                onClose={onClose}
                visible={visible}
                className="custom-navigation"
                closable={false}
            >
                <i className="logo" />
                <ul className="menu-group">
                    {menuItems.map((item) => (
                        <li
                            onClick={changeLink.bind(this, item.path)}
                            key={item.path}
                            className={`menu-item ${
                                pathname === item.path ? 'active' : ''
                            }`}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
                <Footer />
            </Drawer>
        </Fragment>
    );
};

export default MobileHeader;
