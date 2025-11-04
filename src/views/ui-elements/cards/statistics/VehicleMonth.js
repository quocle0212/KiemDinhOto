import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { useState } from 'react'
import { Compass } from 'react-feather'
import { injectIntl } from 'react-intl'
import { Card, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { formatDisplayNumber } from '../../../../utility/Utils'
import SpinnerTextAlignment from '../../../components/spinners/SpinnerTextAlignment'
import ListVehicle from '../../../pages/vehicle/index'
import moment from 'moment'

const VehicleMonth = ({ kFormatter, intl, data }) => {
  const DefaultFilter = {
    filter: {
    },
    skip: 0,
    limit: 10,
    startDate: moment().startOf('month').format('DD/MM/YYYY'),
    endDate: moment().endOf('month').format('DD/MM/YYYY')
  }

  let apiFilter = '/AppUserVehicle/getListTimeVehicle'
  const [open, setOpen] = useState(false)

  return (
    <>
      <StatsWithAreaChart
        icon={<Compass size={21} />}
        color="warning"
        stats={!data ? '-' : formatDisplayNumber(data)}
        statTitle={intl.formatMessage({ id: 'total_vehicle_month' })}
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
        <ModalHeader toggle={() => setOpen(false)}>{intl.formatMessage({ id: 'total_vehicle_month' })}</ModalHeader>
        <ModalBody>
          <div className="station-active">
            <ListVehicle filterParam={DefaultFilter} apiFilter={apiFilter}/>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default injectIntl(VehicleMonth)
