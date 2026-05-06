import React from "react";
import Modal from '@mui/material/Modal';

const MyBlockingModal = ({ children, maxWidth, open = false }) => {
    return (
        <>
            <Modal open={open} onClose={null} sx={{
                "&.MuiModal-root .MuiBackdrop-root": {
                    backgroundColor: 'transparent',
                    opacity: '1 !important',
                },
            }}>
                <div style={{ backgroundColor: 'rgba(12, 17, 29, 0.7)', backdropFilter: 'blur(4px)' }}
                    className="w-full h-full flex items-center justify-center relative">
                    <div id="my-modal-loading" style={{ maxWidth: maxWidth && maxWidth !== 0 ? `${maxWidth}px` : '' }} className={`${maxWidth && maxWidth !== 0 ? 'w-full' : ''}`}>
                        {children}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default MyBlockingModal;