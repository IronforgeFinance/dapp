import './less/index.less';

import { useState, Fragment, useEffect, ReactNode, useContext } from 'react';
import { Drawer } from 'antd';
import { history } from 'umi';
import { useCallback } from 'react';
import Footer from '@/layouts/components/Footer';
import { MobileNavigationContext } from './provider';

const menuItems = [
    { name: 'HOME', path: '/' },
    { name: 'MINT', path: '/mint' },
    { name: 'BURN', path: '/burn' },
    { name: 'TRADE', path: '/trade' },
    { name: 'FARM', path: '/farm' },
    // { name: 'POOL', path: '/pool' },
    { name: 'WALLET', path: '/wallet' },
];

export interface MobileNavigationProps {
    children?: ReactNode;
}

export const useMobileNavigation = () => {
    return useContext(MobileNavigationContext);
};

const MobileNavigation = (props: MobileNavigationProps) => {
    const { children } = props;
    const [pathname, setPathname] = useState('/');
    const { visible, setVisible } = useContext(MobileNavigationContext);

    const open = () => setVisible(true);
    const close = () => setVisible(false);
    const changeLink = useCallback((path) => {
        close();
        setTimeout(() => history.push(path), 100);
    }, []);

    useEffect(() => {
        setPathname(location.pathname);
        return history.listen((location) => setPathname(location.pathname));
    }, []);

    return (
        <Fragment>
            <button className="icon-nav-stretch" onClick={open} />
            <Drawer
                placement="right"
                onClose={close}
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
            {children}
        </Fragment>
    );
};

export default MobileNavigation;
