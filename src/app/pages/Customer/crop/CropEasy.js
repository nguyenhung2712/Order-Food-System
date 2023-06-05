import { Cancel } from '@mui/icons-material';
import CropIcon from '@mui/icons-material/Crop';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Slider,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import useAuth from '../../../hooks/useAuth';
import getCroppedImg from './cropImage';

const CropEasy = ({ photoURL, setOpenCrop, setPhotoURL, setFile, open, handleClose }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const cropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const cropImage = async () => {
        try {
            const { file, url } = await getCroppedImg(
                photoURL,
                croppedAreaPixels,
                rotation
            );
            setPhotoURL(url);
            setFile(file);
            setOpenCrop(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogContent
                dividers
                sx={{
                    background: '#333',
                    position: 'relative',
                    height: 400,
                    width: 'auto',
                    minWidth: { sm: 500 },
                }}
            >
                <Cropper
                    image={photoURL}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    onCropChange={setCrop}
                    onCropComplete={cropComplete}
                />
            </DialogContent>
            <DialogActions sx={{ flexDirection: 'column', mx: 3, my: 2 }}>
                <Box sx={{ width: '100%', mb: 1 }}>
                    <Box>
                        <Typography>Phóng to: {zoomPercent(zoom)}</Typography>
                        <Slider
                            valueLabelDisplay="auto"
                            valueLabelFormat={zoomPercent}
                            min={1}
                            max={4}
                            step={0.1}
                            value={zoom}
                            onChange={(e, zoom) => setZoom(zoom)}
                        />
                    </Box>
                    <Box>
                        <Typography>Xoay: {rotation + '°'}</Typography>
                        <Slider
                            valueLabelDisplay="auto"
                            min={0}
                            max={360}
                            value={rotation}
                            onChange={(e, rotation) => setRotation(rotation)}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        flexWrap: 'wrap',
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={() => setOpenCrop(false)}
                    >
                        Giữ nguyên
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<CropIcon />}
                        onClick={cropImage}
                    >
                        Cắt
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default CropEasy;

const zoomPercent = (value) => {
    return `${Math.round(value * 100)}%`;
};