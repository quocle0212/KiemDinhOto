import { memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Search, Trash } from 'react-feather'
import { Input, InputGroup, Row } from 'reactstrap'
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { Button, Card, Col } from 'reactstrap'

import {
  COLUMNS_WIDTH,
  CONFIG_DAY_SETTING_FIELD,
  CONFIG_SETTING_NOTIFICATION_FIELD,
  CONFIG_SETTING_TEMPLATE_KEY,
  CONFIG_SETTING_TEMPLATE_VALUE,
  SIZE_INPUT
} from '../../../constants/app'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import StationMessageConfigService from '../../../services/stationMessageConfigService'
import MessageCustomerMarketingServise from '../../../services/MessageCustomerMarketingServise'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import MySwitch from '../../components/switch'
import BasicTablePagingCopy from '../../components/BasicTablePaging/BasicTablePagingCopy'

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20
}

const STATUS = {
  ENABLE: 1,
  DISABLE: 0
}

const AutomationCustomers = ({ intl }) => {
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const listNewStation = listStation.map((item) => {
    return {
      ...item,
      label: item.stationCode,
      value: item.stationsId
    }
  })

  const history = useHistory()
  const [total, setTotal] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [firstPage, setFirstPage] = useState(false)
  const [templates, setTemplates] = useState([])

  const onUpdateEnableUse = ({ stationsId, messageConfigId, data }) => {
    StationMessageConfigService.updateStationMessageConfigs({ stationsId, messageConfigId, data }).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          fetchData(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.error(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const getTemplates = async () => {
    MessageCustomerMarketingServise.getTemplates().then((data) => {
      if (data?.templates && data?.templates?.length > 0) {
        const newDataTemplates = data.templates.map((item) => {
          return {
            value: item.messageTemplateId,
            label: item.messageTemplateName,
            messageTemplateType: item.messageTemplateType
          }
        })
        return setTemplates(newDataTemplates)
      }
      setTemplates([])
    })
  }

  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'index' }),
      selector: 'STT',
      minWidth: COLUMNS_WIDTH.SMALL,
      maxWidth: COLUMNS_WIDTH.SMALL,
      sortable: true,
      cell: (row, index) => <div>{currentIndex + index + 1}</div>
    },
    {
      name: intl.formatMessage({ id: 'configTemplateName' }),
      selector: 'configTemplateName',
      minWidth: COLUMNS_WIDTH.XLARGE,
      maxWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => (
        <div
          style={{
            maxWidth: '100%',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
          {row.configTemplateName}
        </div>
      )
    },
    {
      name: intl.formatMessage({ id: 'time_sending' }),
      minWidth: COLUMNS_WIDTH.XLARGE,
      maxWidth: COLUMNS_WIDTH.XLARGE,
      selector: (row) => row.autoSentTimes,
      cell: (row) => {
        const { autoSentTimes } = row
        return (
          <div className="d-flex flex-column py-1">
            {Object.keys(autoSentTimes).map((key) => {
              if (key === 'enableAutoSentNotiBeforeOtherDays' && autoSentTimes[key] > 0) {
                return <div key={key}>{`Trước ${autoSentTimes[key]} ngày`}</div>
              } else {
                return <div key={key}>{autoSentTimes[key] === STATUS.ENABLE ? CONFIG_DAY_SETTING_FIELD[key] : ''}</div>
              }
            })}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'notification_type' }),
      selector: (row) => row.notifyByLists,
      sortable: true,
      minWidth: COLUMNS_WIDTH.XXLARGE,
      maxWidth: COLUMNS_WIDTH.XXLARGE,
      minHeight: 'max-content',
      cell: (row) => {
        const { notifyByLists, enableAutoNotiSchedule } = row
        return (
          <div>
            {Object.keys(notifyByLists).map((key) => (
              <div key={key}>{notifyByLists[key] === STATUS.ENABLE ? CONFIG_SETTING_NOTIFICATION_FIELD[key] : ''}</div>
            ))}
            <div>{enableAutoNotiSchedule === STATUS.ENABLE ? intl.formatMessage({ id: 'enable_auto_noti_schedule' }) : ''}</div>
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'notification_template' }),
      selector: (row) => row.messageTemplate,
      sortable: true,
      minWidth: COLUMNS_WIDTH.XLARGE,
      maxWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => {
        const { messageTemplate } = row
        return (
          <div>
            {templates?.map((item) => {
              const matched = Object.keys(messageTemplate).find((key) => messageTemplate[key] === item.value)
              if (matched) {
                return <div key={item.value}>{item.label}</div>
              }
              return null
            })}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'stationsName' }),
      selector: 'stationsName',
      minWidth: COLUMNS_WIDTH.XXXLARGE,
      maxWidth: COLUMNS_WIDTH.XXXLARGE,
      cell: (row) => (
        <div
          style={{
            maxWidth: '100%',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
          {row.stationsName || 'Hệ thống'}
        </div>
      )
    },
    {
      name: intl.formatMessage({ id: 'status' }),
      selector: 'stationsName',
      sortable: true,
      minWidth: COLUMNS_WIDTH.LARGE,
      maxWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => {
        return (
          <div>
            <MySwitch
              checked={row.enableConfig === 1 ? true : false}
              onChange={(e) => {
                const dataPayload = {
                  stationsId: row.stationsId,
                  messageConfigId: row.messageConfigId,
                  data: {
                    enableConfig: e.target.checked ? 1 : 0
                  }
                }
                onUpdateEnableUse(dataPayload)
              }}
            />
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      selector: (row) => row.stationsId,
      sortable: true,
      minWidth: COLUMNS_WIDTH.XXLARGE,
      maxWidth: COLUMNS_WIDTH.XXLARGE,
      cell: (row) => {
        return (
          <div>
            <span
              href="/"
              className="pointer"
              onClick={(e) => {
                e.preventDefault()
                history.push(`/pages/edit-automatic-takecare-customer`, row)
              }}>
              <Edit className="mr-50" size={15} />{' '}
            </span>

            <span className="pointer" onClick={() => ModalSwal(row?.messageConfigId)}>
              <Trash className="pointer ml-2" size={15} />
            </span>
          </div>
        )
      }
    }
  ]

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    setCurrentIndex((page - 1) * paramsFilter.limit)
    setParamsFilter(newParams)
    fetchData(newParams)
  }

  const CustomPaginations = () => {
    const lengthOfData = items?.length
    return (
      <BasicTablePagingCopy
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        lengthOfData={lengthOfData}
        handlePaginations={handlePaginations}
        skip={paramsFilter.skip}
        limit={paramsFilter.limit}
        totalRestData={total}
      />
    )
  }

  const handleFilterChange = (key, value) => {
    const newFilter = value === '' ? {} : { [key]: value }
    const newParams = {
      ...paramsFilter,
      filter: newFilter,
      skip: 0
    }

    setParamsFilter(newParams)
    fetchData(newParams)
  }

  const fetchData = (params) => {
    setIsLoading(true)
    StationMessageConfigService.getStationsAndItsConfigs(params)
      .then((result) => {
        if (result?.statusCode === 200) {
          setItems(result.data.data)
          setTotal(result.data.total)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setIsLoading(true)
    fetchData(DefaultFilter)
    getTemplates()
  }, [])

  useEffect(() => {
    if (currentPage > 1 && firstPage) {
      setFirstPage(false)
      return
    }
    const newParams = {
      ...paramsFilter,
      skip: (currentPage - 1) * paramsFilter.limit
    }
    setCurrentIndex((currentPage - 1) * paramsFilter.limit)
    setParamsFilter(newParams)
    fetchData(newParams)
  }, [currentPage])

  const handleSearch = () => {
    const newParams = {
      ...paramsFilter,
      searchText: searchValue || undefined,
      skip: 0
    }
    setParamsFilter(newParams)
    fetchData(newParams)
  }

  const handleDelete = (messageConfigId) => {
    StationMessageConfigService.deleteStationMessageConfigs({
      messageConfigId: messageConfigId
    }).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          fetchData(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'delete' }) }))
        }
      }
    })
  }

  const MySwal = withReactContent(Swal)
  const ModalSwal = (messageConfigId) => {
    return MySwal.fire({
      title: intl.formatMessage({ id: 'do_you_delete' }),
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'agree' }),
      cancelButtonText: intl.formatMessage({ id: 'shut' }),
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-primary ml-1'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(messageConfigId)
      }
    })
  }

  return (
    <div>
      <div>
        <Card>
          <Row className="mx-0 mt-1">
            <Col className="d-flex mt-sm-0 mt-1" sm="4" lg="3" xs="12">
              <InputGroup className="input-search-group">
                <Input
                  placeholder={intl.formatMessage({ id: 'Search' })}
                  className="dataTable-filter"
                  type="search"
                  bsSize={SIZE_INPUT}
                  id="search-input"
                  value={searchValue}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      fetchData(DefaultFilter)
                    }
                    setCurrentPage(1)
                    setSearchValue(e.target.value)
                  }}
                />
              </InputGroup>
              <Button color="primary" size={SIZE_INPUT} className="mb-1" onClick={() => handleSearch()}>
                <Search size={15} />
              </Button>
            </Col>
            <Col sm="4" lg="3" xs="12" className="mb-1">
              <BasicAutoCompleteDropdown
                placeholder={intl.formatMessage({ id: 'station_code' })}
                name="stationsId"
                options={[
                  {
                    label: 'Tất cả',
                    value: ''
                  },
                  {
                    label: 'Hệ thống',
                    value: null
                  },
                  ...listNewStation
                ]}
                onChange={({ value }) => {
                  setCurrentPage(1)
                  setCurrentIndex(0)
                  handleFilterChange('stationsId', value)
                }}
              />
            </Col>
            <Col sm="4" lg="3" xs="12" className="mb-1">
              <Button.Ripple color="primary" size="md" onClick={() => history.push('/pages/create-automatic-takecare-customer')}>
                {intl.formatMessage({ id: 'add_new' })}
              </Button.Ripple>
            </Col>
          </Row>
        </Card>

        <div></div>
      </div>
      <div id="users-data-table">
        <DataTable
          noHeader
          // pagination
          paginationServer
          className="react-dataTable"
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          data={items}
          progressPending={isLoading}
        />
        {CustomPaginations()}
      </div>
    </div>
  )
}

export default injectIntl(memo(AutomationCustomers))
