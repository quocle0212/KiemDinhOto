import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";

function ModalDeleteSupportChat(props) {
    return (
        <div>
            <Modal
                isOpen={props?.isOpenModal}
                className={`modal-dialog-centered `}
            >
                <ModalHeader
                    toggle={() => props.setIsOpenModal(false)}
                >
                    Xoá tin nhắn chat
                </ModalHeader>
                <ModalBody>
                    <h4>Bạn muốn xoá tin nhắn chat này không?
                    </h4>
                    <br />
                    <br />

                    <div className={"d-flex justify-content-end"} >
                        <Button
                            style={{ width: "105px", marginRight: "20px" }}
                            onClick={() => {
                                props.setIsOpenModal(false)
                            }}
                            color={"primary"}
                        >
                            Huỷ
                        </Button>
                        <Button
                            onClick={() => {
                                props?.handleDeteleChat()
                                props?.setIsOpenModal(false)
                            }}
                            color={"primary"}
                        >
                            Xác nhận
                        </Button>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default ModalDeleteSupportChat;