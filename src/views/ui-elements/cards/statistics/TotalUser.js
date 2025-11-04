import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { useState } from 'react'
import { Box } from 'react-feather'
import { injectIntl } from 'react-intl'
import { Card, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { STATION_STATUS_FILTER, STATION_STATUS_FILTER_ZERO } from '../../../../constants/dateFormats'
import { formatDisplayNumber } from '../../../../utility/Utils'
import SpinnerTextAlignment from '../../../components/spinners/SpinnerTextAlignment'
import DataTableServerSide from '../../../pages/user/index'
import "./index.scss"

const TotalUser = ({ kFormatter, intl, data }) => {
  const DefaultFilter = {
    filter: {
      active: STATION_STATUS_FILTER,
      appUserRoleId: STATION_STATUS_FILTER_ZERO
    },
    skip: 0,
    limit: 10
  }

  const [open, setOpen] = useState(false)

  return  (
    <>
    <StatsWithAreaChart
      icon={<Box size={21} />}
      color='warning'
      stats={!data ? '-' : formatDisplayNumber(data)}
      statTitle={intl.formatMessage({id: "total_user"})}
      className='col-widget'
      symboy={true}
      open={open}
      setOpen={setOpen}
    />
    <Modal
        isOpen={open}
        toggle={() => setOpen(false)}
        className={`modal-dialog-centered `}
        style={{ maxWidth: window.innerWidth <= 768 ? '100%' : '80%' }}>
        <ModalHeader toggle={() => setOpen(false)}>{intl.formatMessage({ id: 'total_user' })}</ModalHeader>
        <ModalBody>
          <div className="station-active">
            <DataTableServerSide filterParam={DefaultFilter}/>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default injectIntl(TotalUser)