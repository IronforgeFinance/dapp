import './pc.less';
import './mobile.less';

import { ReactNode, Suspense } from 'react';
import { useState, useMemo, useEffect, Fragment } from 'react';
import usePreloadImages from './usePreloadImages';
import useEnv from '@/hooks/useEnv';
import PreloadImage from './PreloadImage';

export const generateImageList = (files: string[]) => {
    return files.map((file) => `${location.origin}/static/${file}`);
};

const PreloadAssets = () => {
    const { preloadImages } = usePreloadImages();
    const { path } = useEnv();
    const [doneAssetsLen, setDoneAssetsLen] = useState(0);
    const assets = generateImageList(preloadImages);

    useEffect(() => {
        setDoneAssetsLen(0);
    }, [path]);

    const canCancelNodes = useMemo(() => {
        return doneAssetsLen === preloadImages.length;
    }, [doneAssetsLen]);

    return (
        <Fragment>
            {!canCancelNodes &&
                assets.map((url) =>
                    url ? (
                        <PreloadImage
                            key={url}
                            image={url}
                            onLoad={() => setDoneAssetsLen(doneAssetsLen + 1)}
                        />
                    ) : null,
                )}
        </Fragment>
    );
};

interface PreloadSuspenseProps {
    children: ReactNode;
    loading: ReactNode;
}
PreloadAssets.Suspense = (props: PreloadSuspenseProps) => {
    const { children, loading } = props;

    return (
        <Suspense fallback={<div className="entrance-loading">{loading}</div>}>
            {children}
        </Suspense>
    );
};

export default PreloadAssets;
