import { useImage } from 'react-image';

interface PreloadImageProps {
    image: string;
}

const PreloadImage = (props: PreloadImageProps) => {
    const { image } = props;
    useImage({ srcList: image });

    return null;
};
PreloadImage.defaultProps = {
    imageList: [],
};

export default PreloadImage;
