import React from 'react'
import './index.less'
interface IProps {
    receivedAmount: number
    receivedToken: string
    feeRate: number
}
export default (props: IProps) => {
    return <div className="estimate-container">
        <div className="data-item">
            <p className="label">Mininum received</p>
            <p className="value">{props.receivedAmount} {props.receivedToken}</p>
        </div>
        <div className="data-item">
            <p className="label">Price impact</p>
            <p className="value">0</p>
        </div>
        <div className="data-item">
            <p className="label">Fee cost</p>
            <p className="value">{props.feeRate * 100 + '%'}</p>
        </div>
    </div>
}