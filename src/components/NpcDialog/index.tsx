import './pc.less';
import './mobile.less';

import {
    useCallback,
    useState,
    useLayoutEffect,
    useContext,
    ReactNode,
    useMemo,
    useRef,
    Fragment,
} from 'react';
import LeftNpcPng from '@/assets/images/npc-dialog-mint-person.png';
import RightNpcPng from '@/assets/images/npc-dialog-home-person.png';
import classNames from 'classnames';
import { NpcDialogContext } from './provider';
import { useLang } from '@/layouts/components/LangSwitcher';
import useEnv from '@/hooks/useEnv';
import { TokenSelectorContext } from '../TokenSelector/provider';

interface NpcDialog {
    children?: ReactNode;
}

export const useNpcDialog = () => {
    return useContext(NpcDialogContext);
};

const NpcDialog = (props: NpcDialog) => {
    const { children } = props;
    const [visable, setVisable] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [showISee, setShowISee] = useState(false);
    const { words, setWords } = useContext(NpcDialogContext);
    const [slowWords, setSlowWords] = useState('');
    const tmKeys = useRef([]);
    const { lang } = useLang();
    const delayKey = useRef(null);
    const { path } = useEnv();
    const { visible: tokenSelectorVisible } =
        useContext(TokenSelectorContext) ?? {};
    // const totalTm = useRef(0);

    /**@type {number} outputGap 输出时间的间隔 */
    const outputGap = useMemo(() => (lang === 'EN' ? 30 : 100), [lang]);

    /**
     * @function appearSlowly
     * @description 逐渐输出文字的效果
     */
    const appearSlowly = useCallback(() => {
        // 执行len个文字输出的update任务
        const wordsArray = words.split('');
        wordsArray.forEach((word, index) => {
            const newWords = words.slice(0, index + 1);
            // console.log('>> alloc words to array -> %s', word);
            tmKeys.current.push(
                setTimeout(() => setSlowWords(newWords), index * outputGap),
            );
        });

        // I see...
        tmKeys.current.push(
            setTimeout(() => setShowISee(true), wordsArray.length * outputGap),
        );

        // 5s后自动隐藏
        // delayKey.current = setTimeout(close, wordsArray.length * 100 + 5000);
    }, [words]);

    const close = useCallback(() => {
        clearTimeout(delayKey.current);
        clearTms();
        setVisable(false);
        setShowISee(false);

        /**@description 关闭后清空文字，以便下次触发 */
        setTimeout(() => {
            setWords('');
            setSlowWords('');
        }, 200);
    }, [words]);
    const open = useCallback(() => {
        clearTimeout(delayKey.current);
        clearTms();
        setVisable(true);
        setShowISee(false);

        // 弹出需要一些时间，延迟输出文字的时间
        appearSlowly();
    }, [words]);

    const isRightNpc = useMemo(() => path === '/burn', [path]);

    const clearTms = useCallback(
        () => tmKeys.current.forEach((key) => clearTimeout(key)),
        [],
    );

    /**@description 若关闭，清空文字；反之打开窗口 */
    useLayoutEffect(() => {
        words?.length > 0 ? open() : close();
    }, [words]);

    useLayoutEffect(() => {
        // 延迟加载
        setTimeout(() => setLoaded(true), 200);

        return () => {
            // all clear
            setLoaded(false);
            close();
        };
    }, [path]);

    return (
        <Fragment>
            {loaded && (
                <section
                    className={classNames({
                        'npc-dilaog': true,
                        show: visable,
                        hide: !visable,
                        'is-right': isRightNpc,
                        'fix-bottom': tokenSelectorVisible,
                    })}
                >
                    <div
                        className={classNames({
                            'dialog-box': true,
                            'is-right': isRightNpc,
                        })}
                    >
                        <img
                            className={classNames({
                                npc: true,
                                'is-right': isRightNpc,
                            })}
                            src={isRightNpc ? RightNpcPng : LeftNpcPng}
                        />
                        <p
                            className={classNames({
                                words,
                                'is-right': isRightNpc,
                            })}
                        >
                            <span>{slowWords}</span>
                            {showISee && <a onClick={close}>我知道了</a>}
                        </p>
                    </div>
                </section>
            )}
            {children}
        </Fragment>
    );
};

export default NpcDialog;
