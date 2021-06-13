import imageCompression from 'browser-image-compression';

const handleImageCompress = async (image) => {
    console.log('ImageIn', image);
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
    };

    try {
        const compressedFile = await imageCompression(image, options);
        console.log('compressedFile', compressedFile);

        return compressedFile;
    } catch (error) {
        console.log(error);
    }
};
export default handleImageCompress;
