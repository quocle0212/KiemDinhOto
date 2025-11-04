import '@styles/react/libs/tables/react-dataTable-component.scss'
import React, { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Search } from 'react-feather'
import { injectIntl } from "react-intl"
import ReactPaginate from 'react-paginate'
import { toast } from 'react-toastify'
import { Card, Row, Col, InputGroup, Input, Button, Nav, NavItem, TabContent, TabPane, NavLink } from 'reactstrap'
import addKeyLocalStorage from '../../../helper/localStorage'
import ApiKey from '../../../services/apiKeyService'
import MySwitch from '../../components/switch'
import BasicTextCopy from '../../components/BasicCopyText'
import BasicTablePaging from '../../components/BasicTablePaging'
import SystemSchedule from './systemSchedule'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20
}

const DataTables = ({intl}) => {
  const history = useHistory()
    let schedules = '4'
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [total, setTotal] = useState(20)
    const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [active, setActive] = useState(schedules)

    const onUpdateEnableUse = (id,data) => {
     const dataUpdate = {
      id: id,
      data : data
     }
     const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
      if (token) {
        const newToken = token.replace(/"/g, '')
        ApiKey.handleUpdateData(dataUpdate,newToken).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          const newParams = {
            ...paramsFilter,
            skip: (currentPage - 1) * paramsFilter.limit
          }
          getData(newParams)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
        }
      }
    })}
    }

    const columns = [
        {
            name: intl.formatMessage({ id: 'partner_name' }),
            sortable: true,
            minWidth: '300px',
            maxWidth: '300px',
            cell: (row) => {
              const { apiKeyName } = row
             return <div className='d-flex'>
             <span>{ apiKeyName }</span>
             <span><BasicTextCopy value={apiKeyName}/></span>
             </div>
            }
        },
        {
          name: intl.formatMessage({ id: 'code_api' }),
          sortable: true,
          minWidth: '500px',
          maxWidth: '500px',
          cell: (row) => {
            const { apiKey } = row
           return <div className='d-flex'>
            <span>{ apiKey }</span>
            <span><BasicTextCopy value={apiKey}/></span>
            </div>
          }
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
                  onChange={e => {
                    onUpdateEnableUse(row.apiKey,{
                      apiKeyEnable: e.target.checked ? 1 : 0
                    })
                  }}
                />
              )
            }
        },
    ]

    const handlePagination = (page) => {
      const newParams = {
        ...paramsFilter,
        skip: page.selected * paramsFilter.limit
      }
      getData(newParams)
      setCurrentPage(page.selected + 1)
    }

    const CustomPagination = () => {
        const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))  
        return (
          <ReactPaginate
            previousLabel={''}
            nextLabel={''}
            breakLabel='...'
            pageCount={count || 1}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            activeClassName='active'
            forcePage={currentPage !== 0 ? currentPage - 1 : 0}
            onPageChange={page => handlePagination(page)}
            pageClassName={'page-item'}
            nextLinkClassName={'page-link'}
            nextClassName={'page-item next'}
            previousClassName={'page-item prev'}
            previousLinkClassName={'page-link'}
            pageLinkClassName={'page-link'}
            breakClassName='page-item'
            breakLinkClassName='page-link'
            containerClassName={
              'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
            }
          />
        )
      }

    function getData(params){
      const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
      if (token) {
        const newToken = token.replace(/"/g, '')
        ApiKey.getList(params, newToken).then((res) => {
          if (res) {
            const { statusCode, data, message } = res
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
      if(page === 1){
        getData(newParams)
        return null
      }
      getData(newParams)
      setCurrentPage(page + 1)
    }
    const toggle = tab => {
      if (active !== tab) {
          setActive(tab)
      }
    }
    const CustomPaginations = () =>{
      const lengthItem = items.length
      return (
        <BasicTablePaging 
          items={lengthItem}
          handlePaginations={handlePaginations}
        />
      )
    }

  return (
    <Fragment>
      <Nav tabs>
        <NavItem>
          <NavLink
            active={active === schedules}
            onClick={() => {
                toggle(schedules)
            }}
          >
            <span className='align-middle'>{intl.formatMessage({ id: 'schedule' })}</span>
          </NavLink>
        </NavItem>
      </Nav>
        <TabContent className='py-50' activeTab={active}>
          <TabPane tabId={schedules}>
            <Row >
              <Col sm='12' xs='12'>
                <SystemSchedule></SystemSchedule>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Fragment>
  );
}

export default injectIntl(memo(DataTables)) 
