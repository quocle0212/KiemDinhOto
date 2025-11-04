import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { useState } from 'react'
import { Home } from 'react-feather'
import { injectIntl } from 'react-intl'
import { Card, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { STATION_STATUS_FILTER_ZERO } from '../../../../constants/dateFormats'
import { formatDisplayNumber } from '../../../../utility/Utils'
import SpinnerTextAlignment from '../../../components/spinners/SpinnerTextAlignment'
import StationPage from '../../../pages/station/index'
import './index.scss'

const TotalNotActive = ({ kFormatter, intl, data }) => {
  const DefaultFilter = {
    filter: {
      enableBooking: STATION_STATUS_FILTER_ZERO
    },
    skip: 0,
    limit: 10
  }
  let apiFilter = '/Stations/activated'
  const [open, setOpen] = useState(false)

  let total = 0
  const newArray = data?.map((value) => {
    const isBool = value.stationBookingConfig?.every((item) => item.enableBooking === 0)
    if (isBool === true) {
      total++
    }
  })

  return data !== null ? (
    <>
      <StatsWithAreaChart
        icon={<Home size={21} />}
        stats={formatDisplayNumber(total)}
        color="info"
        statTitle={intl.formatMessage({ id: 'totalNotActive' })}
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
        <ModalHeader toggle={() => setOpen(false)}>{intl.formatMessage({ id: 'totalNotActive' })}</ModalHeader>
        <ModalBody>
          <div className="station-active">
            <StationPage filterParam={DefaultFilter} apiFilter={apiFilter}/>
          </div>
        </ModalBody>
      </Modal>
    </>
  ) : (
    <Card className="col-widget d-flex justify-content-center align-items-center">
      <SpinnerTextAlignment size={60} />
    </Card>
  )
}

export default injectIntl(TotalNotActive)
