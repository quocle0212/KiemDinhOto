import moment from "moment";
import Flatpickr from 'react-flatpickr'
import "@styles/react/libs/tables/react-dataTable-component.scss";
import '@styles/react/libs/flatpickr/flatpickr.scss'
import './index.scss'
import { toast } from "react-toastify";
import addKeyLocalStorage from "../../../helper/localStorage";
import {
  Card, Input, Label, Row, Col, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle,
  Modal, ModalHeader, ModalBody,
  Button, FormGroup, Form, InputGroup, InputGroupButtonDropdown
} from 'reactstrap'
import { Fragment, useState, useEffect, memo } from 'react'
import Service from '../../../services/request'
import { injectIntl } from 'react-intl';
import StationFunctions from '../../../services/StationFunctions'
import { ChevronDown, Search } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import _ from "lodash";
import MySwitch from '../../components/switch';
import UserService from '../../../services/userService'
import CenterService from '../../../services/centerService'
import BasicAutoCompleteDropdown from "../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown";
import BasicTablePaging from '../../components/BasicTablePaging'

const statusOptions = [
  { value: '', label: 'all_location' },
  { value: 1, label: 'Đăng kiểm viên' },
  { value: 2, label: 'Đăng kiểm viên bậc cao' },
]

const Staff = ({ intl, stationsId }) => {
  const DefaultFilter = {
    filter: {
      active: 1,
      stationsId : stationsId
    },
    skip: 0,
    limit: 20,
  }
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const [data, setData] = useState([])
  const [total, setTotal] = useState(20)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState('');
  const [role, setRole] = useState([]);
  const [listStation, setListStation] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [staff, setStaff] = useState([])
  // const totalData = data.concat(staff)
  const [firstPage, setFirstPage] = useState(false)

  const newRole = role?.map(item =>{
    return {
      ...item,
      label : item.appUserRoleName,
      value : item.appUserRoleId
    }
  })
  newRole?.unshift({ value : '', label : 'Tất cả vai trò'})
  const nameOptions = [
    { value: '', label: 'all' },
    { value: 1, label: 'patern' },
    { value: 2, label: 'technicians' },
    { value: 3, label: 'Đăng kiểm viên bậc cao' },
    { value: 4, label: 'Kế toán' },

  ]
  const token = window.localStorage.getItem(addKeyLocalStorage("accessToken"));
  const newToken = token.replace(/"/g, "");
  function getData(params, isNoLoading) {
    const newParams = {
      ...params,
    };
    if (!isNoLoading) {
      setIsLoading(true);
    }
    Object.keys(newParams.filter).forEach((key) => {
      if (!newParams.filter[key] || newParams.filter[key] === "") {
        delete newParams.filter[key];
      }
    });

    if (token) {

      UserService.getListStationUser(newParams, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res;
          setParamsFilter(newParams);
          if (statusCode === 200) {
            setTotal(data.total);
            setData(data.data);
          } else {
            toast.warn(intl.formatMessage({ id: "actionFailed" }));
          }
        } else {
          setTotal(1);
          setData([]);
        }
        if (!isNoLoading) {
          setIsLoading(false);
        }
      });
    } else {
      window.localStorage.clear();
    }
  }

  function getListRole() {
    UserService.getListRole().then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setRole(data.data)
        }
      }
    })
  }

  function getListStation() {
    StationFunctions.getListStation({
      filter: {},
      skip: 0,
      limit: 500,
      order: {
        key: 'createdAt',
        value: 'desc',
      },
    }, newToken).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setListStation(data.data)
        }
      }
    })
  }

  const handleUpdateStationsId = (data) => {
    UserService.updateUserById(data).then((res) => {
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
  
  // ** Function to handle Pagination and get data
  const handlePagination = page => {

    const newParams = {
      ...paramsFilter,
      skip: (page.selected) * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)

  }


  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: "ID" }),
      selector: "appUserId",
      sortable: true,
      minWidth: "120px",
      maxWidth: "120px",
    },
    {
      name: intl.formatMessage({ id: "username" }),
      selector: "username",
      sortable: true,
      minWidth: "150px",
      maxWidth: "150px",
    },
    {
      name: intl.formatMessage({ id: "fullname" }),
      sortable: true,
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) => {
        return (
          <div>
            {row.firstName} {row.lastName}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "role" }),
      sortable: true,
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) => {
        const { appUserRoleId, appUserId } = row;
        return <BasicAutoCompleteDropdown
        onChange={(e) => {
          handleChange('appUserRoleId', e.appUserRoleId, appUserId)
        }}
        name="appUserRoleId"
        placeholder={intl.formatMessage({ id: 'role' })}
        options={role}
        value = {
          role.filter(option => 
              option.appUserRoleId === appUserRoleId)
        }
        getOptionLabel={(option) => option.appUserRoleName}
        getOptionValue={(option) => option.appUserRoleId}
      />
      },
    },
    {
      name: intl.formatMessage({ id: "stationCode" }),
      selector: "stationCode",
      sortable: true,
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) => {
        const { stationCode, appUserId, stationsId } = row;
        return <BasicAutoCompleteDropdown
          onChange={(e) => {
            const data = {
              id: appUserId,
              data: {
                stationsId: e.stationsId
              }
            }
            handleUpdateStationsId(data);
          }}
          name="stationsId"
          options={listStation}
          placeholder={intl.formatMessage({ id: 'stationCode' })}
          value = {
            listStation.filter(option => 
              option.stationsId === stationsId)
            }
          getOptionLabel={(option) => option.stationCode}
          getOptionValue={(option) => option.stationsId}
        />
      },
    },
    {
      name: intl.formatMessage({ id: "phoneNumber" }),
      selector: "phoneNumber",
      sortable: true,
      minWidth: "200px",
      maxWidth: "200px",
    },
    {
      name: intl.formatMessage({ id: "Email" }),
      selector: "email",
      sortable: true,
      minWidth: "200px",
      // maxWidth: "200px",
    },
    {
      name: intl.formatMessage({  id: 'lock' }),
      maxWidth: '150px',
      minWidth: '150px', 
      center: true,
      cell: (row) => {
        return (
          <MySwitch
            checked={row.active === 0 ? true : false}
            onChange={e => {
              onUpdateStationEnableUse('AppUsers/updateUserById', {
                id: row.appUserId,
                data: {
                  active: e.target.checked ? 0 : 1
                }
              })
            }}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id: "createdAt" }),
      selector: "salary",
      sortable: true,
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) => {
        const { createdAt } = row;

        return <div>{moment(createdAt).format("hh:mm DD/MM/YYYY")}</div>;
      },
    },
  ]

  const handleUpdateData = (data) => {
    Service.send({
      method: 'POST',
      path: 'AppUsers/updateUserById',
      data: data,
      query: null
    }).then((res) => {
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
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0,
    }
    getData(newParams)
    // getListStaff(newParams)
  }

  useEffect(() => {
    getData(paramsFilter)
    getListRole()
    getListStation()
    // getListStaff(paramsFilter)
  }, []);

  function getListStaff(paramsFilter) {
    if(paramsFilter.filter.appUserRoleId === '-1'){
      delete paramsFilter.filter.appUserRoleId
    }
    CenterService.getListStaff(paramsFilter).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setStaff(data.data)
        }
      }
    })
  }

  const handleChange = (name, value, appUserId) => {
    const data = {
      id : appUserId,
      data: {
        appUserRoleId : value
      }
    }
    handleUpdateData(data)
    // getListStaff(paramsFilter)
  }

  const onUpdateStationEnableUse = (path, data) => {
    UserService.updateUserById(data).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter, true)
          // getListStaff(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
        }
      }
    })
  }

  const handleSearch = () => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      searchText: searchValue || undefined,
      skip: 0
    }
    getData(newParams)
    // getListStaff(newParams)
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
  }
  const CustomPaginations = () =>{
    const lengthItem = data.length
    return (
      <BasicTablePaging
        items={lengthItem}
        firstPage={firstPage}
        handlePaginations={handlePaginations}
      />
    )
  }
  return (
    <Fragment>
      <Card className="staff_card">
      <Row className='mx-0 mt-1 mb-50'>
        <Col sm='2' xs='12' className="mb-1 d-flex">
          {/* <Input onChange={(e) => {
            const { name, value } = e.target
            handleFilterChange(name, value)
          }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.appUserLevel || '') : ''} name='appUserLevel' bsSize='sm' >
            {
              statusOptions.map(item => {
                return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
              })
            }
          </Input> */}
          <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: 'Search' })}
                className="dataTable-filter"
                type="search"
                bsSize="md"
                id="search-input"
                value={searchValue}
                onChange={(e) => { setSearchValue(e.target.value) }}
              />
            </InputGroup>
            <Button color='primary'
              size="md"
              className='mb-1'
              onClick={() => handleSearch()}
              >
                <Search size={15}/>
            </Button>
        </Col>
        <Col sm='2' xs='6'>
          <BasicAutoCompleteDropdown onChange={({value}) => {
            handleFilterChange('appUserRoleId', value)
          }} type='select' 
          name='appUserRoleId' 
          options={newRole}
          placeholder={intl.formatMessage({ id: 'role' })}
          />
        </Col>
      </Row>
      <div id="users-data-table mx-0 mt-1 mb-50 margin">
        <DataTable
          noHeader
          // pagination
          paginationServer
          className='react-dataTable margin'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          // paginationComponent={CustomPaginations}
          data={data}
          progressPending={isLoading}
        />
        {CustomPaginations()}
      </div>
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(Staff));