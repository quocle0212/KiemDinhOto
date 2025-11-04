import { useEffect, useState } from 'react'
import axios from 'axios'
import { Home, Loader } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'
import './index.scss'
import { Card } from 'reactstrap'
import { formatDisplayNumber } from '../../../../utility/Utils'
import SpinnerTextAlignment from '../../../components/spinners/SpinnerTextAlignment'
import { STATION_STATUS_FILTER } from '../../../../constants/dateFormats'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import StationPage from '../../../pages/station/index'

const TotalDeployedStation = ({ kFormatter, intl, data }) => {
  const DefaultFilter = {
    filter: {
      enableBooking: STATION_STATUS_FILTER
    },
    skip: 0,
    limit: 10
  }
  let apiFilter = '/Stations/activated'
  const [open, setOpen] = useState(false)

  let total = 0
  const newArray = data?.map((value) => {
    const isBool = value.stationBookingConfig?.some((item) => item.enableBooking === 1)
    if (isBool === true) {
      total++
    }
  })

  return data !== null ? (
    <>
      <StatsWithAreaChart
        icon={<Home size={21} />}
        stats={formatDisplayNumber(total)}
        color="success"
        statTitle={intl.formatMessage({ id: 'totalDeployedStation' })}
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
        <ModalHeader toggle={() => setOpen(false)}>{intl.formatMessage({ id: 'totalDeployedStation' })}</ModalHeader>
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

export default injectIntl(TotalDeployedStation)
