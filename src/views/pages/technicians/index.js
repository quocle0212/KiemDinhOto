// @ts-nocheck
// ** React Imports
import { Fragment, memo, useEffect, useState } from "react";
// ** Store & Actions
import Avatar from '@components/avatar';
import "@styles/react/libs/tables/react-dataTable-component.scss";
import _ from "lodash";
import moment from "moment";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit, Eye, EyeOff, RotateCcw, Search, User } from "react-feather";
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
import addKeyLocalStorage, { readAllStationsDataFromLocal } from "../../../helper/localStorage";
import TechnicianService from '../../../services/TechnicianService';
import UserService from '../../../services/userService';
import BasicAutoCompleteDropdown from "../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown";
import BasicTablePaging from '../../components/BasicTablePaging';
import LoadingDialog from "../../components/buttons/ButtonLoading";
import { LOCAL, SIZE_INPUT } from "./../../../constants/app";
import "./index.scss";
import ResetPasswordUser from "./resetPasswordUser";

const statusOptions = [
  { value: undefined, label: 'Tất cả vị trí' },
  { value: 2, label: 'Đăng kiểm viên' },
  { value: 3, label: 'Đăng kiểm viên bậc cao' },
]

const userOptions = [
    {value : '', label : "registrar"},
    {value : 'assignment', label : "not_station"}
]

const DefaultFilter = {
  filter: {
    active: 1
  },
  skip: 0,
  limit: 20,
};

const DataTableTechnician = ({ intl }) => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name:intl.formatMessage({ id: "code_dkv" }),
      selector: row => <div 
      onClick={(e) => {
        e.preventDefault();
        history.push("/user/form-technicians", row)
      }}
      className="click_row"
      >{row.employeeCode ? row.employeeCode : '-'}</div>,
      sortable: true,
      maxWidth: "120px",
      minWidth: "120px",
    },
    {
      name: intl.formatMessage({ id: "fullname" }),
      sortable: true,
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) => {
        const {firstName } = row
        return (
          <div className="text-table">
            {firstName ? firstName : '-'}
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
        return <div style={{minWidth:'160px'}}>
          <BasicAutoCompleteDropdown id={`stationCode_select_${stationsId}`}
          onChange={(e) => {
              const data = {
                id: appUserId,
                data: {
                  stationsId: e.stationsId
                }
              }
              handleUpdateStationsId(data);
            }}
          placeholder={intl.formatMessage({ id: "stationCode" })}
          options={listNewStation}
          getOptionLabel={(option) => option.stationCode}
          getOptionValue={(option) => option.stationsId}
          value = {
            listNewStation.filter(option => 
                option.stationsId === stationsId)
          }
          name="stationsId"
        />
        </div>
      },
    },
    {
      name: intl.formatMessage({ id: "location" }),
      sortable: true,
      minWidth: "300px",
      maxWidth: "300px",
      cell: (row) => {
        const { appUserRoleName } = row;
      return (
        <div className="style_role">
          <Avatar className="rounded-circle" color='light-success' icon={<User size={18} />} />
          <h6 className="">{appUserRoleName || ''}</h6>
        </div>
      )
      },
    },
    // {
    //   name: intl.formatMessage({ id: 'location' }),
    //   maxWidth: '200px',
    //   minWidth: '200px',
    //   cell: (row) => {
    //     const { appUserLevel } = row
    //     return (
    //       <div>
    //         {appUserLevel === LOCAL.normal
    //           ? <Badge color='light-success' className='size_text'>{intl.formatMessage({ id: 'technicians' })}</Badge>
    //           : appUserLevel === LOCAL.high_level
    //           ? <Badge color='light-danger' className='size_text'>{intl.formatMessage({ id: 'technicians_height' })}</Badge>
    //           : '-'}
    //       </div>
    //     )
    //   }
    // },
    {
      name: intl.formatMessage({ id: "CCCD" }),
      selector: "appUserIdentity",
      sortable: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const {appUserIdentity } = row
        return (
          <div>
            {appUserIdentity ? appUserIdentity : '-'}
          </div>
        );
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
      name: intl.formatMessage({ id: "documentExpireDay" }),
      sortable: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const { licenseDateEnd } = row;
        return <div>{licenseDateEnd ? licenseDateEnd : '-'}</div>;
      },
    },
    {
      name: intl.formatMessage({ id: "certificate_number" }),
      selector: "licenseNumber",
      sortable: true,
      minWidth: "140px",
      maxWidth: "140px",
      cell: (row) => {
        const {licenseNumber } = row
        return (
          <div>
            {licenseNumber ? licenseNumber : '-'}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "show" }),
      center: true,
      minWidth: "100px",
      maxWidth: "100px",
      cell: (row) => {
        const { isHidden } = row;
        return <div>{isHidden === 0 ? <div className="pointer"
        onClick={() =>handleClick(row)}
        ><Eye />
        </div> : <div className="pointer"
        onClick={() =>handleClick(row)}
        ><EyeOff />
        </div>}</div>;
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
                  history.push("/user/form-technicians", row)
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
  const [dataFilterBody, setParamsFilter] = useState(DefaultFilter);
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
  const readLocal = readAllStationsDataFromLocal();
  const listStation = readLocal.sort((a,b) => a - b)
  const listNewStation = listStation?.map(item =>{
    return {
      ...item,
      label : item.stationCode,
      value : item.stationsId
    }
  })
  listNewStation?.unshift({ value : '', label : 'Tất cả mã trung tâm',stationsId : null, stationCode : 'Chưa phân công'})
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false);
  const [idTrans, setIdTrans] = useState(null);
  const [filterStation, setFilterStation] = useState('lean');
  const [firstPage, setFirstPage] = useState(false)
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
    if(newParams.filter.appUserLevel === ''){
      delete newParams.filter.appUserLevel
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
      if(newParams.filter.stationsId === 'assignment'){
        newParams.filter.stationsId = null
      }
      TechnicianService.getList(newParams, newToken).then((res) => {
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

  const handleClick = (row) =>{
    if(row.isHidden === 0){
      UserService.updateUserById({
        id : row.appUserId,
        data : {
          isHidden: 1
        }
      }).then(res => {
        if (res) {
          const { statusCode } = res
          if (statusCode === 200) {
            getData(dataFilterBody, true)
            toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
          }
        }
      })
    } else {
      UserService.updateUserById({
        id : row.appUserId,
        data : {
          isHidden: 0
        }
      }).then(res => {
        if (res) {
          const { statusCode } = res
          if (statusCode === 200) {
            getData(dataFilterBody, true)
            toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
          }
        }
      })
    }
  }

  const getDataSearch = _.debounce((params) => {
    getData(params, true);
  }, 1000);

  // ** Get data on mount
  useEffect(() => {
    getListRole()
    getData(dataFilterBody);
  }, []);

  // ** Function to handle filter
  const handleSearch = () => {
    setFirstPage(!firstPage)
    const newParams = {
      ...dataFilterBody,
      searchText: searchValue || undefined,
      skip: 0
    }
    setParamsFilter(newParams)
    getData(newParams)
  };


  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    if(dataFilterBody.filter.stationsId === null){
      const newParams = {
        ...dataFilterBody,
        filter: {
          stationsId: 'assignment' ,
        },
        skip: page.selected * dataFilterBody.limit,
      }
      getData(newParams);
      setCurrentPage(page.selected + 1);
    } else {
      const newParams = {
        ...dataFilterBody,
        skip: page.selected * dataFilterBody.limit,
      };
      getData(newParams);
      setCurrentPage(page.selected + 1);
    }
  };

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const newParams = {
      ...dataFilterBody,
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
        ...dataFilterBody,
        filter: {
          ...dataFilterBody.filter,
          [name]: null ,
        },
        skip: 0,
        limit: 20
      };
      setParamsFilter(newParams)
      getData(newParams);
    } else {
      const newParams = {
        // ...dataFilterBody,
        filter: {
          ...dataFilterBody.filter,
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

  const onExportExcel = async () => {
    let number = Math.ceil(total / 20)
    let params = Array.from(Array.from(new Array(number)),(element, index)  => index)
    let results = [];
    async function fetchData(NumberPage) {
      dataFilterBody.skip = NumberPage * 20
      const response = await TechnicianService.getList(dataFilterBody)
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
        return {
          'Mã ĐKV': appUser.employeeCode,
          'Họ và tên': appUser.firstName,
          'Mã trung tâm': appUser.stationCode,
          'ĐKV XCG bậc cao' : appUser.appUserLevel === LOCAL.high_level ? 'X' :'-',
          'ĐKV XCG' : appUser.appUserLevel === LOCAL.normal ? 'X' :'-',
          'Số CCCD' : appUser.appUserIdentity,
          'Năm sinh' : appUser.birthDay,
          'Quê quán' : appUser.userHomeAddress,
          'Ngày hết hạn': appUser.licenseDateEnd ? appUser.licenseDateEnd : '-',
          'Số giấy chứng nhận' : appUser.licenseNumber
        }
      })

        let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(convertedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet');
        XLSX.writeFile(wb, "Dangkiemvien.xlsx");
  }

  const handleUpdateStationsId = (data) => {
    UserService.updateUserById(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(dataFilterBody, true)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const handlePaginations = (page) => {
    const newParams = {
      ...dataFilterBody,
      skip: (page - 1) * dataFilterBody.limit
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
                bsSize='md'
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
              placeholder='Mã trung tâm'
              name='stationsId'
              options={listNewStation}
              onChange={({ value }) => handleFilterChange("stationsId", value)}
            />
          </Col>
          <Col sm="4" lg='3' xs='12' className="mb-1">
            <BasicAutoCompleteDropdown  
              placeholder='Vị trí'
              name='appUserRoleId'
              options={statusOptions}
              onChange={({ value }) => handleFilterChange("appUserRoleId", value)}
            />
          </Col>
          <Col sm="4" lg='3' xs='12' className='d-flex justify-content-between align-items-center mt-0' style={{ margin : '0 0 15px 0', zIndex : '0'}}>
            <CustomInput
              onChange={(e) => {
                if(e.target.checked === true){
                  const { name, value } = e.target;
                  setCheck(true)
                  handleFilterChange(name, value);
                }
                if(e.target.checked === false){
                  delete dataFilterBody.filter.stationsId
                  setCheck(false)
                  getData(dataFilterBody);
                }
              }}
              checked = {check}
              type="checkbox"
              id="stationsId"
              name='stationsId'
              label={intl.formatMessage({ id: "free" })}
              inline
              />
               <LoadingDialog 
              onExportListCustomers={onExportExcel}
              title={intl.formatMessage({ id: "export" })}
              />
          </Col>
        </Row>
        <div className={`${items.length > 5 ? "" : "technicians_tables"}`}>
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
