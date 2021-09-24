import './pc.less';
import './mobile.less';

import 'react';
import RecordBoard from '../RecordBoard';
import DebtItem from '@/pages/Burn/components/DebtItem';
import { useContext } from 'react';
import { MyDebtsContext } from './provider';

export const useMyDebts = () => {
    return useContext(MyDebtsContext);
};

export default () => {
    const { visible, close } = useContext(MyDebtsContext);

    return (
        <RecordBoard visible={visible} title="Your Debt" close={close}>
            <DebtItem />
        </RecordBoard>
    );
};
