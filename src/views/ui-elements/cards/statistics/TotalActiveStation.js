import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { useState } from 'react'
import { Home } from 'react-feather'
import { injectIntl } from 'react-intl'
import { Card, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { formatDisplayNumber } from '../../../../utility/Utils'
import SpinnerTextAlignment from '../../../components/spinners/SpinnerTextAlignment'
import StationPage from "../../../pages/station/index"
import './index.scss'
import { STATION_STATUS_FILTER } from '../../../../constants/dateFormats'

const TotalActiveStation = ({ kFormatter, intl, data }) => {
  const DefaultFilter = {
    filter: {
      stationStatus : STATION_STATUS_FILTER
    },
    skip: 0,
    limit: 10
  }

  const [open, setOpen] = useState(false)

  const newArr = data.filter((el) => el.stationStatus === 1)

  return data !== null ? (
    <>
      <StatsWithAreaChart
        icon={<Home size={21} />}
        stats={formatDisplayNumber(newArr.length)}
        color="primary"
        statTitle={intl.formatMessage({ id: 'totalActiveStation' })}
        className="col-widget"
        symboy={true}
        open={open}
        setOpen={setOpen}
      />
      <Modal isOpen={open} toggle={() => setOpen(false)} className={`modal-dialog-centered `} style={{ maxWidth: window.innerWidth <= 768 ? '100%' : '80%' }}>
        <ModalHeader toggle={() => setOpen(false)}>{intl.formatMessage({ id: 'totalActiveStation' })}</ModalHeader>
        <ModalBody>
          <div className="station-active">
            <StationPage filterParam={DefaultFilter} isOpenStation={false}/>
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

export default injectIntl(TotalActiveStation)
