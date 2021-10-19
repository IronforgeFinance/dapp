import React, { useState, useMemo, useRef, useEffect, Fragment } from 'react';
import { useImage } from 'react-image';

interface PreloadImagesProps {
    image: string;
}

export const generateImageList = (files: string[]) => {
    return files.map((file) => `${location.origin}/static/${file}`);
};

const PreloadImages = (props: PreloadImagesProps) => {
    const { image } = props;
    const { src } = useImage({ srcList: image });

    return (
        <img
            src={src}
            style={{
                width: 0,
                height: 0,
                overflow: 'hidden',
                position: 'relative',
                zIndex: -1,
            }}
        />
    );
};

PreloadImages.defaultProps = {
    imageList: [],
};

export default PreloadImages;
