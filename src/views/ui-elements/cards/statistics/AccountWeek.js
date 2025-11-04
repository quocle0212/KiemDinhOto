import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import moment from 'moment'
import { useState } from 'react'
import { Box } from 'react-feather'
import { injectIntl } from 'react-intl'
import { Card, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { formatDisplayNumber } from '../../../../utility/Utils'
import SpinnerTextAlignment from '../../../components/spinners/SpinnerTextAlignment'
import DataTableServerSide from '../../../pages/user/index'
import './index.scss'

const AccountWeek = ({ kFormatter, intl, data }) => {
  const DefaultFilter = {
    filter: {},
    skip: 0,
    limit: 10,
    startDate: moment().startOf('week').format('DD/MM/YYYY'),
    endDate: moment().endOf('week').format('DD/MM/YYYY')
  }

  const [open, setOpen] = useState(false)

  return (
    <>
      <StatsWithAreaChart
        icon={<Box size={21} />}
        color="warning"
        stats={!data ? '-' : formatDisplayNumber(data)}
        statTitle={intl.formatMessage({ id: 'account_week' })}
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
        <ModalHeader toggle={() => setOpen(false)}>{intl.formatMessage({ id: 'account_week' })}</ModalHeader>
        <ModalBody>
          <div className="station-active">
            <DataTableServerSide filterParam={DefaultFilter} />
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default injectIntl(AccountWeek)
