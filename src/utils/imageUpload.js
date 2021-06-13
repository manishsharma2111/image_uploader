const imageUpload = async (file) => {
    try {
        console.log('upload', file);
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'mystore');
        data.append('cloud name', 'eeecom');
        const res = await fetch(
            'https://api.cloudinary.com/v1_1/eeecom/image/upload',
            {
                method: 'POST',
                body: data,
            }
        );

        const image = await res.json();
        console.log(image);
        return image.url;
    } catch (error) {
        console.log(error);
    }
};
export default imageUpload;
