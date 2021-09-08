import React, { createContext, ReactNode, Suspense } from 'react';
import { useState } from 'react';
import { useMemo } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { Fragment } from 'react';
import { useImage } from 'react-image';

interface PreloadImagesProps {
    imageList: string[];
}

const PreloadImages = (props: PreloadImagesProps) => {
    const { imageList } = props;
    const stat = useRef([]);

    /**
     * if (cache[sourceKey].cache === 'resolved') {
     *   return {src: cache[sourceKey].src, isLoading: false, error: null}
     * }
     * useImage每完成一个图片的加载，就会往外边抛一次src
     */
    const { src } = useImage({ srcList: imageList });

    const done = useMemo(() => {
        stat.current.push(src);

        return stat.current.length === imageList.length;
    }, [src]);

    useEffect(() => {
        if (done) {
            console.log('preload images job is done...');
        }
    }, [done]);

    return (
        <Fragment>
            {imageList.map((image) => (
                <img
                    src={image}
                    style={{
                        width: 0,
                        height: 0,
                        overflow: 'hidden',
                        position: 'relative',
                        zIndex: -1,
                    }}
                />
            ))}
        </Fragment>
    );
};

PreloadImages.defaultProps = {
    imageList: [],
};

export default PreloadImages;
