import { useRef, useState, useEffect } from 'react';
import { Slider, Popover } from 'antd';
import classnames from 'classnames';
import useEnv from '@/hooks/useEnv';
import DividerV from '@/assets/images/divider-v.png';
interface IRatioSliderProps {
    value: number;
    onChange: (v: number) => void;
    safeRatio: number;
}
const DEFAULT_MARKS = {
    20: {
        // label: <strong>200%</strong>,
    },
    50: {
        // label: <strong>500%</strong>,
    },
    80: {
        // label: <strong>800%</strong>,
    },
};
const RatioSlider = (props: IRatioSliderProps) => {
    const { value, onChange, safeRatio } = props;
    const isMobile = useEnv();
    const ref = useRef<HTMLDivElement>(null);
    const [marks, setMarks] = useState<any>(DEFAULT_MARKS);

    useEffect(() => {
        if (safeRatio) {
            const _marks = {
                20: {},
                [safeRatio]: {},
                80: {},
            };
            setMarks(_marks);
        }
    }, [safeRatio]);

    return (
        <div className="ratio" ref={ref}>
            <div className="safe-tip" style={{ left: safeRatio + '%' }}>
                <img
                    src={DividerV}
                    alt=""
                    className="icon-divider"
                    onClick={() => {
                        onChange(safeRatio);
                    }}
                />
                <p>
                    <span>Safe: {safeRatio * 10}%</span>
                    <Popover
                        content={'关于safe的文案'}
                        trigger="hover"
                        placement="topLeft"
                    >
                        <i
                            className={`icon-question size-${
                                isMobile ? 24 : 16
                            }`}
                        />
                    </Popover>
                </p>
            </div>
            <Slider
                className={classnames({
                    'iron-progress': true,
                    'iron-progress-low': value <= 20,
                    'iron-progress-safe': value >= 50,
                    'iron-progress-faraway-safe': value >= 80,
                })}
                tooltipVisible={true}
                tooltipPlacement="bottom"
                // tooltipPrefixCls="custom-ratio"
                getTooltipPopupContainer={() => ref.current}
                tipFormatter={(v) => (
                    <span className="custom-ratio-tooltip-text">
                        <Popover
                            content={
                                value < safeRatio
                                    ? 'F-ratio is low'
                                    : 'F-ratio is ok'
                            }
                            trigger="hover"
                            placement="right"
                        >
                            {v * 10 + '%'}
                        </Popover>
                    </span>
                )}
                step={0.1}
                value={value}
                min={0}
                max={100}
                marks={marks}
                onChange={onChange}
            />
        </div>
    );
};

export default RatioSlider;
