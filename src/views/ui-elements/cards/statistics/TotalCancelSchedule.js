import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { useState } from 'react'
import { Award } from 'react-feather'
import { injectIntl } from 'react-intl'
import { Card, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { formatDisplayNumber } from '../../../../utility/Utils'
import SpinnerTextAlignment from '../../../components/spinners/SpinnerTextAlignment'
import ListSchedule from '../../../pages/schedule/index'
import { SCHEDULE_STATUS } from '../../../../constants/app'

const TotalCancelSchedule = ({ kFormatter, intl, data }) => {
  const DefaultFilter = {
    filter: {
        CustomerScheduleStatus : SCHEDULE_STATUS.CANCELED
    },
    skip: 0,
    limit: 10
  }

  const [open, setOpen] = useState(false)

  return  (
    <>
      <StatsWithAreaChart
        icon={<Award size={21} />}
        color="warning"
        stats={!data ? '-' : formatDisplayNumber(data)}
        statTitle={intl.formatMessage({ id: 'total_cancel_schedule' })}
        className="col-widget"
        symboy={true}
        open={open}
        setOpen={setOpen}
      />
      <Modal
        isOpen={open}
        toggle={() => setOpen(false)}
        className={`modal-dialog-centered `}
        style={{ maxWidth: window.innerWidth <= 768 ? '100%' : '80%' }}>
        <ModalHeader toggle={() => setOpen(false)}>{intl.formatMessage({ id: 'total_cancel_schedule' })}</ModalHeader>
        <ModalBody>
          <div className="station-active">
            <ListSchedule filterParam={DefaultFilter}/>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default injectIntl(TotalCancelSchedule)
