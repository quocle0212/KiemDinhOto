import React, { useEffect, useState } from 'react'
import addKeyLocalStorage from '../../../helper/localStorage'
import TemplateService from '../../../services/template'
import { toast } from 'react-toastify'
import { injectIntl } from 'react-intl'
import { Card, Col, Row } from 'reactstrap'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicTablePaging from '../../components/BasicTablePaging'
import MySwitch from '../../components/switch'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import { STATUS_OPTIONS } from './../../../constants/app'

const SmsCSKH = ({ intl }) => {
  const defaultFilter = {
    filter: {},
    skip: 0,
    limit: 20,
    order: {
      key: 'createdAt',
      value: 'asc'
    }
  }
  const [paramsFilter, setParamsFilter] = useState(defaultFilter)
  const [data, setData] = useState([])
  const [template, setTemplate] = useState([])
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const listNewStation = listStation.map((item) => {
    return {
      ...item,
      label: item.stationCode,
      value: item.stationsId
    }
  })

  function getData(params) {
    const newParams = {
      ...params
    }
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, '')
      TemplateService.getCustomerNotifyInfo(newParams, newToken).then((res) => {
        if (res) {
          setData(res.data)
        }
      })
    } else {
      window.localStorage.clear()
    }
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

  useEffect(() => {
    getData(paramsFilter)
    getDataTemplate(paramsFilter)
  }, [])

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * 20
    }
    if (page === 1) {
      getData(paramsFilter)
      return null
    }
    getData(newParams)
  }

  const CustomPaginations = () => {
    const lengthItem = data.length
    return <BasicTablePaging items={lengthItem} handlePaginations={handlePaginations} />
  }

  const handleInputChange = (value, row, names) => {
    const newData = {
      id: row.customerNotifyInfoId,
      data: {
        [names]: value
      }
    }
    onUpdateEnableUse(newData)
  }

  const onUpdateEnableUse = (data) => {
    TemplateService.updateCustomerNotifyInfo(data).then((res) => {
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

  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value === "" ? undefined : value
      },
      skip: 0
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  const columns = [
    {
      name: intl.formatMessage({ id: 'purpose' }),
      minWidth: '500px',
      maxWidth: '500px',
      selector: (row) => row?.CustomerNotifyPurpose
    },
    {
      name: intl.formatMessage({ id: 'MessageTemplate' }),
      minWidth: '300px',
      maxWidth: '300px',
      cell: (row) => {
        const { messageTemplateId } = row
        return (
          <BasicAutoCompleteDropdown
            placeholder="Mẫu tin"
            id={`stationCode_select_${messageTemplateId}`}
            name="messageTemplateId"
            options={template}
            className="w-100"
            onChange={({ value }) => handleInputChange(value, row, 'messageTemplateId')}
            value={template.find((el) => el.value === messageTemplateId)}
            // isDisabled={enableNotifySMS === 1 || enableNotifyZNS === 1 ? false : true}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'center' }),
      minWidth: '300px',
      maxWidth: '300px',
      cell: (row) => {
        const { stationsId } = row
        return (
          <BasicAutoCompleteDropdown
            placeholder="Mã trung tâm"
            name="stationsId"
            className="w-100"
            options={listNewStation}
            onChange={({ value }) => handleInputChange(value, row, 'stationsId')}
            value={listNewStation.find((el) => el.value === stationsId)}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'actived' }),
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { CustomerNotifyActiveStatus } = row
        return (
          <MySwitch
            checked={CustomerNotifyActiveStatus === '1' ? true : false}
            onChange={(e) => {
              onUpdateEnableUse({
                id: row.customerNotifyInfoId,
                data: {
                  CustomerNotifyActiveStatus: e.target.checked ? '1' : '0'
                }
              })
            }}
          />
        )
      }
    }
  ]

  return (
    <Card>
      <Row className='mx-0 mt-1 mb-50'>
        <Col sm="2" md="2" lg="2" xs="6" className="mb-1">
          <BasicAutoCompleteDropdown
            placeholder={intl.formatMessage({ id: 'stationStatus' })}
            name="CustomerNotifyActiveStatus"
            options={Object.values(STATUS_OPTIONS)}
            getOptionLabel={(option) => intl.formatMessage({ id: option.label })}
            onChange={({ value }) => {
              handleFilterChange('CustomerNotifyActiveStatus', value)
            }}
          />
        </Col>
      </Row>
      <div id="users-data-table">
        <DataTable
          noHeader
          // pagination
          paginationServer
          className="react-dataTable"
          columns={columns}
          sortIcon={<ChevronDown size={10} />}
          data={data}
        />
        {CustomPaginations()}
      </div>
    </Card>
  )
}

export default injectIntl(SmsCSKH)
