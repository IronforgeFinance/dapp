import dayjs from 'dayjs';
import arraySupport from 'dayjs/plugin/arraySupport';
dayjs.extend(arraySupport);
//quarter is like 202112
export const getRemainDaysOfQuarterAsset = (quarter: string) => {
    if (!quarter || !/^\d+$/.test(quarter)) return null;

    try {
        let date = dayjs([
            Number(quarter.substr(0, 4)),
            Number(quarter.substr(5)),
        ]).endOf('month');
        while (date.day() !== 5) {
            date = date.subtract(1, 'days');
        }
        const days = date.diff(new Date(), 'days');
        if (date.isBefore(new Date())) {
            return -1 * days;
        }
        console.log('remain days: ', days);
        return days;
    } catch (error) {
        console.error(error);
    }
};

//TODO 判断是否是季度合约资产。目前判断方法比较简单
export const isDeliveryAsset = (token: string) => {
    if (!token) return false;
    return token.includes('-'); //quarter is like lBTC-202112
};
