import './pc.less';
import './mobile.less';

import 'react';
import RecordBoard from '../RecordBoard';
import DeliveryView from './DeliveryView';
import { useContext } from 'react';
import { DeliveryHistoryContext } from './provider';

export const useDeliveryHistory = () => {
    return useContext(DeliveryHistoryContext);
};

export default () => {
    const { visible, close } = useContext(DeliveryHistoryContext);

    return (
        <RecordBoard visible={visible} title="Delivery" close={close}>
            <DeliveryView />
        </RecordBoard>
    );
};
