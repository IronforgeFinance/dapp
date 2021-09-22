import './less/index.less';

import {
    createContext,
    useCallback,
    useState,
    useEffect,
    ReactNode,
    useMemo,
    useRef,
} from 'react';
import MintNpcPng from '@/assets/images/npc-dialog-mint-person.png';
import HomeNpcPng from '@/assets/images/npc-dialog-home-person.png';
import classNames from 'classnames';
import { history } from 'umi';
import useEnv from '@/hooks/useEnv';

interface NpcDialogContextProps {
    words: string;
    setWords(words: string): void;
}

interface NpcDialog {
    children: ReactNode;
}

export const NpcDialogContext = createContext<NpcDialogContextProps | null>(
    null,
);
export const NpcDialogContextProvier = NpcDialogContext.Provider;

const NpcDialog = (props: NpcDialog) => {
    const { children } = props;
    const isMobile = useEnv();
    const [visable, setVisable] = useState(false);
    const [words, setWords] = useState('');
    const [slowWords, setSlowWords] = useState('');
    const [pathname, setPathname] = useState('/mint');
    const tmKeys = useRef([]);
    const delayKey = useRef(null);
    // const totalTm = useRef(0);
    /**
     * @function appearSlowly
     * @description 逐渐输出文字的效果
     */
    const appearSlowly = useCallback(() => {
        // 执行len个文字输出的update任务
        /**@todo 递归 */
        const wordsArray = words.split('');
        wordsArray.forEach((word, index) => {
            const newWords = words.slice(0, index + 1);
            // console.log('>> alloc words to array -> %s', word);
            tmKeys.current.push(
                setTimeout(() => setSlowWords(newWords), index * 100),
            );
        });

        // 5s后自动隐藏
        // delayKey.current = setTimeout(close, wordsArray.length * 100 + 5000);
    }, [words]);

    const close = useCallback(() => {
        clearTimeout(delayKey.current);
        clearTms();
        setVisable(false);

        /**@description 关闭后清空文字，以便下次触发 */
        setWords('');
        setSlowWords('');
    }, [words]);
    const open = useCallback(() => {
        clearTimeout(delayKey.current);
        clearTms();
        setVisable(true);

        // 弹出需要一些时间，延迟输出文字的时间
        appearSlowly();
    }, [words]);

    const isHome = useMemo(() => pathname === '/', [pathname]);

    const clearTms = useCallback(
        () => tmKeys.current.forEach((key) => clearTimeout(key)),
        [],
    );

    /**@description 若关闭，清空文字；反之打开窗口 */
    useEffect(() => (words?.length > 0 ? open() : close()), [words]);

    /**@description 根据不同的路由弹出不同的NPC */
    useEffect(() => {
        setPathname(location!.pathname);
        return history.listen((location) => setPathname(location.pathname));
    }, []);

    /**@description 清除所有timeout */
    useEffect(() => clearTms, []);

    return (
        <NpcDialogContext.Provider
            value={{
                words,
                setWords,
            }}
        >
            {!isMobile && (
                <section
                    className={classNames({
                        'npc-dilaog': true,
                        show: visable,
                        hide: !visable,
                    })}
                >
                    <div
                        className={classNames({
                            'dialog-box': true,
                            home: isHome,
                        })}
                    >
                        <img
                            className={classNames({ npc: true, home: isHome })}
                            src={isHome ? HomeNpcPng : MintNpcPng}
                        />
                        <p className="words">
                            <span>{slowWords}</span>
                            <a onClick={close}>我知道了</a>
                        </p>
                    </div>
                </section>
            )}
            {children}
        </NpcDialogContext.Provider>
    );
};

export default NpcDialog;
