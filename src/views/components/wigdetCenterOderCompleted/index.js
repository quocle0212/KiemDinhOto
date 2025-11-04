import Avatar from '@components/avatar'
import { CreditCard } from 'react-feather'
import { injectIntl } from 'react-intl'
import { Badge, Card, CardBody, CardText } from 'reactstrap'

const wigdetCenterOderCompleted = ({ warning, intl, title, scheduleCompletedOverviews, subtitle }) => {
  
  return scheduleCompletedOverviews !== null ? (
    <Card className="card-tiny-line-stats">
      <CardBody className='pb-50' style={{ marginBottom : '22px'}}>
        <Avatar className="rounded" color={'light-danger'} icon={<CreditCard size={18} />} size='lg'/>
        <h4 className='font-weight-bolder mb-1 mt-1'>{title}</h4>
        <CardText>{subtitle}</CardText>
        <CardText>{scheduleCompletedOverviews?.total?.totalSchedule}</CardText>
        <Badge style={{ fontSize : '13px'}} color={scheduleCompletedOverviews?.total?.percentageIncrease < 0 ? 'light-danger' : 'light-success'}>{scheduleCompletedOverviews?.total?.percentageIncrease.toFixed(2)}%</Badge>
      </CardBody>
    </Card>
  ) : null
}

export default injectIntl(wigdetCenterOderCompleted)
