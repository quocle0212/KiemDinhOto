import TinyChartStats from '@components/widgets/stats/TinyChartStats'
import { injectIntl } from 'react-intl'
import { Badge, Card, CardBody, CardText } from 'reactstrap'
import Avatar from '@components/avatar'
import { DollarSign } from 'react-feather'

const wigdetCenterOderNew = ({ warning, intl, title, scheduleNewOverviews, subtitle}) => {
  console.log(scheduleNewOverviews);
  
    return scheduleNewOverviews !== null ? (
      // <TinyChartStats
      //   height={70}
      //   type='bar'
      //   options={options}
      //   title={title}
      //   stats={scheduleNewOverviews?.total?.totalSchedule}
      //   series={series}
      // />
      <Card className="card-tiny-line-stats">
      <CardBody className='pb-50' style={{ marginBottom : '22px'}}>
        <Avatar className="rounded" color={'light-success'} icon={<DollarSign size={18} />} size='lg'/>
        <h4 className='font-weight-bolder mb-1 mt-1'>{title}</h4>
        <CardText>{subtitle}</CardText>
        <CardText>{scheduleNewOverviews?.total?.totalSchedule}</CardText>
        <Badge style={{ fontSize : '13px'}} color={scheduleNewOverviews?.total?.percentageIncrease < 0 ? 'light-danger' : 'light-success'}>{scheduleNewOverviews?.total?.percentage?.toFixed(2)}%</Badge>
      </CardBody>
    </Card>
    ) : null
}

export default injectIntl(wigdetCenterOderNew)