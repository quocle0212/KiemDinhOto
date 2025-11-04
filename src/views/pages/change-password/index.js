import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { 
  Form,
  Button,
  Input,
  FormGroup,
  Label
} from 'reactstrap'
import { isObjEmpty } from '@utils'
import Service from './../../../services/request'
import { toast, Slide } from 'react-toastify'
import './changePassword.scss'
import classnames from 'classnames'
import { injectIntl } from 'react-intl';

function ChangePassword({ intl }) {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    newPassword: ''
  })

  const { username, password, newPassword } = userData
  
  const { register, errors, handleSubmit } = useForm()

  const onSubmit = data => {
    if (isObjEmpty(errors)) {
      Service.send({ method: 'post', path: 'Staff/changePasswordStaff', data }).then(result => {
        if (result) {
          const { statusCode } = result
          if (statusCode === 200) {
            toast.success(
              intl.formatMessage({id: "actionSuccess"}, { action: intl.formatMessage({id: "changePass"})}),
              { transition: Slide, autoClose: 2000 }
            )
          }
        } else {
            toast.error(
              intl.formatMessage({id: "actionFailed"}, { action: intl.formatMessage({id: "changePass"})})
            )
        }
      })
    }
  }

  return (
    <main className="change_password d-flex justify-content-center">
      <div className="change_password__container">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label for="username">
              {intl.formatMessage({ id:'username' })}
            </Label>
            <Input
              name="username"
              id="username"
              value={username}
              onChange={e => setUserData({...userData, username: e.target.value})}
              placeholder={intl.formatMessage({ id:'username' })}
              className={classnames({ 'is-invalid': errors['username'] })}
              innerRef={register({ required: true, validate: value => value !== '' })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="password">
              {intl.formatMessage({ id:'password' })}
            </Label>
            <Input
              name="password"
              id="password"
              type="password"
              value={password}
              placeholder={intl.formatMessage({ id:'password' })}
              onChange={e => setUserData({...userData, password: e.target.value})}
              className={classnames({ 'is-invalid': errors['password'] })}
              innerRef={register({ required: true, validate: value => value !== '' })}
            />
          </FormGroup>

          <FormGroup>
            <Label for="newPassword">
              {intl.formatMessage({ id:'newPassword' })}
            </Label>
            <Input
              name="newPassword"
              id="newPassword"
              type="password"
              placeholder={intl.formatMessage({ id:'newPassword' })}
              value={newPassword}
              onChange={e => setUserData({...userData, newPassword: e.target.value})}
              className={classnames({ 'is-invalid': errors['newPassword'] })}
              innerRef={register({ required: true, validate: value => value !== '' })}
            />
          </FormGroup>
          <Button.Ripple type='submit' color='primary' block>
            {intl.formatMessage({ id:'submit' })}
          </Button.Ripple>
        </Form>
      </div>
    </main>
  )
}
export default injectIntl(ChangePassword)