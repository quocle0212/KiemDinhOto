import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { useState } from 'react'
import { Codepen } from 'react-feather'
import { injectIntl } from 'react-intl'
import { Card, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { formatDisplayNumber } from '../../../../utility/Utils'
import SpinnerTextAlignment from '../../../components/spinners/SpinnerTextAlignment'
import ListVehicle from '../../../pages/vehicle/index'
import { STATION_STATUS_FILTER } from '../../../../constants/dateFormats'

const TotalAuthenticatedSchedule = ({ kFormatter, intl, data }) => {
  const DefaultFilter = {
    filter: {
        vehicleVerifiedInfo : STATION_STATUS_FILTER
    },
    skip: 0,
    limit: 10
  }

  const [open, setOpen] = useState(false)

  return (
    <>
      <StatsWithAreaChart
        icon={<Codepen size={21} />}
        color="warning"
        stats={!data ? '-' : formatDisplayNumber(data)}
        statTitle={intl.formatMessage({ id: 'total_authenticated_vehicle' })}
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
        <ModalHeader toggle={() => setOpen(false)}>{intl.formatMessage({ id: 'total_authenticated_vehicle' })}</ModalHeader>
        <ModalBody>
          <div className="station-active">
            <ListVehicle filterParam={DefaultFilter} Authenticated={false}/>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default injectIntl(TotalAuthenticatedSchedule)
