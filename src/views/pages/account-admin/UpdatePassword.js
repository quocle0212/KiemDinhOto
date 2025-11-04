import {Button, FormGroup, Input, Label, Modal, ModalBody, ModalHeader} from "reactstrap";

import React, {useState} from "react";

const ModalUpdatePassword=(props)=>{
    return(
        <div>
            <Modal
                isOpen={props?.IsOpenModal}
                className={`modal-dialog-centered `}
            >
                <ModalHeader
                    toggle={() => props.setIsOpenModal(false)}
                >
                    Đôi mật khẩu
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>Mật khẩu mới</Label>
                        <Input
                            value={props.passwordToUpdate ||""}
                            onChange={e=>props.handleChangeInput("passwordToUpdate",e)}
                            placeholder={"Vui lòng nhập mật khẩu mới"}
                        />

                    </FormGroup>
                    <Button
                        onClick={()=>{
                            props.handleUpdatePassword()
                            // props.setIsOpenModal(false)
                        }
                        }
                        className="mt-1"
                        color={"primary"}
                    >
                        Xác nhận
                    </Button>
                </ModalBody>
            </Modal>
        </div>
    )
}
export default ModalUpdatePassword