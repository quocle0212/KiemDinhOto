import React, { useState, useEffect, memo } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Progress } from 'reactstrap';
import { injectIntl } from 'react-intl';

function LoadingDialog(props) {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const {
        onExportListCustomers,
        title
    } = props

    useEffect(() => {
        let timeoutId;
        if (isDialogVisible) {
            timeoutId = setTimeout(() => {
                onExportListCustomers().then(() => {
                    setIsDialogVisible(false);
                })
            }, 4000);
        }
        return () => clearTimeout(timeoutId);
    }, [isDialogVisible]);

    useEffect(() => {
        if (isDialogVisible) {
        const interval = setInterval(() => {
                if (progress < 100) {
                    setProgress(progress + 1);
                }
            }, 24);
    
            return () => clearInterval(interval);
        }
    }, [progress, isDialogVisible]);
    
return (
    <>
        {/* Dialog Activator */}
        <Button
            disabled={isDialogVisible}
            onClick={() => setIsDialogVisible(true)}
            size="md"
            color='warning'
        >
            {title}
        </Button>

        {/* Dialog */}
        <Modal
            isOpen={isDialogVisible}
            toggle={() => setIsDialogVisible(false)}
            size="sm"
            className={`modal-dialog-centered `}
        >
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
                <Progress animated color="primary" value={progress} />
            </ModalBody>
        </Modal>
    </>
);
}

export default injectIntl(memo(LoadingDialog))
