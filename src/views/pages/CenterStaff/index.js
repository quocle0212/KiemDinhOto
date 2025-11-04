// @ts-nocheck
// ** React Imports
import { Fragment, memo, useEffect, useState } from "react";
// ** Store & Actions
import Avatar from '@components/avatar';
import "@styles/react/libs/tables/react-dataTable-component.scss";
import _ from "lodash";
import moment from "moment";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit, RotateCcw, Search, User } from "react-feather";
import { useForm } from "react-hook-form";
import { injectIntl } from "react-intl";
import ReactPaginate from "react-paginate";
import { useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Col,
  CustomInput,
  Input,
  InputGroup,
  Row
} from "reactstrap";
import XLSX from 'xlsx';
import addKeyLocalStorage, { readAllStationsDataFromLocal, readListRoleFromLocalstorage } from "../../../helper/localStorage";
import CenterService from '../../../services/centerService';
import UserService from '../../../services/userService';
import BasicAutoCompleteDropdown from "../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown";
import BasicTablePaging from '../../components/BasicTablePaging';
import LoadingDialog from "../../components/buttons/ButtonLoading";
import Status from '../../components/status';
import MySwitch from '../../components/switch';
import { SIZE_INPUT } from "./../../../constants/app";
import "./index.scss";
import ResetPasswordUser from "./resetPasswordUser";

const statusOptions = [
  { value: '', label: 'Tất cả trạng thái'},
  { value: 1, label:  'Bình thường'}, 
  { value: 0, label:  'Đã khoá'},
];

const userOptions = [
    {value : 1, label : "station_director"},
    {value : 2, label : "registrar"}
]

const DefaultFilter = {
  filter: {
    // active: 1
  },
  skip: 0,
  limit: 20
};

const readRole = readListRoleFromLocalstorage();

const DataTableTechnician = ({ intl }) => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name: "ID",
      selector: row => <div 
      onClick={(e) => {
        e.preventDefault();
        history.push("/users/form-center", row)
      }}
      className="click_row"
      >{row.appUserId}</div>,
      sortable: true,
      maxWidth: "120px",
      minWidth: "120px",
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
      name: intl.formatMessage({ id: "stationCode" }),
      selector: "stationCode",
      sortable: true,
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) => {
        const { stationCode, appUserId, stationsId } = row;
        return <BasicAutoCompleteDropdown id={`stationCode_select_${stationsId}`}
        onChange={(e) => {
          handleChanges(e.stationsId, appUserId);
        }}
        placeholder={intl.formatMessage({ id: "stationCode" })}
        options={listNewStation}
        // defaultMenuIsOpen
        getOptionLabel={(option) => option.stationCode}
        getOptionValue={(option) => option.stationsId}
        value = {
          listNewStation.filter(option => 
              option.stationsId === stationsId)
        }
        name="stationsId"
      />
      },
    },
    {
      name: intl.formatMessage({ id: "role" }),
      sortable: true,
      minWidth: "250px",
      maxWidth: "250px",
      cell: (row) => {
        const { appUserRoleId } = row;
        const valueRole = readRole.find(el => el.appUserRoleId === appUserRoleId)
        const _appUserRoleName = valueRole ? valueRole.appUserRoleName : "-"
      return (
        <div className="style_role">
          <Avatar className="rounded-circle" color='light-success' icon={<User size={18} />} />
          <h6 className="">{_appUserRoleName}</h6>
        </div>
      )
      },
    },
    {
      name: intl.formatMessage({ id: "birthDay" }),
      selector: "birthDay",
      sortable: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const {birthDay } = row
        return (
          <div>
            {birthDay ? birthDay : '-'}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "home_town" }),
      selector: "userHomeAddress",
      sortable: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const {userHomeAddress } = row
        return (
          <div>
            {userHomeAddress ? userHomeAddress : '-'}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "phoneNumber" }),
      selector: "phoneNumber",
      sortable: true,
      minWidth: "150px",
      maxWidth: "150px",
    },
    {
      name: intl.formatMessage({ id: "messageStatus" }),
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const { lastActiveAt, createdAt} = row
        let today = moment()
        let dayCount = today.diff( lastActiveAt === null ? createdAt : lastActiveAt , 'days')
        return (
          <Status params ={dayCount}/>
        )
      }
    },
    {
      name: intl.formatMessage({ id: "Email" }),
      selector: "email",
      sortable: true,
      minWidth: "200px",
      maxWidth: "200px",
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
      minWidth: "130px",
      // maxWidth: "150px",
      cell: (row) => {
        const { createdAt } = row;

        return <div>{moment(createdAt).format("hh:mm DD/MM/YYYY")}</div>;
      },
    },
    {
      name: intl.formatMessage({ id: "action" }),
      selector: "action",
      cell: (row) => {
        const { appUserId, lastName, firstName, phoneNumber, active, username } = row;
        const newPhone = !phoneNumber || phoneNumber === "" ? " " : phoneNumber;
        return (
          <div>
              <span
                href="/"
                className="pointer"
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/users/form-center", row)
                }}
              >
                <Edit className="mr-50" size={15} />{" "}
              </span>

            <span
              className="pointer ml-1"
              onClick={(e) => {
                e.preventDefault();
                let newItem = { ...row };
                setIdTrans(newItem);
                togglePasswordOpen();
              }}
            >
              <RotateCcw size={15} />
            </span>
          </div>
        );
      },
    },
  
  ];
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const history = useHistory()
  // ** States
  const [check, setCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(20);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [role, setRole] = useState([]);
  const [firstPage, setFirstPage] = useState(false)
  const newRole = role.map(item =>{
    return {
      ...item,
      label : item.appUserRoleName,
      value : item.appUserRoleId
    }
  })
  newRole?.unshift({ value : '', label : 'Tất cả vai trò'})
  const readLocal = readAllStationsDataFromLocal();
  const listStation = readLocal.sort((a,b) => a - b)
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false);
  const [idTrans, setIdTrans] = useState(null);
  // const [staff, setStaff] = useState([])
  // const totalData = [...items,...staff]
  // const totalData = items.concat(staff)
  const listNewStation = listStation.map(item =>{
    return {
      ...item,
      label : item.stationCode,
      value : item.stationsId
    }
  })
  listNewStation?.unshift({ value : '', label : 'Tất cả mã trung tâm',stationsId : null, stationCode : 'Chưa phân công'})
  const togglePasswordOpen = () => {
    setSidebarPasswordOpen(!sidebarPasswordOpen);
  };
  // ** React hook form vars
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {},
  });
  const [userData, setUserData] = useState({});

  function getData(params, isNoLoading) {
    const newParams = {
      ...params,
    };
    if (!isNoLoading) {
      setIsLoading(true);
    }
    if(newParams.filter.active === ''){
      delete newParams.filter.active
    }
    if(newParams.filter.appUserRoleId === ''){
      delete newParams.filter.appUserRoleId
    }
    if(newParams.filter.stationsId === ''){
      delete newParams.filter.stationsId
    }
    if(newParams.filter.stationsId !== null){
      setCheck(false)
    }
    const token = window.localStorage.getItem(addKeyLocalStorage("accessToken"));

    if (token) {
      const newToken = token.replace(/"/g, "");

      CenterService.getList(newParams, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res;
          setParamsFilter(newParams);
          if (statusCode === 200) {
            setTotal(data.total);
            setItems(data.data);
          } else {
            toast.warn(intl.formatMessage({ id: "actionFailed" }));
          }
        } else {
          setTotal(1);
          setItems([]);
        }
        if (!isNoLoading) {
          setIsLoading(false);
        }
      });
    } else {
      window.localStorage.clear();
    }
  }

  const handleChanges = (e,appUserId) =>{
    const data = {
        id: appUserId,
        data: {}
    }
    if(e === 'lean'){
      data.data.stationsId = null
    }
    if(e !== 'lean'){
      data.data.stationsId = e
    }
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

  // function getListStaff(newParams) {
  //   CenterService.getListStaff(newParams).then((res) => {
  //     if (res) {
  //       const { statusCode, data } = res
  //       if (statusCode === 200) {
  //         setStaff(data.data)
  //       }
  //     }
  //   })
  // }

  const getDataSearch = _.debounce((params) => {
    getData(params, true);
  }, 1000);

  // ** Get data on mount
  useEffect(() => {
    getListRole()
    getData(paramsFilter);
    // getListStaff()
  }, []);

  // ** Function to handle filter
  const handleSearch = (e) => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      searchText: searchValue || undefined,
      skip: 0
    }
    setParamsFilter(newParams)
    getData(newParams)
  };


  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    if(paramsFilter.filter.stationsId === null){
      const newParams = {
        ...paramsFilter,
        filter: {
          stationsId: null,
        },
        skip: page.selected * paramsFilter.limit,
      }
      getData(newParams);
      setCurrentPage(page.selected + 1);
    } else {
      const newParams = {
        ...paramsFilter,
        skip: page.selected * paramsFilter.limit,
      };
      getData(newParams);
      setCurrentPage(page.selected + 1);
    }
  };

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const newParams = {
      ...paramsFilter,
      limit: parseInt(e.target.value),
      skip: 0,
    };
    getData(newParams);
    setCurrentPage(1);
    setRowsPerPage(parseInt(e.target.value));
  };

  const handleFilterChange = (name, value) => {
    setFirstPage(!firstPage)
    if(value === 'on'){
      const newParams = {
        ...paramsFilter,
        filter: {
          ...paramsFilter.filter,
          [name]: null ,
        },
        skip: 0,
        limit: 20
      };
      setParamsFilter(newParams)
      getData(newParams);
    } else {
      const newParams = {
        ...paramsFilter,
        filter: {
          ...paramsFilter.filter,
          [name]: value ,
        },
        skip: 0,
        limit: 20
      };
      setParamsFilter(newParams)
      getData(newParams);
    }
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))

    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        breakLabel="..."
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={
          "pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
        }
      />
    );
  };

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const onUpdateStationEnableUse = (path, data) => {
    UserService.updateUserById(data).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter, true)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
        }
      }
    })
  }

  const handleUpdateData = (data) => {
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

  const handleChange = (name, value, appUserId) => {
    const data = {
      id : appUserId,
      data: {
        appUserRoleId : Number(value)
      }
    }
    handleUpdateData(data)
  }

  const onExportExcel = async () => {
    let number = Math.ceil(total / 20)
    let params = Array.from(Array.from(new Array(number)),(element, index)  => index)
    let results = [];
    // let arrayStaff = []
    async function fetchData(param) {
      paramsFilter.skip = param * 20
      const response = await CenterService.getList(paramsFilter)
      const data = await response.data.data;
      return data;
    } 
    let _counter = 0;
    while (true) {
      const result = await fetchData(_counter++);
      if (result && result.length > 0) {
        results = [...results, ...result];
      } else {
        break;
      }
    }

      const convertedData = results.map(appUser => {
        const { lastActiveAt, createdAt } = appUser
        let today = moment()
        let dayCount = today.diff(lastActiveAt === null ? createdAt : lastActiveAt, 'days')
        let activeStatus = dayCount < 2 ? "Đang hoạt động" : `Hoạt động ${dayCount} ngày trước`
        let nameRole = readRole.find(el => el.appUserRoleId === appUser.appUserRoleId)
        return {
          'ID': appUser.appUserId,
          'Tài khoản': appUser.username,
          'Họ tên': appUser.firstName,
          'Mã trung tâm': appUser.stationCode === null ? "Tự do" : appUser.stationCode,
          'Vai trò' : nameRole.appUserRoleName,
          'SĐT' : appUser.phoneNumber,
          'Trạng thái' : activeStatus,
          'Email' : appUser.email,
          'Khóa': appUser.active === 1 ? 'Hoạt động' : 'Khóa',
          'Ngày tạo': moment(appUser.createdAt).format('DD/MM/YYYY'),
        }
      })

        let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(convertedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet');
        XLSX.writeFile(wb, "Nhanvien.xlsx");
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

  const CustomPaginations = () =>{
    const lengthItem = items.length
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
      <Card>
        <Row className="mx-0 mt-1">
        <Col
            className="d-flex mt-sm-0 mt-1"
            sm="4" lg='3' xs='12'
          >
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: "Search" })}
                className='dataTable-filter'
                type='search'
                bsSize={SIZE_INPUT}
                id='search-input'
                value={searchValue}
                onChange={(e) => { setSearchValue(e.target.value) }}
              />
            </InputGroup>
          <Button color='primary'
              size={SIZE_INPUT}
              className='mb-1'
              onClick={() => handleSearch()}
              >
                <Search size={15}/>
            </Button>
          </Col>
          <Col sm="4" lg='3' xs='12' className='mb-1'>
            <BasicAutoCompleteDropdown  
              placeholder='Trạng thái'
              name='active'
              options={statusOptions}
              onChange={({ value }) => handleFilterChange("active", value)}
            />
          </Col>
          <Col sm="4" lg='3' xs='12' className='mb-1'>
            <BasicAutoCompleteDropdown  
              placeholder='Mã trung tâm'
              name='stationsId'
              options={listNewStation}
              onChange={({ value }) => handleFilterChange("stationsId", value)}
            />
          </Col>
          <Col sm="4" lg='3' xs='12' className='mb-1'>
            <BasicAutoCompleteDropdown  
              placeholder='Vai trò'
              name='appUserRoleId'
              options={newRole}
              onChange={({ value }) => handleFilterChange("appUserRoleId", value)}
            />
          </Col>
          <div className='mt-0 d-flex ml-1 mb-1'>
            <CustomInput
              onChange={(e) => {
                if(e.target.checked === true){
                  const { name, value } = e.target;
                  setCheck(true)
                  handleFilterChange(name, value);
                }
                if(e.target.checked === false){
                  delete paramsFilter.filter.stationsId
                  getData(paramsFilter);
                  setCheck(false)
                }
              }}
              checked = {check}
              type="checkbox"
              id="stationsId"
              name='stationsId'
              label={intl.formatMessage({ id: "free" })}
              inline
              className="mr-2"
              />
              <LoadingDialog 
              onExportListCustomers={onExportExcel}
              title={intl.formatMessage({ id: "export" })}
              />
          </div>
        </Row>
        <div className={`${items.length > 5 ? "" : "centerstaff_tables"}`}>
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
        </div>
      </Card>
      <ResetPasswordUser item={idTrans} open={sidebarPasswordOpen} toggleSidebar={togglePasswordOpen} />
    </Fragment>
  );
};

export default injectIntl(memo(DataTableTechnician));
