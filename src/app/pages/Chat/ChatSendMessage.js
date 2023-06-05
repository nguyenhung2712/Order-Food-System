import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { Fab, Grid, TextField, IconButton, ImageList, ImageListItem, Box, styled, Backdrop } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import useAuth from '../../hooks/useAuth';
import { addDocument } from '../../services/firebase/service';
import MessageService from '../../services/message.service';
import { AppContext } from '../../contexts/AppContext';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';

const IconButtonTopImage = styled(IconButton)(() => ({
    position: "absolute",
    zIndex: 9999,
    top: 0,
    right: 0
}));

const ChatSendMessage = () => {
    const inputRef = useRef();
    const uploadRef = useRef();
    const { user: { id } } = useAuth();
    const [isLoading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState();
    const [images, setImages] = useState("");

    const { selectedRoom } = React.useContext(AppContext);

    const handleSend = async () => {
        setLoading(true);
        const text = message;
        let imageRes;
        if (formData && formData.get("images")) {
            imageRes = await MessageService.uploadImage(formData);
        }
        setMessage("");
        setImages([]);
        await addDocument("messages", {
            text: text ? text : null,
            adminId: id,
            roomId: selectedRoom.id,
            readBy: [],
            images: imageRes ? imageRes.data.image : null,
            status: 1
        })
            .then(res => {
                if (inputRef.current) {
                    setTimeout(() => {
                        inputRef.current.focus();
                    });
                }
                setLoading(false);
            });
        setLoading(false);
    }

    const uploadMultipleFiles = (event) => {
        let uploadData = new FormData();
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            uploadData.append("images", event.target.files[i]);
            setImages(curr => [...curr, { url: URL.createObjectURL(files[i]), file: event.target.files[i] }]);
        }
        setFormData(uploadData);
    }

    return (
        <>
            {
                images && images.length > 0 &&
                <Box sx={{ padding: "0 14px", display: "flex", justifyContent: "center", alignItems: "center", overflowX: "auto" }}>
                    <ImageList sx={{ width: "100%", height: 164 }} cols={4} rowHeight={164}>
                        {images.map((image, index) => (
                            <ImageListItem key={index}>
                                <img
                                    src={`${image.url}?w=164&h=164&fit=crop&auto=format`}
                                    srcSet={`${image.url}`}
                                    alt={image.url}
                                    loading="lazy"
                                    style={{ borderRadius: "20px", overflow: "hidden" }}
                                />
                                <IconButtonTopImage
                                    aria-label="delete"
                                    color="error"
                                    onClick={() => {
                                        let fData = new FormData();
                                        let values = formData.getAll("images");
                                        let index = values.indexOf(image.file);
                                        values.splice(index, 1);
                                        for (let i = 0; i < values.length; i++) {
                                            fData.append("images", values[i])
                                        }
                                        setFormData(fData);
                                        setImages(curr => curr.filter(imageUrl => imageUrl.url !== image.url));
                                    }}
                                >
                                    <DeleteIcon
                                        color="error"
                                    />
                                </IconButtonTopImage>
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>
            }
            <Grid
                container
                sx={{
                    display: "flex",
                    alignItems: "center",
                    margin: "0 8px",
                    padding: "4px",
                    height: '40px',
                }}
            >
                <Grid item lg={11} md={11} sm={11} xs={11} sx={{ position: "relative" }}>
                    <TextField
                        id="outlined-basic-email"
                        label="Nhập tin nhắn..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSend();
                            }
                        }}
                        ref={inputRef}
                        fullWidth
                        inputProps={{
                            style: { paddingRight: '40px' },
                        }}
                        disabled={isLoading}
                    />
                    <Box sx={{ position: "absolute", right: "14px", top: "7px", display: "flex", alignItems: "center" }}>
                        {isLoading && <CircularProgress />}
                        <IconButton
                            onClick={() => uploadRef.current.click()}
                            disabled={isLoading}
                        >
                            <CameraAltIcon />
                        </IconButton>
                    </Box>
                    <input
                        id={`image-upload`}
                        ref={uploadRef}
                        type="file"
                        accept=".jpg,.png,.jpeg"
                        style={{ display: 'none' }}
                        onChange={uploadMultipleFiles}
                        multiple
                    />
                </Grid>
                <Grid item lg={1} md={1} sm={1} xs={1}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Fab
                        size="small"
                        color="primary"
                        aria-label="add"
                        onClick={handleSend}
                        disabled={isLoading}
                    ><SendIcon /></Fab>
                </Grid>
            </Grid >
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    )
}

export default ChatSendMessage;