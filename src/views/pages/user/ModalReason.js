import { Fragment, useState, memo } from 'react'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import { Button, Modal, Input, ModalHeader, ModalBody, ModalFooter, FormGroup, Form } from 'reactstrap'

const ModalReason = ({
  isOpen, onRejectModalClose, onRejectSubmit,
  intl
}) => {

  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => onRejectModalClose(!isOpen)}
      fade={false}
      size="sm"
      className={`modal-dialog-centered `}
    >
      <ModalHeader toggle={() => onRejectModalClose(!isOpen)}>
        {intl.formatMessage({ id: 'reason_rejection' })}
      </ModalHeader>
      <ModalBody>
        <Form
          onSubmit={handleSubmit((data) => {
            onRejectSubmit(data.message)
          })}>
          <FormGroup>
            <Input
              name="message"
              type="textarea"
              rows={5}
              className="mb-2"
              innerRef={register({ required: true })}
              invalid={errors.username && true}
            />
          </FormGroup>
          <FormGroup className="d-flex justify-content-center">
            <Button.Ripple className="mr-1" color="success" type="submit">
              {intl.formatMessage({ id: 'submit' })}
            </Button.Ripple>
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  )
}
export default injectIntl(memo(ModalReason));
