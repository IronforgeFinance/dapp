import React, { useState, useMemo, useRef, useEffect, Fragment } from 'react';
import { useImage } from 'react-image';

interface PreloadImagesProps {
    image: string;
}

const commonFiles = [
    'common-box-bg.558d532d.png',
    'common-btn-red.8266a4fa.png',
    'mint-select-token-dialog.efa361ab.png',
    'header-logo.d4e433a9.png',
    'npc-dialog-mint-person.617f727c.png',
    'icon-axe.0b91ea44.png',
    'icon-lock.1a41515a.png',
    'icon-coin.6b5dcb6a.png',
    'icon-magic-bottle.56c0fd18.png',
];

export const generateImageList = (files: string[]) => {
    return files
        .concat(commonFiles)
        .map((file) => `${location.origin}/static/${file}`);
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
