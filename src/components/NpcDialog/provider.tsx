import './less/index.less';

import { createContext, useState, ReactNode } from 'react';

interface NpcDialogContextProps {
    words: string;
    setWords(words: string): void;
}

interface NpcDialogContextProviderProps {
    children: ReactNode;
}

export const NpcDialogContext = createContext<NpcDialogContextProps | null>(
    null,
);

const NpcDialogContextProvier = NpcDialogContext.Provider;

const NpcDialog = (props: NpcDialogContextProviderProps) => {
    const { children } = props;
    const [words, setWords] = useState('');

    return (
        <NpcDialogContextProvier
            value={{
                words,
                setWords,
            }}
        >
            {children}
        </NpcDialogContextProvier>
    );
};

export default NpcDialog;
