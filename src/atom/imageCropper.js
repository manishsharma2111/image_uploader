import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { DialogActions, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import getCroppedImg from '../utils/canvasUtils';
import handleImageCompress from '../utils/imageCompressor';

const useStyles = makeStyles((theme) => ({
    cropContainer: {
        border: '2px solid pink',
        position: 'relative',
        width: '60vh',
        height: '55vh',
        background: '#333',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        overflow: 'hidden',

        // [theme.breakpoints.up('sm')]: {
        //     height: 400,
        // },
    },
    Button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cropButton: {
        flexShrink: 0,
        marginLeft: '1px',
    },
    controls: {
        padding: 2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            alignItems: 'center',
        },
    },
    sliderContainer: {
        display: 'flex',
        paddingBottom: '2px',
        marginBottom: '1px',
        flex: '1',
        alignItems: 'center',
    },
    sliderLabel: {
        marginRight: '15px',
        // [theme.breakpoints.down('xs')]: {
        //     minWidth: 60,
        // },
    },
    slider: {
        padding: '2px 1px',
        flexDirection: 'column',
        justifyContent: 'cenetr',

        [theme.breakpoints.up('sm')]: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: '1px',
            margin: '0',
        },
    },
}));

const ImageCropper = ({
    image,
    cropShape = 'rect',
    aspect = 1 / 1,
    onImageCropped,
    onCropCancelled,
}) => {
    const [shape] = useState(cropShape);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [, setCroppedImage] = useState(null);
    const ZOOM_SCALING_FACTOR = 100;

    const onCropComplete = useCallback((croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const cropCompleteImage = useCallback(async () => {
        try {
            let croppedImage = await getCroppedImg(image, croppedAreaPixels);
            console.log('donee', croppedImage);
            // await onImageCropped(croppedImage);
            const compressedImage = await handleImageCompress(croppedImage);

            const uploadDate = new Date();

            const compressedFile = new File(
                [compressedImage],
                `${uploadDate.getTime()}.jpeg`,
                { type: 'image/jpeg' }
            );

            onImageCropped && onImageCropped(compressedFile);
            console.log('compressss', compressedFile);
            setCroppedImage(compressedImage);
        } catch (e) {
            console.error(e);
        }
    }, [croppedAreaPixels, image, onImageCropped]);

    const classes = useStyles();
    return (
        <>
            <div className={classes.cropContainer}>
                <Cropper
                    showGrid
                    image={image}
                    aspect={aspect}
                    cropShape={shape}
                    crop={crop}
                    zoom={zoom}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>
            <div className={classes.controls}>
                <div className={classes.sliderContainer}>
                    <Typography
                        variant='h6'
                        gutterBottom
                        classes={{ root: classes.sliderLabel }}
                    >
                        Zoom
                    </Typography>

                    <Slider
                        value={Math.floor(zoom * ZOOM_SCALING_FACTOR)}
                        min={1 * ZOOM_SCALING_FACTOR}
                        max={3 * ZOOM_SCALING_FACTOR}
                        classes={{ root: classes.slider }}
                        onChange={(val) => setZoom(val / ZOOM_SCALING_FACTOR)}
                    />
                </div>
            </div>
            <div className={classes.Button}>
                <Button
                    onClick={onCropCancelled}
                    variant='contained'
                    color='primary'
                    classes={{ root: classes.cropButton }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={cropCompleteImage}
                    variant='contained'
                    color='primary'
                    classes={{ root: classes.cropButton }}
                >
                    Submit
                </Button>
            </div>
        </>
    );
};

export default ImageCropper;
