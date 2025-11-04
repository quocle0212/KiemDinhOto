  // @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import { Calendar } from "react-feather";
import _ from "lodash";
import "./index.scss";
import { useForm } from "react-hook-form";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Service from "../../../services/request";
import ReactPaginate from "react-paginate";
import { ChevronDown, Trash, Edit, Search, ExternalLink } from "react-feather";
import DataTable from "react-data-table-component";
import { useHistory } from 'react-router-dom'
import {
  Card,
  Input,
  Label,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  InputGroup,
  InputGroupButtonDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  FormGroup,
  Form,
} from "reactstrap";
import moment from "moment";
import { injectIntl } from "react-intl";
import MySwitch from '../../components/switch';
import addKeyLocalStorage from "../../../helper/localStorage";
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import DocumentService from '../../../services/documentService'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import BasicTablePaging from '../../components/BasicTablePaging'
import DatePicker from "../../components/datePicker/DatePicker";
import { COLUMNS_WIDTH } from "../../../constants/app";

const statusOptions = [
  { value: "", label: "all" },
  { value: 1, label: "ok" },
  { value: 0, label: "locked" },
];

const DefaultFilter = {
    filter: {
      stationsId : null
    },
    skip: 0,
    limit: 20,
};

const DataTableServerSide = ({ intl }) => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'document-code' }),
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => 
        <a className="text-primary text-table" onClick={() => history.push(`/documentary/form-file/documents/${row?.stationDocumentId}`)}>
          {row.documentCode}
        </a> 
    },
    {
      name: intl.formatMessage({ id: "documentTitle" }),
      selector: row => <div>{row.documentTitle}</div>,
      sortable: true,
      minWidth: COLUMNS_WIDTH.XXXLARGE,
    },
    {
      name: intl.formatMessage({ id: "documentPublishedDay" }),
      selector: "documentPublishedDay",
      center: true,
      maxWidth : "150px",
      minWidth: "150px",
    },
    {
      name: intl.formatMessage({ id: "documentExpireDay" }),
      selector: "documentExpireDay",
      center: true,
      maxWidth : "150px",
      minWidth: "150px",
    },
    {
      name: intl.formatMessage({  id: 'show' }),
      maxWidth: '100px',
      minWidth: "100px",
      center: true,
      cell: (row) => {
        return (
          <MySwitch
            checked={row.isHidden === 0 ? true : false}
            onChange={e => {
              onUpdateStationEnableUse('StationDocument/updateById',{
                id: row.stationDocumentId,
                data: {
                  documentTitle : row.documentTitle,
                  documentCode : row.documentCode,
                  isHidden: e.target.checked ? 0 : 1
                }
              })
            }}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id: "watched" }),
      center: true,
      maxWidth : "100px",
      minWidth: "100px",
      cell : (row) =>{
        const { totalViewedStation, totalCountStation, stationDocumentId} = row
        return (
          <div 
          onClick={() =>{
            handleClick(stationDocumentId)
            setModalone(true)
          }}
          className="click_row">{ totalViewedStation} / {totalCountStation}</div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: "action" }),
      selector: "action",
      maxWidth : "150px",
      minWidth: "150px",
      center: true,
      cell: (row) => {
        const { stationDocumentId } = row;
        return (
          <>
           <div href='/' onClick={e => {e.preventDefault();
                  history.push(`/documentary/form-file/documents/${row?.stationDocumentId}`)
                }}>
                  <Edit className='mr-50 pointer' size={15} />
           </div>
            <div
                className="pointer"
                onClick={() => ModalSwal(stationDocumentId)}
              >
                <Trash className="pointer ml-2" size={15}/>
            </div>
          </>
        );
      },
    },
  ];
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const history = useHistory()
  // ** States
  const [modalone, setModalone] = useState(false);
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
  const [date, setDate] = useState('');
  const [notView, setNotView] = useState([])
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
    Object.keys(newParams.filter).forEach((key) => {
      if (newParams.filter[key]===undefined || newParams.filter[key] === "") {
        delete newParams.filter[key];
      }
    });
    const token = window.localStorage.getItem(addKeyLocalStorage("accessToken"));

    if (token) {
      const newToken = token.replace(/"/g, "");

      DocumentService.getList(newParams, newToken).then((res) => {
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

  const handleFilterDay = (date) =>{
      setFirstPage(!firstPage)
    let newDate 
    if (date) {
      const newDateObj = date.toString()
      newDate = moment(newDateObj).format('DD/MM/YYYY')
    } else {
      newDate = undefined
    }
    setDate(newDate)
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        documentPublishedDay: newDate
      },
      skip: 0
    }
    getDataSearch(newParams)
  }
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
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value,
      },
      skip: 0,
    };
    getData(newParams);
  };

  const handleDelete = (stationDocumentId) =>{
    DocumentService.handleDelete({
      id : stationDocumentId
    }).then((res) => {
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
    DocumentService.handleUpdate(data).then(res => {
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

  const handleClick = (id) =>{
    DocumentService.handleNotView({
      id : id
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;
        if (statusCode === 200) {
          setNotView(data)
        } 
      }
    });
  }

  const MySwal = withReactContent(Swal)
  const ModalSwal = (stationDocumentId) => {
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
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success', handleDelete(stationDocumentId))
      }
    })
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
        firstPage={firstPage}
        items={lengthItem}
        handlePaginations={handlePaginations}
      />
    )
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1">
            <Col sm="4" lg='3' xs='12' className='d-flex mt-sm-0 mt-1'>
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: "Search" })}
                className="dataTable-filter form-control-input"
                type="search"
                bsSize="md"
                id="search-input"
                value={searchValue}
                onChange={(e) => { 
                  
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
            <Col sm="4" xs='12' className='mb-1' lg='3'>
              <DatePicker
                id="single"
                value={date}
                options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: "true" }}
                placeholder={intl.formatMessage({ id: 'documentPublishedDay' })}
                className="form-control form-control-input"
                onChange={(date) => {
                  handleFilterDay(date)
                }}
              />
          </Col>

          <Col  sm='4' xs='6' lg='3' className='mb-1'>
              <Button.Ripple
                color='primary'
                type='button'
                size="md"
                onClick={(e) => {
                  e.preventDefault();
                  history.push(`/documentary/form-file/documents/0`)
                }}
              >
              {intl.formatMessage({ id: "add_new" })}
              </Button.Ripple>
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
      <Modal
      isOpen={modalone}
      toggle={() => setModalone(false)}
      className={`modal-dialog-centered name_text`}
      >
        <ModalHeader>
        {intl.formatMessage({ id: "station_not_seen" })}
        </ModalHeader>
        <ModalBody>
        <Input
                placeholder={intl.formatMessage({ id: "Search" })}
                className="dataTable-filter"
                type="text"
                bsSize="sm"
                id="search"
                onChange={(e) => {
                  const text = e.target.value
                  const search = notView.filter(item =>{
                    return item.slice(0,text.length) === text
                  })
                  setNotView(search)
                }}/>
          <div className="name_text">{notView.map((item, index)=>{
            return (
              <div key={item.index}>
                <p >{item}</p>
              </div>
            )
          })}</div>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default injectIntl(memo(DataTableServerSide));
