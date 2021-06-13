const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });
function getRadianAngle(degreeValue) {
    return (degreeValue * Math.PI) / 180;
}
export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imageWidth = image.width;
    const imageHeight = image.width;

    const reductionFactor = 0.5;

    const maxSize = Math.max(imageWidth, imageHeight);
    const safeArea =
        2 * (maxSize * reductionFactor * Math.sqrt(1 / reductionFactor));
    canvas.width = safeArea;
    canvas.height = safeArea;
    ctx?.translate(safeArea * reductionFactor, safeArea * reductionFactor);
    ctx?.rotate(getRadianAngle(rotation));
    ctx?.translate(-safeArea * reductionFactor, -safeArea * reductionFactor);
    ctx?.drawImage(
        image,
        (safeArea - imageWidth) * reductionFactor,
        (safeArea - imageHeight) * reductionFactor
    );
    const data = ctx?.getImageData(0, 0, safeArea, safeArea);
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx?.putImageData(
        data,
        Math.round(
            0 -
                safeArea * reductionFactor +
                imageWidth * reductionFactor -
                pixelCrop.x
        ),
        Math.round(
            0 -
                safeArea * reductionFactor +
                imageHeight * reductionFactor -
                pixelCrop.y
        )
    );
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg');
    });
}
