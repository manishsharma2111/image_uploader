import React, { useCallback, useMemo, useState } from 'react';
import {
    Dialog,
    DialogContent,
    makeStyles,
    Grid,
    DialogTitle,
    DialogContentText,
} from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useDropzone } from 'react-dropzone';
import imageUpload from './utils/imageUpload';
import ImageCropper from './atom/imageCropper';
import { useField } from 'formik';
import PlaceHolder from './atom/placeHolder';

const useStyles = makeStyles((theme) => ({
    baseStyle: {
        width: '200px',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        backgroundColor: 'white',
        color: '#bdbdbd',
        transition: 'border .3s ease-in-out',
    },
    imageStyle: {
        width: '200px',
        height: '200px',
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid red',
        padding: '300px',
        marging: '200px',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid blue',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const DropzoneComponent = ({ name, placeHolder }) => {
    const [field, meta, helpers] = useField(name);
    const [file, setFile] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    // const [image, setImage] = useState(null);

    const handleCropCancelled = () => {
        setFile(null);
        setShowCropper(false);
    };

    const handleChange = useCallback(
        (val) => {
            helpers.setValue(val);
        },
        [helpers]
    );

    const onDrop = useCallback(
        async (acceptedFiles) => {
            // setFiles(
            //   acceptedFiles.map((file) =>
            //     Object.assign(file, {
            //       preview: URL.createObjectURL(file),
            //     })
            //   )
            // );
            if (acceptedFiles[0]) {
                if (field && acceptedFiles && acceptedFiles[0]) {
                    let imageUrl = await readFile(acceptedFiles[0]);
                    setFile(imageUrl);

                    setShowCropper(true);
                }

                // console.log('imagedropped', imageUrl);

                //  let compressedImage = await handleImageCompress(acceptedFiles[0]);
                // let imageUrl = await readFile(compressedImage);
                //setImage(compressedImage);
            }
        },
        [field]
    );

    const handleImageCropped = useCallback(async (image) => {
        console.log('image crop', image);
        setShowCropper(false);
        try {
            //let compressedImage = await handleImageCompress(image);

            const response = await imageUpload(image);
            // await new Promise((resolve) => {
            //     setTimeout(() => {
            //         resolve();
            //     }, 2000);
            // });

            if (response) {
                handleChange(response);
            }

            //setImage(image);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png',
    });

    const classes = useStyles();
    const Image = useMemo(() => {
        return <img src={meta.value} alt='' className={classes.imageStyle} />;
    }, [meta.value]);

    return (
        <>
            <PlaceHolder {...getRootProps()}>
                <input {...getInputProps()} />
                {meta.value ? Image : null}
            </PlaceHolder>
            <Dialog
                open={showCropper}
                onClose={handleCropCancelled}
                style={{ width: '100%', height: '100%' }}
            >
                <DialogContent>
                    <DialogTitle
                        id='form-dialog-title'
                        style={{
                            textAlign: 'center',
                            paddingTop: '1px',
                            paddingBottom: '3px',
                        }}
                    >
                        Profile Pic Upload
                    </DialogTitle>
                    <DialogContentText style={{ textAlign: 'center' }}>
                        Please Upload a JPEG or a PNG format image.
                    </DialogContentText>
                    <ImageCropper
                        image={file}
                        onImageCropped={handleImageCropped}
                        onCropCancelled={handleCropCancelled}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result), false);
        reader.readAsDataURL(file);
    });
}

export default DropzoneComponent;
