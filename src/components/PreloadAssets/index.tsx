import './pc.less';
import './mobile.less';

import { ReactNode, Suspense } from 'react';
import { useState, useMemo, useEffect, Fragment } from 'react';
import useEnv from '@/hooks/useEnv';
import PreloadImage from './PreloadImage';

export const generateImageList = (files: string[]) => {
    return files.map((file) => `${location.origin}/static/${file}`);
};

const PreloadAssets = () => {
    const { path, isMobile } = useEnv();

    const preloadImages = useMemo(() => {
        const images = isMobile
            ? require('./mobile.json')
            : require('./pc.json');
        const commonFiles = images.common;
        const pageFiles = images.pages[path];

        return commonFiles.concat(pageFiles);
    }, [path]);

    const assets = generateImageList(preloadImages);

    return (
        <Fragment>
            {assets.map((url) =>
                url ? <PreloadImage key={url} image={url} /> : null,
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
