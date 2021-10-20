import { useImage } from 'react-image';

interface PreloadImagesProps {
    image: string;
}

const PreloadImage = (props: PreloadImagesProps) => {
    const { image } = props;
    useImage({ srcList: image });

    return null;
};
PreloadImage.defaultProps = {
    imageList: [],
};

export default PreloadImage;
