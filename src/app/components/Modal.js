import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, IconButton } from '@mui/material';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import React from 'react';

const Modal = () => {
    /* const {
        modal,
        setModal
    } = useAuth();

    const handleClose = () => {
        setModal({ ...modal, isOpen: false });
    }; */

    /* useEffect(() => {
        if (modal.isOpen === false) {
            if (isAlert && location === 'modal') {
                setAlert({ ...alert, isAlert: false });
            }
        }
    }, [modal?.isOpen]); */
    return (
        <>
            {/* <Dialog open={modal.isOpen} onClose={handleClose}>
            <DialogTitle>
                {modal.title}
                <IconButton
                    aria-label="Close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            {modal.content}
        </Dialog> */}
        </>
    );
};

export default Modal;