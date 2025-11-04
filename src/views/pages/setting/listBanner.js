import '@styles/react/libs/flatpickr/flatpickr.scss';
import _ from "lodash";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit } from "react-feather";
import { injectIntl } from "react-intl";
import { useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import {
    Card,
    Row
} from "reactstrap";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import addKeyLocalStorage from "../../../helper/localStorage";
import NotificationService from '../../../services/notificationService';
import SystemConfigurationsService from '../../../services/SystemConfigurationsService';
import BasicTablePaging from '../../components/BasicTablePaging';
import "./index.scss";

const DefaultFilter = {
    filter: {
    },
    skip: 0,
    limit: 20,
};

const ListBanner = ({ intl }) => {
    const MySwal = withReactContent(Swal)
    const ModalSwal = (systemNotificationId) =>{
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
                handleDelete(systemNotificationId),
              )
      }})}

    const serverSideColumns = [
        {
            name: intl.formatMessage({ id: "stt" }),
            center: true,
            minWidth: "100px",
            maxWidth : '100px',
            cell: (row, index) =>{
                return (
                    <span>{ index + 1 }</span>
                )
            }
        },
        {
            name: intl.formatMessage({ id: "image" }),
            center: true,
            minWidth: "150px",
            maxWidth : '150px',
            cell: (row) => {
                const { bannerUrl } = row
                return (
                    <>
                    {bannerUrl === null ? <div>-</div> : <a href={bannerUrl ? bannerUrl : "-"} target='_blank' className="text-flow">
                    <img
                        loading="lazy"
                        src={bannerUrl ? bannerUrl : "-"}
                        alt={bannerUrl}
                        style={{
                            width: 45,
                            height: 45,
                          }}
                    />
                </a>}
                    </>
                )
            }
        },
        {
            name: 'Link Banner',
            center: true,
            minWidth: "400px",
            maxWidth : '400px',
            cell: (row) => {
                const { linkBanner } = row
                return (
                    <div>
                        {linkBanner}
                    </div>
                )
            }
        },
        {
            name: intl.formatMessage({ id: "action" }),
            selector: "action",
            center: true,
            minWidth: "200px",
            maxWidth : '200px',
            cell: (row) => {
                const { systemNotificationId } = row;
                return (
                    <>
                        <div href='/' onClick={e => {
                            e.preventDefault();
                            history.push("/pages/update-banner", row)
                        }}>
                            <Edit className='mr-50 pointer' size={15} />
                        </div>
                    </>
                );
            },
        },
    ];

    const history = useHistory()
    const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
    const [data, setData] = useState([])
    const [total, setTotal] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [date, setDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [modal, setModal] = useState(false);
    const [notificationId, setNotificationId] = useState({});
    const [firstPage, setFirstPage] = useState(false)
    
    // Chạy hàm và in kết quả
    const transformedArray = [
        {
            bannerUrl : data.bannerUrl1,
            linkBanner : data.linkBanner1,
            posision : 1
        },
        {
            bannerUrl : data.bannerUrl2,
            linkBanner : data.linkBanner2,
            posision : 2
        },
        {
            bannerUrl : data.bannerUrl3,
            linkBanner : data.linkBanner3,
            posision : 3
        },
        {
            bannerUrl : data.bannerUrl4,
            linkBanner : data.linkBanner4,
            posision : 4
        },
        {
            bannerUrl : data.bannerUrl5,
            linkBanner : data.linkBanner5,
            posision : 5
        }
    ];
    
    const getData = (params, isNoLoading) => {
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
        const token = window.localStorage.getItem(addKeyLocalStorage("accessToken"));

        if (token) {
            const newToken = token.replace(/"/g, "");

            SystemConfigurationsService.getPublicSystemConfigurations(params, newToken).then((res) => {

                if (res) {
                    const { statusCode, data, message } = res;
                    setParamsFilter(newParams);
                    if (statusCode === 200) {
                        setData(data);
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

    const getDataSearch = _.debounce((params) => {
        getData(params, true);
    }, 1000);

    // ** Function to handle filter
    const handleSearch = (e) => {
        setFirstPage(!firstPage)
        const newParams = {
            ...paramsFilter,
            searchText: searchValue || undefined,
            skip: 0
          }
          getData(newParams)
    };

    const handleFilterDay = (date) => {
        setFirstPage(!firstPage)
        const newDateObj = date.toString()
        const newDate = moment(newDateObj).format("DD/MM/YYYY")
        setDate(newDate)
        const newParams = {
            filter: {
            },
            skip: 0,
            limit: 20,
            startDate: newDate,
            endDate : newDate
        };
        getDataSearch(newParams);
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

    const handleDelete = (systemNotificationId) => {
        NotificationService.deleteNotificationById(systemNotificationId).then((res) => {
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

    // ** Get data on mount
    useEffect(() => {
        getData(paramsFilter);
    }, []);

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
            <Card>
                <Row className="mx-0 mt-1 mb-50">
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
                        data={transformedArray}
                        progressPending={isLoading}
                    />
                    {/* {CustomPaginations()} */}
                </div>
            </Card>
        </Fragment>
    )
}
export default injectIntl(ListBanner);
