// @ts-nocheck
// ** React Imports
import { Fragment, memo, useEffect, useState } from "react";
// ** Store & Actions
import '@styles/react/libs/flatpickr/flatpickr.scss';
import "@styles/react/libs/tables/react-dataTable-component.scss";
import _ from "lodash";
import moment from "moment";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit, Search, Trash } from "react-feather";
import Flatpickr from 'react-flatpickr';
import { useForm } from "react-hook-form";
import { injectIntl } from "react-intl";
import ReactPaginate from "react-paginate";
import { useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Col,
  Input,
  InputGroup,
  Row
} from "reactstrap";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import addKeyLocalStorage from "../../../helper/localStorage";
import VehicleService from '../../../services/vehicle';
import BasicAutoCompleteDropdown from "../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown";
import BasicTablePaging from '../../components/BasicTablePaging';
import MySwitch from '../../components/switch';
import Type, { TypeText } from "../../components/vehicletype";
import { VEHICLE_TYPE, VEHICLEVERIFIEDINFO } from "../../../constants/app";
import "./index.scss";
import LoadingDialogExportFile from "../../components/Export/LoadingDialogExportFile";

const DefaultFilter = {
  filter: {
  },
  skip: 0,
  limit: 20,
};

const ListVehicle = ({ intl, filterParam, apiFilter, Authenticated = true}) => {
  const MySwal = withReactContent(Swal)
  const ModalSwal = (appUserVehicleId) =>{
    return MySwal.fire({
      title: intl.formatMessage({ id: "do_you_delete" }),
      showCancelButton: true,
      confirmButtonText : intl.formatMessage({ id: "agree" }),
      cancelButtonText : intl.formatMessage({ id: "shut" }),
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-primary ml-1'
      },
    }).then((result) => {
      if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success',
            handleDelete(appUserVehicleId),
          )
  }})}
  const getAccuracy = (data) => {
    return data === VEHICLEVERIFIEDINFO.NOT_VERIFIED ? 
    intl.formatMessage({ id: "unchecked" }) :
    data === VEHICLEVERIFIEDINFO.VERIFIED ?
    intl.formatMessage({ id: "checked" }) :
    data === VEHICLEVERIFIEDINFO.VERIFIED_BUT_NO_DATA ? 
    intl.formatMessage({ id: "checked_but_no_data" }) :
    data === VEHICLEVERIFIEDINFO.VERIFIED_BUT_WRONG_EXPIRE_DATE ?
    intl.formatMessage({ id: "checked_but_wrong_expirationdate" }) :
    data === VEHICLEVERIFIEDINFO.VERIFIED_BUT_WRONG_VEHICLE_TYPE ?
    intl.formatMessage({ id: "checked_but_wrong_vehicle" }) :
    data === VEHICLEVERIFIEDINFO.VERIFIED_BUT_ERROR ?
    intl.formatMessage({ id: "check_but_error" }) :
    data === VEHICLEVERIFIEDINFO.NOT_VALID_SERIAL ?
    intl.formatMessage({ id: "check_not_serial" }) :
    '-' 
  }

   const getVehiclePlateColor = (color) => {
    return color === 'WHITE' ? "Trắng":
     color === 'BLUE' ? "Xanh":
     color === 'YELLOW' ? "Vàng":
     color === 'RED' ? "Đỏ":
     '-'
  }

  // ** Store Vars
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: "messagesDetail-customerMessagePlateNumber" }),
      // selector: "licensePlates",
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const { vehicleIdentity, vehiclePlateColor } = row
        return (
          <p className={`color_licensePlates
            ${vehiclePlateColor === 'WHITE' ? 'color_white' : " "}
            ${vehiclePlateColor === 'BLUE' ? 'color_blue' : " "}
            ${vehiclePlateColor === 'YELLOW' ? 'color_yellow' : " "}
            ${vehiclePlateColor === 'RED' ? 'color_red' : " "}
          `}>{vehicleIdentity}</p>
        )
      }
    },
    {
      name: intl.formatMessage({ id: "transportation" }),
      selector: "vehicleType",
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) => {
        const { vehicleType } = row;
        return (
          <Type vehicleType={vehicleType}/>
        );
      },
    },

    {
      name: intl.formatMessage({ id: "management-number" }),
      selector: "vehicleRegistrationCode",
      sortable: true,
      minWidth: "120px",
      maxWidth: "120px",
    },
    {
      name: intl.formatMessage({ id: "types" }),
      selector: "vehicleBrandName",
      sortable: true,
      minWidth: "100px",
      maxWidth: "100px",
    },
    {
      name: intl.formatMessage({ id: "username" }),
      selector: "username",
      sortable: true,
      minWidth: "150px",
      maxWidth: "150px",
    },
    {
      name: intl.formatMessage({ id: "stamp_gcn" }),
      selector: "certificateSeries",
      sortable: true,
      minWidth: "120px",
      maxWidth: "120px",
    },
    {
      name: intl.formatMessage({ id: "image-registration" }),
      selector: "username",
      center: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const { vehicleRegistrationImageUrl } = row;
        return (
          <div>{vehicleRegistrationImageUrl === '' ? '-' : 
        vehicleRegistrationImageUrl === null ?  '-' :
        vehicleRegistrationImageUrl === "string" ?  '-' :
        <a href={vehicleRegistrationImageUrl} className="click_row" target='_blank'>{intl.formatMessage({ id: "see" })}</a>
      }</div>
        )
      },
    },
    {
      name: intl.formatMessage({ id: "accuracy" }),
      minWidth: "200px",
      maxWidth: "200px",
      cell: (row) =>{
        const { vehicleVerifiedInfo } = row
        return (
          <div>{getAccuracy(vehicleVerifiedInfo)}</div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'booking_lock' }),
      maxWidth: '150px',
      minWidth: '150px',
      center: true,
      cell: (row) => {
        const { enableBookingStatus } = row;
        return (
          <MySwitch
            checked={enableBookingStatus === 0 ? true : false}
            onChange={e => {
              onUpdateStationEnableUse('AppUsers/updateUserById', {
                id: row.appUserId,
                data: {
                  enableBookingStatus: e.target.checked ? 0 : 1
                }
              })
            }}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id: "expiration-date" }),
      selector: "vehicleExpiryDate",
      center: true,
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const { vehicleExpiryDate } = row;
        const vehicleDay = moment(vehicleExpiryDate, "DD/MM/YYYY").format("DD/MM/YYYY")
        return <div>{vehicleDay !== 'Invalid date' ? vehicleDay : ''}</div>;
      },
    },
    {
      name: intl.formatMessage({ id: "action" }),
      selector: "action",
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => {
        const { appUserId, lastName, firstName, phoneNumber, active, username, appUserVehicleId } = row;
        const newPhone = !phoneNumber || phoneNumber === "" ? " " : phoneNumber;
        return (
          <div>
            <span
              href="/"
              className="pointer"
              onClick={() => ModalSwal(appUserVehicleId)}
            >
              <Trash className="pointer ml-2" size={15} />
            </span>
            <span
              href="/"
              className="pointer ml-1"
              onClick={(e) => {
                e.preventDefault();
                history.push("/pages/edit-vehicle", row)
              }}
            >
              <Edit className="mr-50" size={15} />{" "}
            </span>
          </div>
        );
      },
    },
  ];
  const [paramsFilter, setParamsFilter] = useState(filterParam === undefined ? DefaultFilter : filterParam);

  // ** States
  const [block, setBlock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(20);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  // const [passwordData, setPasswordData] = useState([]);
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false);
  const [idTrans, setIdTrans] = useState(null);
  const [date, setDate] = useState('');
  const [dateBHTV, setDateBHTV] = useState('');
  const [dateBHTNDS, setDateBHTNDS] = useState('');
  const history = useHistory()
  const [firstPage, setFirstPage] = useState(false)

  const accuraceOptions = [
    { value: null, label: intl.formatMessage({ id: "messageStatus" }) },
    { value: 1, label: intl.formatMessage({ id: "checked" }) },
    { value: '0', label: intl.formatMessage({ id: "unchecked" }) },
    { value: -1, label: intl.formatMessage({ id: "checked_but_no_data" }) },
    { value: -2, label: intl.formatMessage({ id: "checked_but_wrong_expirationdate" }) },
    { value: -3, label: intl.formatMessage({ id: "check_but_error" }) },
    { value: -10, label: intl.formatMessage({ id: "checked_but_wrong_vehicle" }) },
    { value: -20, label: intl.formatMessage({ id: "check_not_serial" }) },
  ];

  const vehicleType = [
    { value: null, label: intl.formatMessage({ id: "transportation" }) },
    { value: 1, label: intl.formatMessage({ id: "car" }) },
    { value: 20, label: intl.formatMessage({ id: "ro_mooc" }) },
    { value: 10, label: intl.formatMessage({ id: "other" }) },
  ];

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
    Object.keys(newParams.filter).forEach((key) => {
      if (!newParams.filter[key] || newParams.filter[key] === "" || newParams.filter[key] ===NaN ) {
        delete newParams.filter[key];
      }
    });
    const token = window.localStorage.getItem(addKeyLocalStorage("accessToken"));

    if (token) {
      const newToken = token.replace(/"/g, "");
      if(filterParam !== undefined && apiFilter !== undefined){
        VehicleService.getListTimeVehicle(newParams, newToken).then((res) => {
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
        return null
      }
      VehicleService.getList(newParams, newToken).then((res) => {
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

  const getDataSearch = _.debounce((params) => {
    getData(params, true);
  }, 1000);

  const handleFilterDay = (date) => {
    setFirstPage(!firstPage)
    if(date.length === 0){
      delete paramsFilter.filter.vehicleExpiryDate
      getDataSearch(paramsFilter)
      return
    }
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format("DD/MM/YYYY")
    setDate(newDate)
    const newParams = {
      ...paramsFilter,
      filter: {
      ...paramsFilter.filter,
        vehicleExpiryDate: newDate
      },
    };
    getDataSearch(newParams);
  }

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter);
  }, []);

  // ** Function to handle filter
  const handleSearch = () => {
    setFirstPage(!firstPage)
    const newParams = {
      ...paramsFilter,
      searchText: searchValue || undefined,
      skip: 0
    }
    getData(newParams)
  };

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit,
    };
    getData(newParams);
    setCurrentPage(page.selected + 1);
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
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value,
      },
      skip: 0,
    };
    if(name === "vehicleType" & value === null){
      delete newParams.filter.vehicleType
    }
    if(name === "vehicleVerifiedInfo" & value === null){
      delete newParams.filter.vehicleVerifiedInfo
    }
    setParamsFilter(newParams)
    getData(newParams);
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

  const handleDelete = (appUserVehicleId) => {
    VehicleService.handleDelete({
      id: appUserVehicleId
    },).then((res) => {
      if (res) {
        const { statusCode } = res;
        if (statusCode === 200) {
          getData(paramsFilter);
          toast.success(
            intl.formatMessage(
              { id: "actionSuccess" },
              { action: intl.formatMessage({ id: "delete" }) }
            )
          );
        }
      }
    });
  }

  const onUpdateStationEnableUse = (path, data) => {
    VehicleService.handleUpdate(data).then(res => {
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

  const handleFilterDayBHTNDS = (date) =>{
    setFirstPage(!firstPage)
    if(date.length === 0){
      delete paramsFilter.filter.vehicleExpiryDateBHTNDS
      getDataSearch(paramsFilter)
      return
    }
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format("DD/MM/YYYY")
    const newDateBHTNDS = Number(moment(newDateObj).format("YYYYMMDD"))
    setDateBHTNDS(newDate)
    const newParams = {
      ...paramsFilter,
      filter: {
      ...paramsFilter.filter,
        vehicleExpiryDateBHTNDS: newDateBHTNDS
      },
    };
    getDataSearch(newParams);
  }

  const handleFilterDayBHTV = (date) =>{
    setFirstPage(!firstPage)
    if(date.length === 0){
      delete paramsFilter.filter.vehicleExpiryDateBHTV
      getDataSearch(paramsFilter)
      return
    }
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format("DD/MM/YYYY")
    const newDateBHTV = Number(moment(newDateObj).format("YYYYMMDD"))
    setDateBHTV(newDate)
    const newParams = {
      ...paramsFilter,
      filter: {
      ...paramsFilter.filter,
        vehicleExpiryDateBHTV: newDateBHTV
      },
    };
    getDataSearch(newParams);
  }

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    getData(newParams)
  }

  const CustomPaginations = () =>{
    const lengthItem = items.length
    return (
      <BasicTablePaging 
        items={lengthItem}
        firstPage={firstPage}
        handlePaginations={handlePaginations}
        limit={paramsFilter.limit}
      />
    )
  }

  const createRowData = (row) => {
    return {
      "BIỂN SỐ XE": row?.vehicleIdentity,
      "MÀU":getVehiclePlateColor(row?.vehiclePlateColor),
      "LOẠI PHƯƠNG TIỆN": TypeText({ intl, vehicleType: row?.vehicleType }),
      "SỐ QUẢN LÝ": row?.vehicleRegistrationCode,
      "SỐ LOẠI": row?.vehicleBrandName,
      "TÀI KHOẢN": row?.username,
      "TEM GCN": row?.certificateSeries,
      "XÁC THỰC": getAccuracy(row?.vehicleVerifiedInfo),
      "KHÓA ĐẶT LỊCH": +row?.enableBookingStatus === 1 ? "Có " : "Không",
      "NGÀY HẾT HẠN": row?.vehicleExpiryDate
    }
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1">
          <Col className="d-flex mt-sm-0 mt-1" sm="4" lg='3' xs='12'>
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: "Search" })}
                className="dataTable-filter"
                type="search"
                bsSize="md"
                id="search-input"
                value={searchValue}
                onChange={(e) => { 
                  if(e.target.value === ''){
                    getData(DefaultFilter)
                  }
                  setSearchValue(e.target.value) 
                }}
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
          <Col
            className="mb-1"
            sm="4" xs='12' lg='3'
          >
            <BasicAutoCompleteDropdown
              placeholder={intl.formatMessage({ id: "transportation" })}
              name='vehicleType'
              options={vehicleType}
              onChange={({ value }) => {
                handleFilterChange('vehicleType', value);
              }}
            />
          </Col>
          { Authenticated === true ? <Col
            className="mb-1"
            sm="4" xs='12' lg='3'
          >
            <BasicAutoCompleteDropdown
              placeholder={intl.formatMessage({ id: "messageStatus" })}
              name='vehicleVerifiedInfo'
              options={accuraceOptions}
              onChange={({ value }) => {
                handleFilterChange('vehicleVerifiedInfo', value);
              }}
            />
          </Col> : null }
          <Col className="mb-1"
            sm="4" xs='6' lg='3'>
            <Flatpickr
              id='single'
              value={date}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: "true" }}
              placeholder={intl.formatMessage({ id: "registration_deadline" })}
              className='form-control form-control-input font'
              onChange={(date) => {
                // document.getElementById("clear").style.display = 'block'
                handleFilterDay(date)
              }}
            />
          </Col>
          <Col sm='1' xs='2' lg='3' className='mb-1 clear_text' id='clear'>
            <Button.Ripple
              className='form-control-input'
              size="md"
              onClick={() => {
                getDataSearch({
                ...paramsFilter,
                filter: {
                  ...paramsFilter.filter,
                  vehicleExpiryDate: undefined
                },
              })
              setDate('')
              document.getElementById("clear").style.display = 'none'
              }}>X</Button.Ripple>
          </Col>
          <Col className="mb-1"
            sm="4" xs='6' lg='3'>
            <Flatpickr
              id='single'
              value={dateBHTNDS}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: "true" }}
              placeholder={intl.formatMessage({ id: "BHTNDS_dealine" })}
              className='form-control form-control-input font'
              onChange={(date) => {
                // document.getElementById("clear").style.display = 'block'
                handleFilterDayBHTNDS(date)
              }}
            />
          </Col>
          <Col className="mb-1"
            sm="4" xs='6' lg='3'>
            <Flatpickr
              id='single'
              value={dateBHTV}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: "true" }}
              placeholder={intl.formatMessage({ id: "BHTVH_dealine" })}
              className='form-control form-control-input font'
              onChange={(date) => {
                // document.getElementById("clear").style.display = 'block'
                handleFilterDayBHTV(date)
              }}
            />
          </Col>
          <Col className="mb-1"
            sm="4" xs='6' lg='3'>
            <LoadingDialogExportFile
              title={`Xuất file Danh sách phương tiện`}
              createRowData={createRowData}
              filter={paramsFilter}
              linkApi={'AppUserVehicle/find'}
              nameFile={`Danh sách phương tiện`}
            />
          </Col>
        </Row>
        <div id="users-data-table">
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
    </Fragment>
  );
};

export default injectIntl(memo(ListVehicle));
