import { useEffect, useState } from 'react'
import { Award } from 'react-feather'
import Avatar from '@components/avatar'
import { isUserLoggedIn } from '@utils'
import { Card, CardBody, CardText } from 'reactstrap'
import decorationLeft from '@src/assets/images/elements/decore-left.png'
import decorationRight from '@src/assets/images/elements/decore-right.png'
import { injectIntl } from 'react-intl';
import addKeyLocalStorage, { APP_USER_DATA_KEY } from '../../../../helper/localStorage'

const CardCongratulations = ({ intl }) => {
  const [userData, setUserData] = useState({
    name: "",
    roleName: ""
  })

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem(APP_USER_DATA_KEY)))
    }
  }, [])
  

  return (
    <Card className='card-congratulations'>
      <CardBody className='text-center'>
        <img className='congratulations-img-left' src={decorationLeft} alt='decor-left' />
        <img className='congratulations-img-right' src={decorationRight} alt='decor-right' />
        <Avatar icon={<Award size={28} />} className='shadow' color='primary' size='xl' />
        <div className='text-center'>
          <h1 className='mb-1 text-white'>{intl.formatMessage({id: "welcone"})} {userData.username},</h1>
          <CardText className='m-auto w-75'>
            {intl.formatMessage({id:"subCongratulation"}, { role: <strong>{userData.roleName}</strong> })}
          </CardText>
        </div>
      </CardBody>
    </Card>
  )
}

export default injectIntl(CardCongratulations)
