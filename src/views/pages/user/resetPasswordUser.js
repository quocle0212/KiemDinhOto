import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { injectIntl } from "react-intl";
import { toast } from "react-toastify";
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import Service from "../../../services/request";
import UserService from '../../../services/userService'

function ResetPasswordUser({ intl, item, toggleSidebar, open }) {
  const [newPassword, setNewPassword] = useState("");

  const newPasswordChangeHandler = (event) => {
    setNewPassword(event.target.value);
  };
  const { register, errors} = useForm({
  });
  const handleUpdatePassword = () => {
    const params = {
      id: item.appUserId,
      newPassword: newPassword,
    };
    UserService.ResetPasswordUser(params).then((res) => {
      if (res) {
        const { statusCode } = res;
        if (statusCode === 200) {
          toggleSidebar();
          toast.success(
            intl.formatMessage(
              { id: "actionSuccess" },
              { action: intl.formatMessage({ id: "resetPass" }) }
            )
          );
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "resetPass" }) }
            )
          );
        }
      } else {
      }
    });
  };

  return (
    <Modal
      isOpen={open}
      toggle={toggleSidebar}
      className={`modal-dialog-centered `}
    >
      <ModalHeader toggle={toggleSidebar}>
        {intl.formatMessage({ id: "resetPass" })}
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="newPassword">
            {intl.formatMessage({ id: "newPassword" })}
          </Label>
          <Input
            id="newPassword"
            name="newPassword"
            innerRef={register({ required: true })}
            invalid={errors.newPassword && true}
            placeholder="123456789"
            value={newPassword}
            onChange={newPasswordChangeHandler}
          />
        </FormGroup>
        <FormGroup className="d-flex mb-0">
          <Button.Ripple
            className="mr-1"
            color="primary"
            type="submit"
            onClick={(e) => {
              handleUpdatePassword(e);
            }}
          >
            Submit
          </Button.Ripple>
        </FormGroup>
      </ModalBody>
    </Modal>
  );
}

export default injectIntl(ResetPasswordUser);
