import { useState, useContext, Fragment, useEffect} from 'react'
import classnames from 'classnames'
import Avatar from '@components/avatar'
import { useSkin } from '@hooks/useSkin'
import Service from './../../../services/request'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { toast, Slide } from 'react-toastify'
import { handleLogin } from '@store/actions/auth'
import { AbilityContext } from '@src/utility/context/Can'
import { useHistory } from 'react-router-dom'
import InputPasswordToggle from '@components/input-password-toggle'
import { getHomeRouteForLoggedInUser, isObjEmpty } from '@utils'
import { Coffee } from 'react-feather'
import {

  Row,
  Col,
  CardTitle,

  Form,
  Input,
  FormGroup,
  Label,
  CustomInput,
  Button,

} from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import '@styles/base/pages/page-auth.scss'

const ToastContent = ({ name, roleName }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title font-weight-bold'>Welcome, {name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>to Kiemdinhoto.vn. Now you can start to explore. Enjoy!</span>
    </div>
  </Fragment>
)

const Login = props => {
  const [skin,] = useSkin()
  const Buffer = require('buffer').Buffer;
  const dispatch = useDispatch()
  const [remember, setRemember] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { register, errors, handleSubmit } = useForm()
  const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  const onSubmit = user => {
    // Nếu người dùng chọn "Ghi nhớ đăng nhập", lưu thông tin vào localStorage
    if (remember) {
      const encodedPhoneNum = Buffer.from(username, 'utf-8').toString('base64');
      const encodedPass = Buffer.from(password, 'utf-8').toString('base64');
      localStorage.setItem('usernames', encodedPhoneNum)
      localStorage.setItem('password', encodedPass)
      localStorage.setItem('remember', true)
    } else {
      // Nếu không chọn "Ghi nhớ đăng nhập", xóa thông tin lưu trữ
      localStorage.removeItem('usernames')
      localStorage.removeItem('password')
      localStorage.removeItem('remember')
    }

    if (!(/^[a-zA-Z0-9]+$/.test(user?.username))){
      return toast.error(<FormattedMessage id='regex_login'/>)
    }
    if (user?.username?.length < 6) {
      return toast.error(<FormattedMessage id='error_userName'/>)
    }
    if (isObjEmpty(errors)) {
      Service.send({ method: 'post', path: 'Staff/loginStaff', data : user }).then(result => {
        if (result) {
          const { statusCode, data } = result
          if (statusCode === 200) {
            const newData = { ...data, accessToken: data.token, refreshToken: data.token }
            if(user.username === data.username){
              dispatch(handleLogin(newData))
              // history.push(getHomeRouteForLoggedInUser('admin'))
              toast.success(
                <ToastContent name={newData.fullName || newData.username || 'John Doe'} roleName={newData.roleName || ''} />,
                { transition: Slide, hideProgressBar: true, autoClose: 2000 }
              )
              setTimeout(() => {
                window.location.href = getHomeRouteForLoggedInUser('admin')
              }, 1500)
            } else {
              toast.error(<FormattedMessage id='error_login'/>)
            }
          } else {
            toast.error(<FormattedMessage id='error_login'/>)
          }
        } else {
          toast.error(<FormattedMessage id='login_fail'/>)
        }
      })
      .catch(() => {
        toast.error(<FormattedMessage id='login_fail'/>)
      })
    }
  }

  useEffect(() => {
    const remove = localStorage.getItem('remember')
    let decodedPhoneNum = localStorage.getItem('usernames')
    let decodedPass = localStorage.getItem('password')
    if (remove) {
      setRemember(true)
      const phoneNumber = Buffer.from(decodedPhoneNum, 'base64').toString('utf-8');
      const password = Buffer.from(decodedPass, 'base64').toString('utf-8');
      setUsername (phoneNumber)
      setPassword (password)
    }
  }, [])

  return (
    <div className='auth-wrapper auth-v2'>
      <Row className='auth-inner m-0'>

        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login V2' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='font-weight-bold mb-1'>
              Login! 👋
            </CardTitle>


            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label className='form-label' for='login-username'>
                  Username
                </Label>
                <Input
                  autoFocus
                  type='text'
                  value={username}
                  id='login-username'
                  name='username'
                  placeholder='your username'
                  onChange={e => setUsername(e.target.value)}
                  className={classnames({ 'is-invalid': errors['username'] })}
                  innerRef={register({ required: true, validate: value => value !== '' })}
                />
              </FormGroup>
              <FormGroup>
                {/* <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                  <Link to='/forgot-password'>
                    <small>Forgot Password?</small>
                  </Link>
                </div> */}
                <InputPasswordToggle
                  value={password}
                  id='login-password'
                  name='password'
                  // className='input-group-merge'
                  onChange={e => setPassword(e.target.value)}
                  className={classnames({ 'is-invalid': errors['password'] })}
                  innerRef={register({ required: true, validate: value => value !== '' })}
                />
              </FormGroup>
              <FormGroup>
                <CustomInput onChange={(e) => setRemember(e.target.checked)} checked={remember} type='checkbox' className='custom-control-Primary' id='remember-me' label='Remember Me' />
              </FormGroup>
              <Button.Ripple type='submit' color='primary' block>
                Sign in
              </Button.Ripple>
            </Form>
            {/* <p className='text-center mt-2'>
              <span className='mr-25'>New on our platform?</span>
              <Link to='/register'>
                <span>Create an account</span>
              </Link>
            </p>
            <div className='divider my-2'>
              <div className='divider-text'>or</div>
            </div>
            <div className='auth-footer-btn d-flex justify-content-center'>
              <Button.Ripple color='facebook'>
                <Facebook size={14} />
              </Button.Ripple>
              <Button.Ripple color='twitter'>
                <Twitter size={14} />
              </Button.Ripple>
              <Button.Ripple color='google'>
                <Mail size={14} />
              </Button.Ripple>
              <Button.Ripple className='mr-0' color='github'>
                <GitHub size={14} />
              </Button.Ripple>
            </div>
          */}
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
