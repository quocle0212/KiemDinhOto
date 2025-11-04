// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { Edit, Trash } from 'react-feather'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { ChevronDown, } from 'react-feather'
import DataTable from 'react-data-table-component'
import {
  Card, Row, Col,
  Button,
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label
} from 'reactstrap'
import { injectIntl } from 'react-intl';
import addKeyLocalStorage from '../../../helper/localStorage';
import SystemHolidayCalendarService from '../../../services/SystemHolidayCalendarService'
import moment from 'moment'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { toast } from 'react-toastify'
import BasicTablePaging from '../../components/BasicTablePaging'

const ScheduleDayOff = ({ intl }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [statusModal, setStatusModal] = useState(undefined)
  const [listData, setListData] = useState([])
  const [dataToAction, setDataToAction] = useState(undefined)
  const [dataFilter, setDataFilter] = useState({
    skip: 0,
    limit : 20,

  })

  function convertDateToMoment(date) {
    return date ? moment(date, 'YYYYMMDD', true).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY")
  }
  function convertDateToSubmit(date) {
    return date ? moment(date, 'DD/MM/YYYY', true).format("YYYYMMDD") : moment().format("YYYYMMDD")
  }

  useEffect(() => {
    getListData(dataFilter)
  }, [])

  function getListData(payload) {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, "");
      setIsLoading(true)
      SystemHolidayCalendarService.getList(payload, newToken).then(res => {
        if (res) {
          setIsLoading(false)
          const { statusCode, data } = res
          if (statusCode === 200) {
            setListData(data.data)
            setDataFilter({ ...dataFilter, total: data.data.total })
          } else {
            setListData([])
            setDataFilter({ ...dataFilter, total: 0 })
          }
        }
      })
    }
  }

  function addOrUpdateOrDelete(type = "add", dataToAction) {
    let payload = {
      scheduleDayOff: convertDateToSubmit(dataToAction?.scheduleDayOff)
    }
    if (type === "edit") {
      payload = {
        "id": dataToAction?.id || 0,
        "data": {
          "scheduleDayOff": convertDateToSubmit(dataToAction?.scheduleDayOff)
        }
      }
    }
    if (type === "delete") {
      payload = {
        "id": dataToAction?.id || 0,
      }
    }

    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, "");
      setIsLoading(true)
      SystemHolidayCalendarService[type](payload, newToken).then(res => {
        if (res) {
          setIsLoading(false)
          const { statusCode, error } = res
          if (statusCode === 200) {
            getListData({})
            toast.success(
              intl.formatMessage({ id: "actionSuccess" }, { action: intl.formatMessage({ id: type }) })
            )
          } else {
            if(error === "EXISTED_DATE_ERROR"){
              return toast.error(intl.formatMessage({ id: 'error_schedule_off' }))
            }
            if (error) {
              toast.error(
                intl.formatMessage({ id: 'please_choose_past_day' })
              )
            } else {
              toast.error(
                intl.formatMessage({ id: "actionFailed" }, { action: intl.formatMessage({ id: type }) })
              )
            }
          }
        }
      })
    }
  }

  function handleCancelModal(params) {
    setStatusModal(undefined)
    setDataToAction(undefined)
  }

  const serverSideColumns = [
    {
      name: "ID",
      selector: 'systemHolidayCalendarId',
      minWidth: '150px',
      cell: (row) => {
        const { systemHolidayCalendarId } = row
        return (
          <div>
            {systemHolidayCalendarId}
          </div>
        )
      }
    },
    {
      name: 'Lịch nghỉ',
      selector: 'scheduleDayOff',
      minWidth: '200px',
      cell: (row) => {
        const { scheduleDayOff } = row
        return (
          <div>
            {convertDateToMoment(scheduleDayOff)}
          </div>
        )
      }
    },
    {
      name: "Thời gian tạo",
      selector: 'createdAt',
      minWidth: '200px',
      cell: (row) => {
        const { createdAt } = row
        return (
          <div>
            {moment(createdAt).format("HH:mm DD/MM/YYYY")}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      selector: 'action',
      minWidth: '150px',
      right: true,
      cell: ({ scheduleDayOff, systemHolidayCalendarId }) => {
        return (<>
          <div onClick={e => {
            e.preventDefault();
            setStatusModal("edit")
            setDataToAction({ scheduleDayOff: convertDateToMoment(scheduleDayOff), id: systemHolidayCalendarId })
          }}>
            <Edit className='mr-50 pointer' size={15} />
          </div>
          <div onClick={e => {
            e.preventDefault();
            setStatusModal("delete")
            setDataToAction({ id: systemHolidayCalendarId })
          }}>
            <Trash className='mr-50 pointer ml-2' size={15} />
          </div>
        </>
        )
      }
    }
  ]
  const handlePagination = (page) => {
    if(!page) return
    const newParams = {
      ...dataFilter,
      skip: (page - 1) * dataFilter.limit
    }
    if(page === 1){
      getListData(newParams)
      return null
    }
    getListData(newParams)
  }
  const CustomPagination = () => {
    const lengthItem = listData.length
    return (
      <BasicTablePaging
        items={lengthItem}
        handlePaginations={handlePagination}
      />
    )
}
  return (
    <Fragment>
      <Card>
        <Row className='mx-0 mt-1'>
          <Col sm="4" lg='3' xs='6' className='mb-1'>
            <Button.Ripple color='primary'
              size="md"
              onClick={() => {
                setStatusModal("add")
              }}>
              {intl.formatMessage({ id: "add_new" })}
            </Button.Ripple>
          </Col>
        </Row>
        <DataTable
          noHeader
          paginationServer
          className='react-dataTable'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          data={listData}
          progressPending={isLoading}
        />
        {CustomPagination()}
        <Modal
          isOpen={statusModal ? true : false}
          toggle={() => handleCancelModal()}
          className={`modal-dialog-centered `}
        >
          <ModalHeader toggle={() => handleCancelModal()}>
            {statusModal && intl.formatMessage({ id: statusModal })} {" "}
            {
              intl.formatMessage({ id: "schedule_day_off" })
            }
          </ModalHeader>
          <ModalBody>
            {
              statusModal === "delete" ?
                <p>Bạn có chắc chắn muốn xoá lịch nghỉ với id là {" "}
                  <strong>
                    {dataToAction?.id}
                  </strong> không?
                </p>
                : <FormGroup>
                  <Label for="end_date">{intl.formatMessage({ id: 'Choose_date' })}</Label>
                  <Flatpickr
                    value={dataToAction?.scheduleDayOff}
                    options={{ mode: 'single', dateFormat: 'd/m/Y' }}
                    placeholder={intl.formatMessage({ id: 'Choose_date' })}
                    className="form-control form-control-input small"
                    onChange={(date) => {
                      setDataToAction({ ...dataToAction, scheduleDayOff: moment(date?.[0]).format("DD/MM/YYYY") })
                    }}
                  />
                </FormGroup>
            }
          </ModalBody>
          <ModalFooter>
            <Button.Ripple color='primary'
              size="sm"
              className="px-2"
              onClick={() => {
                addOrUpdateOrDelete(statusModal, dataToAction)
                handleCancelModal()
              }}>
              {statusModal && intl.formatMessage({ id: statusModal })}
            </Button.Ripple>
          </ModalFooter>
        </Modal>
      </Card>
    </Fragment >
  )
}

export default injectIntl(memo(ScheduleDayOff))
