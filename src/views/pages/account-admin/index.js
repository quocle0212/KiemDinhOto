// ** React Imports
import { Fragment, memo, useEffect, useState } from 'react'
// ** Store & Actions
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { isUserLoggedIn, selectThemeColors } from '@utils'
import _ from 'lodash'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Key, Lock, MoreVertical, Search, Unlock } from 'react-feather'
import { useForm } from 'react-hook-form'
import { FormattedMessage, injectIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'
import { useHistory, useLocation } from 'react-router-dom'
import Select from 'react-select'
import { toast } from 'react-toastify'
import {
  Button,
  Card,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  UncontrolledDropdown
} from 'reactstrap'
import Service from '../../../services/request'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ACTIVE_STATUS } from '../../../constants/app'
import addKeyLocalStorage, { APP_USER_DATA_KEY, getAllArea } from '../../../helper/localStorage'
import AdminService from '../../../services/adminService'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicTablePaging from '../../components/BasicTablePaging'
import './index.scss'
import Role from './role'
import ModalUpdatePassword from './UpdatePassword'
import { useMetadataAndConfig } from '../../../context/MetadataAndConfig'

const DefaultFilter = {
  filter: {
    active: undefined
  },
  skip: 0,
  limit: 20
}
const List_Search_Filter = ['username', 'email', 'phoneNumber']

const MAX_LIMIT = 100

const DataTableServerSide = ({ intl }) => {
  const {STATION_TYPE} = useMetadataAndConfig()
  const newList = STATION_TYPE.map((el) => {
    return {
      value: String(el.value),
      label: el.label
    }
  })
  const statusOptions = [
    { value: '', label: intl.formatMessage({ id: 'stationStatus' }) },
    { value: 1, label: intl.formatMessage({ id: 'ok' }) },
    { value: 0, label: intl.formatMessage({ id: 'locked' }) }
  ]
  const [active, setActive] = useState('1')
  const [dataUser, setDataUer] = useState({})
  const [area, setArea] = useState([])
  const [valid, setValid] = useState(false)
  const [userNameValid, setUserNameValid] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [center, setCenter] = useState([])

  const listArea = getAllArea()

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setDataUer(JSON.parse(localStorage.getItem(APP_USER_DATA_KEY)))
    }
  }, [])
  const toggle = (tab) => {
    if (tab === '2') {
      const searchParams = new URLSearchParams(location.search)
      searchParams.set('tab', '2')
      history.replace({
        pathname: location.pathname,
        search: searchParams.toString()
      })
    }
    if (tab === '1') {
      const searchParams = new URLSearchParams(location.search)
      searchParams.set('tab', '1')
      history.replace({
        pathname: location.pathname,
        search: searchParams.toString()
      })
    }
    if (active !== tab) {
      setActive(tab)
    }
  }
  // ** Store Vars
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'username' }),
      selector: 'username',
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { username } = row
        return <div>{username}</div>
      }
    },
    {
      name: 'Email',
      selector: 'email',
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { email } = row
        return <div>{email === null ? '' : '****' + email?.substring(10)}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'fullname' }),
      selector: 'firstName',
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { firstName, lastName } = row

        return (
          <div>
            {lastName} {firstName}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'Area' }),
      selector: 'stationArea',
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { stationArea } = row
        const bolean = Array.isArray(stationArea)
        return (
          <div>
            {bolean === true ? (
              <div>
                {stationArea.map((item, index) => {
                  return (
                    <span>
                      <span>{item === 'ALL' ? 'Tất cả khu vực' : item}</span>
                      {index + 1 < stationArea.length ? ',' : ''}
                    </span>
                  )
                })}
              </div>
            ) : stationArea === 'ALL' ? (
              'Tất cả khu vực'
            ) : (
              '-'
            )}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'center' }),
      selector: 'stationType',
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { stationType } = row
        if (!stationType) {
          return '-'
        } else if (stationType === 'ALL') {
          return 'Tất cả trung tâm'
        } else if (Array.isArray(stationType)) {
          return (
            <div className='d-flex flex-column'>
              {stationType.map((item, index) => {
                return (
                  <span>
                   {index+1}. {STATION_TYPE?.find((el) => Number(el.value) === Number(item))?.label}
                  </span>
                )
              })}
            </div>
          )
        }
      }
    },
    {
      name: intl.formatMessage({ id: 'status' }),
      selector: 'active',
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { active } = row
        return <div>{active === ACTIVE_STATUS.LOCK ? intl.formatMessage({ id: 'locked' }) : intl.formatMessage({ id: 'ok' })}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'lastActive' }),
      selector: 'salary',
      sortable: true,
      minWidth: '220px',
      maxWidth: '220px',
      cell: (row) => {
        const { lastActiveAt } = row
        return <div>{lastActiveAt ? moment(lastActiveAt).format('hh:mm DD/MM/YYYY') : '-'}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'role' }),
      selector: 'roleName',
      minWidth: '150px',
      maxWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      selector: 'action',
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { lastName, firstName, phoneNumber, active, twoFACode, telegramId, roleId, email, staffId, stationArea, stationType } = row
        return (
          <UncontrolledDropdown>
            <DropdownToggle className="icon-btn hide-arrow" color="transparent" size="sm" caret>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem
                href="/"
                onClick={(e) => {
                  e.preventDefault()
                  setModal(true)
                  setUserData({
                    staffId,
                    firstName,
                    lastName,
                    phoneNumber,
                    twoFACode,
                    telegramId,
                    roleId,
                    email,
                    active,
                    stationArea,
                    stationType
                  })
                  setArea(stationArea)
                }}>
                <Edit className="mr-50" size={15} /> <span className="align-middle">{intl.formatMessage({ id: 'edit' })}</span>
              </DropdownItem>
              <span
                onClick={() => {
                  const newData = {
                    id: staffId,
                    data: {
                      // firstName,
                      // lastName,
                      // phoneNumber,
                      roleId,
                      // email,
                      active: active
                    }
                  }
                  ModalSwal(newData)
                }}>
                <DropdownItem
                  href="/"
                  onClick={(e) => {
                    e.preventDefault()
                  }}>
                  {active === ACTIVE_STATUS.OPEN ? (
                    <div>
                      <Lock className="mr-50" size={15} /> <span className="align-middle">{intl.formatMessage({ id: 'lock' })}</span>
                    </div>
                  ) : (
                    <div>
                      <Unlock className="mr-50" size={15} /> <span className="align-middle">{intl.formatMessage({ id: 'unLock' })}</span>
                    </div>
                  )}
                </DropdownItem>
              </span>
              <DropdownItem
                href="/"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpenModal(true)
                  setIdToUpdatePassword(staffId)
                }}>
                <Key className="mr-50" size={15} /> <span className="align-middle">Đổi mật khẩu</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        )
      }
    }
  ]
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  // ** States
  const [listRoles, setListRoles] = useState([])
  const [roleData, setRoledata] = useState({})
  const [roleLux, setRoleLux] = useState([])
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchField, setSearchField] = useState('username')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const history = useHistory()
  const [firstPage, setFirstPage] = useState(false)
  // ** React hook form vars
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})

  if (userData?.stationArea === null || userData?.stationArea === '') {
    delete userData.stationArea
  }
  let arr = ['ALL']
  if (userData?.stationArea === 'ALL') {
    userData.stationArea = arr
  }
  const defaultSelectArea = userData?.stationArea?.map((el) => {
    return { value: el, label: el === 'ALL' ? 'Tất cả khu vực' : el }
  })

  function getData(params, isNoLoading) {
    const newParams = {
      ...params
    }
    if (!isNoLoading) {
      setIsLoading(true)
    }
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, '')

      AdminService.getList(params, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          setParamsFilter(newParams)
          if (statusCode === 200) {
            setTotal(data.total)
            setItems(data.data)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'fetchData' }) }))
          }
        } else {
          setTotal(1)
          setItems([])
        }
        if (!isNoLoading) {
          setIsLoading(false)
        }
      })
    } else {
      window.localStorage.clear()
    }
  }

  const newValues = (item) => {
    const news = newList.filter((el) => el.value === item)
    return news[0]?.label
  }

  if (userData?.stationType === null || userData?.stationType === '') {
    delete userData.stationType
  }
  if (userData?.stationType === 'ALL') {
    userData.stationArea = arr
  }
  const defaultSelectType = userData?.stationType?.map((el) => {
    return { value: el, label: el === 'ALL' ? 'Tất cả trung tâm' : newValues(el) }
  })

  function getListRole() {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, '')

      AdminService.getListRole(
        {
          filter: {},
          skip: 0,
          limit: MAX_LIMIT
        },
        newToken
      ).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          if (statusCode === 200) {
            const newArr = data.data.map((el) => {
              return { label: el.roleName, value: el.roleId }
            })
            setRoleLux(newArr)
            setRoledata(data)
            setListRoles(data.data)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'fetchData' }) }))
          }
        }
      })
    }
  }

  function handleUpdateData(item, messageSuccess) {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      if (item.data.stationArea === 'ALL') {
        item.data.stationArea = arr
      }
      AdminService.handleUpdateData(item, newToken).then((res) => {
        if (res) {
          const { statusCode, error } = res
          if (statusCode === 200) {
            toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
            setModal(false)
            getData(paramsFilter)
          } else {
            if (error === 'DUPLICATE_EMAIL' && statusCode === 500) {
              toast.error(<FormattedMessage id="error_email" />)
            } else {
              toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
            }
          }
        }
      })
    }
  }

  function handleAddData(item, messageSuccess) {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (item.username.length < 6) {
      toast.error(<FormattedMessage id="error_userName" />)
      return null
    }
    if (token) {
      const newToken = token.replace(/"/g, '')

      AdminService.handleAddData(item, newToken).then((res) => {
        if (res) {
          const { statusCode, message, error } = res
          if (statusCode === 200) {
            toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'add' }) }))
            setModal(false)
            getData(paramsFilter)
          } else {
            if (error === 'DUPLICATE_USER_NAME') {
              toast.warn(intl.formatMessage({ id: error }))
              return
            }
            if (error === 'DUPLICATE_EMAIL' && statusCode === 500) {
              toast.error(<FormattedMessage id="error_email" />)
              return
            }
            toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'add' }) }))
          }
        }
      })
    }
  }

  const getDataSearch = _.debounce((params) => {
    getData(params, true)
  }, 2000)

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter)
    setTimeout(() => {
      getListRole()
    }, 1000)
    const searchParams = new URLSearchParams(location.search)
    const tab = searchParams.get('tab')

    if (tab) {
      switch (tab) {
        case '1':
          setActive('1')
          break
        case '2':
          setActive('2')
          break
      }
    }
  }, [])

  // ** Function to handle filter
  const handleSearch = () => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [searchField]: searchValue || undefined
      },
      skip: 0
    }
    getData(newParams)
  }

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)
  }

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const newParams = {
      ...paramsFilter,
      limit: parseInt(e.target.value),
      skip: 0
    }
    getData(newParams)
    setCurrentPage(1)
    setRowsPerPage(parseInt(e.target.value))
  }

  const handleChangeSearchField = (filed) => {
    const newParams = {
      ...paramsFilter,
      skip: 0
    }
    List_Search_Filter.forEach((text) => {
      delete newParams.filter[text]
    })
    newParams.filter[filed] = ''
    setSearchValue('')
    setSearchField(filed)
    getData(newParams)
  }

  const handleFilterChange = (name, value) => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0
    }
    if (name === 'active' && value === '') {
      delete newParams.filter.active
    }
    getData(newParams)
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel="..."
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'}
      />
    )
  }

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
  }

  const MySwal = withReactContent(Swal)
  const ModalSwal = (newData) => {
    if (newData.data.active === ACTIVE_STATUS.LOCK) {
      newData.data.active = ACTIVE_STATUS.OPEN
    } else if (newData.data.active === ACTIVE_STATUS.OPEN) {
      newData.data.active = ACTIVE_STATUS.LOCK
    }
    return MySwal.fire({
      title: intl.formatMessage({ id: 'do_you_update' }),
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'agree' }),
      cancelButtonText: intl.formatMessage({ id: 'shut' }),
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-primary ml-1'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateData(newData)
      }
    })
  }

  const onKeyDown = (e) => {
    let key = e.keyCode
    if ((key >= 48 && key <= 59) || (key >= 96 && key <= 105) || key === 8) {
      // setDisabled(false)
      // setValid(false)
    } else {
      // setValid(true)
      // setDisabled(true)
      e.preventDefault()
    }
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
    return <BasicTablePaging items={lengthItem} firstPage={firstPage} handlePaginations={handlePaginations} />
  }

  const [IsOpenModal, setIsOpenModal] = useState(false)
  const [passwordToUpdate, setPasswordToUpdate] = useState(undefined)
  const [idToUpdatePassword, setIdToUpdatePassword] = useState(undefined)
  const handleChangeInput = (caseInput, value) => {
    switch (caseInput) {
      case 'passwordToUpdate':
        setPasswordToUpdate(value.target.value)
        break
      default:
        break
    }
  }
  const handleUpdatePassword = () => {
    if (passwordToUpdate.length < 6) {
      toast.warn("Mật khẩu mới tối thiểu 6 ký tự")
      return
    }
    if (passwordToUpdate !== undefined && passwordToUpdate !== '' && passwordToUpdate !== null) {
      setIsLoading(true)
      updateNewPassword({
        id: idToUpdatePassword,
        newPassword: passwordToUpdate
      })
      setIsOpenModal(false)
    } else {
      toast.warn("Vui lòng nhập mật khẩu mới")
    }
  }
  const updateNewPassword = (params) => {
    Service.send({
      method: 'POST',
      path: 'Staff/adminChangePasswordStaff',
      data: params,
      headers: {}
    }).then((res) => {
      setIsLoading(false)
      if (res) {
        const { statusCode, message } = res
        if (statusCode === 200) {
          toast.success('Cập nhật thành công')
        } else {
          toast.warn('Cập nhật thất bại')
        }
      } else {
      }
    })
  }

  return (
    <Fragment>
      <Card className="accountAdmin">
        <Nav tabs>
          <NavItem>
            <NavLink
              active={active === '1'}
              onClick={() => {
                toggle('1')
              }}>
              {intl.formatMessage({ id: 'admin' })}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === '2'}
              onClick={() => {
                toggle('2')
              }}>
              {intl.formatMessage({ id: 'role' })}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent className="" activeTab={active}>
          <TabPane tabId="1">
            <Row className="mt-1">
              <Col className="d-flex mt-sm-0 mt-1" sm="4" xs="12" lg="3">
                <InputGroup className="input-search-group">
                  <Input
                    className="dataTable-filter"
                    placeholder={intl.formatMessage({ id: 'Search' })}
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
              <Col sm="4" xs="12" lg="3" className="mb-1">
                <BasicAutoCompleteDropdown
                  placeholder={intl.formatMessage({ id: 'stationStatus' })}
                  name="active"
                  options={statusOptions}
                  onChange={({ value }) => {
                    handleFilterChange('active', value)
                  }}
                />
              </Col>
              <Col sm="4" xs="12" lg="3" className="mb-1">
                <BasicAutoCompleteDropdown
                  placeholder={intl.formatMessage({ id: 'role' })}
                  name="roleId"
                  options={roleLux}
                  onChange={({ value }) => {
                    handleFilterChange('roleId', value)
                  }}
                />
              </Col>
              <Col className="mb-1">
                <Button.Ripple
                  color="primary"
                  size="md"
                  onClick={() => {
                    setModal(true)
                    setUserData({})
                  }}>
                  {intl.formatMessage({ id: 'add_new' })}
                </Button.Ripple>
              </Col>
            </Row>
            <DataTable
              noHeader
              // pagination
              paginationServer
              className="react-dataTable"
              columns={serverSideColumns}
              sortIcon={<ChevronDown size={10} />}
              // paginationComponent={CustomPagination}
              data={items}
              progressPending={isLoading}
            />
            {CustomPaginations()}
            <Modal
              isOpen={modal}
              toggle={() => {
                setModal(false)
                setValid(false)
              }}
              className={`modal-dialog-centered `}>
              <ModalHeader toggle={() => setModal(false)}>
                {userData.staffId ? intl.formatMessage({ id: 'edit' }) : intl.formatMessage({ id: 'add' })}{' '}
                {intl.formatMessage({ id: 'info' }, { type: intl.formatMessage({ id: 'User' }) })}
              </ModalHeader>
              <ModalBody>
                <Form
                  onSubmit={handleSubmit((data) => {
                    let newData = {
                      ...data,
                      phoneNumber: userData.phoneNumber,
                      email: userData.email,
                      roleId: userData.roleId
                    }
                    if (userData.staffId) {
                      if (area?.length === 0 || area === null) {
                        toast.error(<FormattedMessage id="error_area" />)
                        return
                      }
                      handleUpdateData({
                        id: userData.staffId,
                        data: {
                          ...newData,
                          stationArea: area,
                          stationType: center
                        }
                      })
                    } else {
                      handleAddData(newData)
                    }
                  })}>
                  {!userData.staffId ? (
                    <>
                      <FormGroup>
                        <Label for="username">{intl.formatMessage({ id: 'username' })}</Label>
                        <Input
                          id="username"
                          name="username"
                          innerRef={register({ required: true })}
                          invalid={errors.username && true}
                          placeholder="Bruce01"
                          defaultValue={userData?.username}
                          onChange={(e) => {
                            const { name, value } = e.target
                            setUserNameValid(false)
                            const validation = new RegExp('(?=.*^[a-zA-Z0-9]*$)')
                            if (!validation.test(value)) {
                              setUserNameValid(true)
                            }
                            if (value.length > 30) {
                              setUserNameValid(true)
                            }
                            handleOnchange(name, value)
                          }}
                          autoComplete="new-password"
                        />
                        {userNameValid ? (
                          <p style={{ color: 'red' }}>
                            {userData.username.length > 30
                              ? intl.formatMessage({ id: 'max_userName' })
                              : intl.formatMessage({ id: 'valid_username' })}
                          </p>
                        ) : (
                          ''
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label for="password">{intl.formatMessage({ id: 'password' })}</Label>
                        <Input
                          id="password"
                          name="password"
                          innerRef={register({ required: true })}
                          invalid={errors.password && true}
                          placeholder="****"
                          defaultValue={userData?.password}
                          type="password"
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                          autoComplete="new-password"
                        />
                      </FormGroup>
                    </>
                  ) : (
                    <>
                      <FormGroup>
                        <Label for="Area">{intl.formatMessage({ id: 'Area' })}</Label>
                        <Select
                          isClearable={true}
                          isMulti
                          className="react-select"
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          placeholder="Chọn"
                          onChange={(values) => {
                            setArea(values.map((el) => el.value))
                          }}
                          name="stationArea"
                          defaultValue={defaultSelectArea}
                          options={listArea}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="Area">{intl.formatMessage({ id: 'center' })}</Label>
                        <Select
                          isClearable={true}
                          isMulti
                          className="react-select"
                          classNamePrefix="select"
                          theme={selectThemeColors}
                          placeholder="Chọn"
                          onChange={(values) => {
                            setCenter(values.map((el) => el.value))
                          }}
                          name="stationType"
                          defaultValue={defaultSelectType}
                          options={newList}
                        />
                      </FormGroup>
                    </>
                  )}
                  <FormGroup>
                    <Label for="firstName">{intl.formatMessage({ id: 'name' })}</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      innerRef={register({ required: true })}
                      invalid={errors.firstName && true}
                      placeholder="Bruce"
                      defaultValue={userData?.firstName}
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="lastName">{intl.formatMessage({ id: 'sur_name' })}</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      innerRef={register({ required: true })}
                      invalid={errors.lastName && true}
                      placeholder="Wayne"
                      defaultValue={userData?.lastName}
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      innerRef={register({ required: true })}
                      invalid={errors.email && true}
                      placeholder="Wayne@gmail.com"
                      defaultValue={userData.email}
                      type="email"
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="phoneNumber">{intl.formatMessage({ id: 'phoneNumber' })}</Label>
                    <Input
                      innerRef={register({ required: true })}
                      invalid={errors.phoneNumber && true}
                      name="phoneNumber"
                      placeholder="+84943881692"
                      options={{ phone: true, phoneRegionCode: 'VI' }}
                      // onKeyDown={(e) => onKeyDown(e)}
                      defaultValue={userData.phoneNumber}
                      onChange={(e) => {
                        const { name, value } = e.target
                        const valueNumber = value.replace(/[^0-9]/g, '')
                        if (valueNumber.length !== 10) {
                          setValid(true)
                          setDisabled(true)
                        } else {
                          setValid(false)
                          setDisabled(false)
                        }
                        handleOnchange(name, valueNumber)
                      }}
                    />
                    {valid ? <p style={{ color: 'red' }}>{intl.formatMessage({ id: 'valid_number' })}</p> : ''}
                  </FormGroup>

                  <FormGroup>
                    <Label>{intl.formatMessage({ id: 'role' })}</Label>
                    <BasicAutoCompleteDropdown
                      name="roleId"
                      placeholder={intl.formatMessage({ id: 'chose' })}
                      options={listRoles}
                      getOptionLabel={(option) => option.roleName}
                      getOptionValue={(option) => option.roleId}
                      value={listRoles.filter((option) => option.roleId === userData?.roleId)}
                      onChange={(e) => {
                        handleOnchange('roleId', e.roleId)
                      }}></BasicAutoCompleteDropdown>
                  </FormGroup>

                  <FormGroup className="d-flex mb-0">
                    <Button.Ripple className="mr-1" color="primary" type="submit" disabled={disabled}>
                      {intl.formatMessage({ id: 'submit' })}
                    </Button.Ripple>
                  </FormGroup>
                </Form>
              </ModalBody>
            </Modal>
          </TabPane>
          {dataUser.roleId && +dataUser.roleId === 1 ? (
            <TabPane tabId="2">
              <Role roleData={roleData} />
            </TabPane>
          ) : null}
        </TabContent>
      </Card>
      <ModalUpdatePassword
        IsOpenModal={IsOpenModal}
        handleChangeInput={handleChangeInput}
        passwordToUpdate={passwordToUpdate}
        setIsOpenModal={setIsOpenModal}
        handleUpdatePassword={handleUpdatePassword}
      />
    </Fragment>
  )
}

export default injectIntl(memo(DataTableServerSide))
