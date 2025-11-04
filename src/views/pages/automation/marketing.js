import React, { memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import { injectIntl } from 'react-intl'
// import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { toast } from 'react-toastify'
import { Card } from 'reactstrap'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import TemplateService from '../../../services/template'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicTablePaging from '../../components/BasicTablePaging'
import MySwitch from '../../components/switch'
import './index.scss'

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20
}
function Marketing({ intl }) {
  //   const history = useHistory()
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [items, setItems] = useState([])
  const [template, setTemplate] = useState([])
  const [disabled, setDisabled] = useState(false) // nếu 1 trong 2 sms, zns thì true
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const listNewStation = listStation.map((item) => {
    return {
      ...item,
      label: item.stationCode,
      value: item.stationsId
    }
  })
  listNewStation?.unshift({ value: '', label: 'Tất cả mã trung tâm' })

  function getData(params) {
    const newParams = {
      ...params
    }
    setParamsFilter(newParams)
    TemplateService.getList(newParams).then((res) => {
      if (res) {
        const { statusCode, data, message } = res
        if (statusCode === 200) {
          setItems(data.data)
        } else {
          toast.warn(intl.formatMessage({ id: 'failed' }))
        }
      } else {
        setItems([])
      }
    })
  }

  function getDataTemplate(params) {
    const newParams = {
      ...params
    }
    setParamsFilter(newParams)
    TemplateService.getListTemplate(newParams).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          const newArr = data.data.map((el) => {
            return {
              label: `[${el.messageTemplateType}] ${el.messageTemplateName}`,
              value: el.messageTemplateId
            }
          })
          setTemplate(newArr)
        } else {
          toast.warn(intl.formatMessage({ id: 'failed' }))
        }
      } else {
        setTemplate([])
      }
    })
  }

  const handleFilterChange = (id, value) => {
    const data = {
      id: id,
      data: {}
    }
    // setParamsFilter(newParams)
    // getData(newParams)
  }

  useEffect(() => {
    getData(paramsFilter)
    getDataTemplate({
      filter: {},
      // skip: 0,
      // limit: 20
    })
  }, [])

  const onUpdateStationEnableUse = (data) => {
    TemplateService.handleUpdateData(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter, true)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const handleInputChange = (value, row) => {
    const newData = {
      id: row.scheduledJobId,
      data: {
        messageTemplateId: value
      }
    }
    onUpdateStationEnableUse(newData)
  }

  const columns = [
    {
      name: 'Bật / Tắt',
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { jobEnable } = row
        return (
          <MySwitch
            checked={jobEnable === 1 ? true : false}
            onChange={(e) => {
              onUpdateStationEnableUse({
                id: row.scheduledJobId,
                data: {
                  jobEnable: e.target.checked ? 1 : 0
                }
              })
            }}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'smsName' }),
      minWidth: '550px',
      maxWidth: '550px',
      selector: (row) => {
        return <div className="text-table">{row.jobDescription}</div>
      }
    },
    {
      name: 'thời gian chạy',
      minWidth: '200px',
      maxWidth: '200px',
      selector: (row) => row.jobTimeRun
    },
    {
      name: 'chu kì',
      minWidth: '200px',
      maxWidth: '200px',
      selector: (row) => row.jobCycle
    },
    {
      name: intl.formatMessage({ id: 'MessageTemplate' }),
      minWidth: '250px',
      maxWidth: '250px',
      cell: (row) => {
        const { messageTemplateId, enableNotifySMS, enableNotifyZNS } = row
        return (
          <BasicAutoCompleteDropdown
            placeholder="Mẫu tin"
            id={`stationCode_select_${messageTemplateId}`}
            name="messageTemplateId"
            options={template}
            className="w-100"
            onChange={({ value }) => handleInputChange(value, row)}
            value={template.find((el) => el.value === messageTemplateId)}
            isDisabled={enableNotifySMS === 1 || enableNotifyZNS === 1 ? false : true}
          />
        )
      }
    },
    {
      name: 'APNS',
      minWidth: '120px',
      maxWidth: '120px',
      cell: (row) => {
        const { enableNotifyAPNS } = row
        return (
          <MySwitch
            checked={enableNotifyAPNS === 1 ? true : false}
            onChange={(e) => {
              onUpdateStationEnableUse({
                id: row.scheduledJobId,
                data: {
                  enableNotifyAPNS: e.target.checked ? 1 : 0
                }
              })
            }}
          />
        )
      }
    },
    {
      name: 'Email',
      minWidth: '120px',
      maxWidth: '120px',
      cell: (row) => {
        const { enableNotifyEmail } = row
        return (
          <MySwitch
            checked={enableNotifyEmail === 1 ? true : false}
            onChange={(e) => {
              onUpdateStationEnableUse({
                id: row.scheduledJobId,
                data: {
                  enableNotifyEmail: e.target.checked ? 1 : 0
                }
              })
            }}
          />
        )
      }
    },
    {
      name: 'SMS',
      minWidth: '120px',
      maxWidth: '120px',
      cell: (row) => {
        const { enableNotifySMS } = row
        return (
          <MySwitch
            checked={enableNotifySMS === 1 ? true : false}
            onChange={(e) => {
              onUpdateStationEnableUse({
                id: row.scheduledJobId,
                data: {
                  enableNotifySMS: e.target.checked ? 1 : 0
                }
              })
            }}
          />
        )
      }
    },
    {
      name: 'Telegram',
      minWidth: '120px',
      maxWidth: '120px',
      cell: (row) => {
        const { enableNotifyTelegram } = row
        return (
          <MySwitch
            checked={enableNotifyTelegram === 1 ? true : false}
            onChange={(e) => {
              onUpdateStationEnableUse({
                id: row.scheduledJobId,
                data: {
                  enableNotifyTelegram: e.target.checked ? 1 : 0
                }
              })
            }}
          />
        )
      }
    },
    {
      name: 'ZNS',
      minWidth: '120px',
      maxWidth: '120px',
      cell: (row) => {
        const { enableNotifyZNS } = row
        return (
          <MySwitch
            checked={enableNotifyZNS === 1 ? true : false}
            onChange={(e) => {
              onUpdateStationEnableUse({
                id: row.scheduledJobId,
                data: {
                  enableNotifyZNS: e.target.checked ? 1 : 0
                }
              })
            }}
          />
        )
      }
    }
  ]

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * 20
    }
    if(page === 1){
      getData(paramsFilter)
      return null
    }
    getData(newParams)
  }

  const CustomPaginations = () => {
    const lengthItem = items.length
    return <BasicTablePaging items={lengthItem} handlePaginations={handlePaginations} />
  }

  return (
    <>
      <Card>
        {/* <Row className="mx-0 mt-1 mb-50">
          <Col sm="6" md="4" lg="2" xs="12" className="mb-1">
            <BasicAutoCompleteDropdown
              placeholder="Mã trung tâm"
              name="stationsId"
              options={listNewStation}
              onChange={({ value }) => handleFilterChange('stationsId', value)}
            />
          </Col>
        </Row> */}
        <div id="users-data-table">
          <DataTable
            noHeader
            // pagination
            paginationServer
            className="react-dataTable"
            columns={columns}
            sortIcon={<ChevronDown size={10} />}
            // paginationComponent={CustomPagination}
            data={items}
            // progressPending={isLoading}
          />
          {CustomPaginations()}
        </div>
      </Card>
    </>
  )
}
export default injectIntl(memo(Marketing))
