import './less/index.less';

import { ReactNode, Suspense } from 'react';

interface PreloadAssetsSuspenseProps {
    children: ReactNode;
}

const EntranceLoading = () => (
    <div className="entrance-loading">Loading...</div>
);

const PreloadAssetsSuspense = (props: PreloadAssetsSuspenseProps) => {
    const { children } = props;

    return <Suspense fallback={<EntranceLoading />}>{children}</Suspense>;
};

export default PreloadAssetsSuspense;
