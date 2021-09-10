import './less/index.less';

import {
    createContext,
    useCallback,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import MintNpcPng from '@/assets/images/npc-dialog-mint-person.png';
import classNames from 'classnames';

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
    const [visable, setVisable] = useState(false);
    const [words, setWords] = useState('');
    const [slowWords, setSlowWords] = useState('1232131231232');
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
            console.log('>> alloc words to array -> %s', word);
            setTimeout(() => setSlowWords(newWords), index * 100);
        });
        // setTimeout(close, wordsArray.length * 100 + 10000);
    }, [words]);

    const close = useCallback(() => {
        setVisable(false);

        /**@description 关闭后清空文字，以便下次触发 */
        setWords('');
        setSlowWords('');
    }, [words]);
    const open = useCallback(() => {
        setVisable(true);

        // 弹出需要一些时间，延迟输出文字的时间
        appearSlowly();
    }, [words]);

    /**@description 若关闭，清空文字；反之打开窗口 */
    useEffect(() => (words?.length > 0 ? open() : close()), [words]);

    return (
        <NpcDialogContext.Provider
            value={{
                words,
                setWords,
            }}
        >
            <section
                className={classNames({
                    'npc-dilaog': true,
                    show: visable,
                    hide: !visable,
                })}
            >
                <div className="dialog-box">
                    <img className="npc" src={MintNpcPng} />
                    <p className="words">
                        <span>{slowWords}</span>
                    </p>
                </div>
            </section>
            {children}
        </NpcDialogContext.Provider>
    );
};

export default NpcDialog;
