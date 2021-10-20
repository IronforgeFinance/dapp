import { unmountComponentAtNode } from 'react-dom';
import { useImage } from 'react-image';

interface PreloadImagesProps {
    image: string;
}

const PreloadImage = (props: PreloadImagesProps) => {
    const { image } = props;
    const { src } = useImage({ srcList: image });

    return (
        <img
            src={src}
            onLoad={(event) => {
                const node: HTMLElement = event.currentTarget;
                unmountComponentAtNode(node);
            }}
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
