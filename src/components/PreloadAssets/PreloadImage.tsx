import { useImage } from 'react-image';

interface PreloadImagesProps {
    image: string;
    onLoad(any?): void;
}

const PreloadImage = (props: PreloadImagesProps) => {
    const { image, onLoad } = props;
    const { src } = useImage({ srcList: image });

    return (
        <img
            src={src}
            onLoad={onLoad}
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
PreloadImage.defaultProps = {
    imageList: [],
};

export default PreloadImage;
