import '@styles/react/libs/tables/react-dataTable-component.scss'
import React, { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Search } from 'react-feather'
import { injectIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Label, FormGroup, Card, Row, Col, InputGroup, Input, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import addKeyLocalStorage, { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import ApiKey from '../../../services/apiKeyService'
import MySwitch from '../../components/switch'
import BasicTextCopy from '../../components/BasicCopyText'
import BasicTablePaging from '../../components/BasicTablePaging'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicInputNumber from '../../components/inputNumber'
import { number_to_price } from '../../../helper/common'

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20
}

const DataTables = ({ intl }) => {
  const history = useHistory()
  const [currentPage, setCurrentPage] = useState(1)
  const [stationsId, setStationsId] = useState(null)
  const [total, setTotal] = useState(20)
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [modal, setModal] = useState(false)
  const [apiKeyName, setApiKeyName] = useState('')
  const readLocal = readAllStationsDataFromLocal();
  const listStation = readLocal.sort((a,b) => a - b)
  const listNewStation = listStation.map(item =>{
    return {
      ...item,
      label : item.stationCode,
      value : item.stationsId
    }
  })

  const onUpdateEnableUse = (id, data) => {
    const dataUpdate = {
      id: id,
      data: data
    }
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      ApiKey.handleUpdateData(dataUpdate, newToken).then((res) => {
        if (res) {
          const { statusCode } = res
          if (statusCode === 200) {
            const newParams = {
              ...paramsFilter,
              skip: (currentPage - 1) * paramsFilter.limit
            }
            getData(newParams)
            toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
          }
        }
      })
    }
  }

  const columns = [
    {
      name: intl.formatMessage({ id: 'partner_name' }),
      sortable: true,
      minWidth: '200px',
      cell: (row) => {
        const { apiKeyName } = row
        return (
          <div className="d-flex">
            <span>
              <BasicTextCopy value={apiKeyName} />
            </span>
            <span>{apiKeyName}</span>
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'code_api' }),
      sortable: true,
      minWidth: '400px',
      cell: (row) => {
        const { apiKey } = row
        return (
          <div className="d-flex">
            <span>
              <BasicTextCopy value={apiKey} />
            </span>
            <span>{apiKey}</span>
          </div>
        )
      }
    },
    {
      name: 'Giới hạn lượt sử dụng của API Key',
      minWidth: '180px',
      cell: (row) => {
        return (
          <BasicInputNumber
            onBlur={(e) => {
              const data = {
                usageLimitInMonth: e.target.rawValue ? e.target.rawValue : String(e.target.rawValue) === '0' ? 0 : null
              }
              onUpdateEnableUse(row.apiKey, data)
            }}
            value={row?.usageLimitInMonth}
          />
        )
      }
    },
    {
      name: 'Số lượt call api trong tháng',
      minWidth: '170px',
      cell: (row) => number_to_price(row?.callCountInMonth)
    },
    {
      name: 'Số lượt call',
      minWidth: '150px',
      cell: (row) => number_to_price(row?.callCount)
    },
    {
      name: intl.formatMessage({ id: 'on/off_code' }),
      center: true,
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { apiKeyEnable } = row
        return (
          <MySwitch
            checked={apiKeyEnable === 1 ? true : false}
            onChange={(e) => {
              onUpdateEnableUse(row.apiKey, {
                apiKeyEnable: e.target.checked ? 1 : 0
              })
            }}
          />
        )
      }
    }
  ]

  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)
  }

  function getData(params) {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      ApiKey.getList(params, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          setParamsFilter(params)
          if (statusCode === 200) {
            setItems(data.data)
            setTotal(data.total)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        } else {
          setTotal(1)
          setItems([])
        }
      })
    } else {
      window.localStorage.clear()
    }
  }

  useEffect(() => {
    getData(paramsFilter)
  }, [])

  const handleSearch = () => {
    const newParams = {
      ...paramsFilter,
      searchText: searchValue || undefined,
      skip: 0
    }
    getData(newParams)
  }

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    if (page === 1) {
      getData(newParams)
      return null
    }
    getData(newParams)
    setCurrentPage(page + 1)
  }

  const CustomPaginations = () => {
    const lengthItem = items.length
    return <BasicTablePaging items={lengthItem} handlePaginations={handlePaginations} skip={paramsFilter.skip} />
  }

  const newApiKey = () =>{
    const newParam = {
      apiKeyName : apiKeyName,
      stationsId : stationsId,
      apiKeyEnable : 1 // mặc định sẵn là mở apiKey
    }
    if(!apiKeyName){
      toast.error(intl.formatMessage({ id: 'error_apiKeyName'}))
      return
    }
    if(!stationsId){
      toast.error(intl.formatMessage({ id: 'error_stationsId'}))
      return
    }
    ApiKey.handleInsertData(newParam).then((res) => {
      if (res) {
        const { statusCode, error } = res
        if (statusCode === 200) {
          getData(paramsFilter, true)
          setModal(false)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'add_new' }) }))
        } else {
          if(error === "APIKEY_STATION_EXISTED"){
            toast.error(intl.formatMessage({ id: 'error-apikey'}))
            return
          }
          if(error === "APIKEY_NAME_EXISTED"){
            toast.error(intl.formatMessage({ id: 'error-apikeyName'}))
            return
          }
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'add_new' }) }))
        }
      }
    })
    setApiKeyName('')
    setStationsId(null)
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1">
          <Col sm="4" lg="3" xs="12" className="d-flex mt-sm-0 mt-1">
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: 'Search' })}
                className="dataTable-filter"
                type="search"
                bsSize="md"
                id="search-input"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value)
                }}
              />
            </InputGroup>
            <Button color="primary" size="md" className="mb-1" onClick={() => handleSearch()}>
              <Search size={15} />
            </Button>
          </Col>
          <Col className="mb-1">
            <Button.Ripple
              color="primary"
              size="md"
              onClick={() => {
                setModal(true)
                // setUserData({})
              }}>
              {intl.formatMessage({ id: 'add_new' })}
            </Button.Ripple>
          </Col>
        </Row>
        <div className="mx-0 mb-50 [dir]">
          <DataTable
            noHeader
            // pagination
            paginationServer
            className="react-dataTable"
            columns={columns}
            sortIcon={<ChevronDown size={10} />}
            // paginationComponent={CustomPagination}
            data={items}
            progressPending={isLoading}
          />
          {CustomPaginations()}
        </div>
      </Card>
      <Modal
        isOpen={modal}
        toggle={() => {
          setModal(false)
        }}
        className={`modal-dialog-centered `}>
        <ModalHeader toggle={() => setModal(false)}>{intl.formatMessage({ id: 'add_new' })}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="apiKeyName">{intl.formatMessage({ id: 'partner_name' })}</Label>
            <Input
              id="apiKeyName"
              name="apiKeyName"
              placeholder={intl.formatMessage({ id: 'partner_name' })}
              value={apiKeyName}
              onChange={(e) => {
                const { name, value } = e.target
                setApiKeyName(value)
              }}
              autoComplete="new-password"
            />
          </FormGroup>
          <FormGroup>
            <Label for="apiKeyName">{intl.formatMessage({ id: 'stationCode' })}</Label>
            <BasicAutoCompleteDropdown  
              placeholder='Mã trung tâm'
              name='stationsId'
              options={listNewStation}
              onChange={({ value }) => setStationsId(value)}
              value={listNewStation.filter((option) => option.stationsId === stationsId)}
            />
          </FormGroup>
          <FormGroup>
          <Button.Ripple
              color="primary"
              size="md"
              onClick={() => {
                newApiKey()
              }}>
              {intl.formatMessage({ id: 'add_new' })}
            </Button.Ripple>
          </FormGroup>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default injectIntl(memo(DataTables))
