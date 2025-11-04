import '@styles/react/libs/flatpickr/flatpickr.scss';
import _ from "lodash";
import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit, Eye, EyeOff, Trash } from "react-feather";
import { injectIntl } from "react-intl";
import { useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import {
    Button,
    Card,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from "reactstrap";
import BasicTablePaging from '../../components/BasicTablePaging';
import "./index.scss";
import HomePageConfig from '../../../services/HomePageConfig';
import { NAVIGATION_TYPE } from '../../../constants/app';
import BasicTextCopy from '../../components/BasicCopyText';



const HomepageServiceItem = ({ intl,configCategory }) => {

    const serverSideColumns = [
        {
            name: intl.formatMessage({ id: "id" }),
            center: true,
            minWidth: "60px",
            maxWidth : '60px',
            cell: (row, index) =>{
                return (
                    <span>{ row?.homePageConfigId }</span>
                )
            }
        },
        {
            name: intl.formatMessage({ id: "image" }),
            center: true,
            minWidth: "120px",
            maxWidth : '120px',
            cell: (row) => {
                const { imageUrl } = row
                return (
                    <>
                        <img
                            loading="lazy"
                            src={imageUrl ? imageUrl : "-"}
                            alt={imageUrl}
                            style={{
                                width: 45,
                                height: 45,
                            }}
                        />
                    </>
                )
            }
        },
        {
            name: intl.formatMessage({ id: "title" }),
            center: true,
            minWidth: "250px",
            maxWidth : '250px',
            cell: (row) => {
                const { title } = row
                return (
                    <div>
                        {title}
                    </div>
                )
            }
        },
        {
            name: intl.formatMessage({ id: 'linkNavigation' }),
            center: true,
            minWidth: "350px",
            maxWidth : '350px',
            cell: (row) => {
                const { linkNavigation } = row
                return (
                    <div className='d-flex text-truncate' style={{alignItems:'center'}}>
                        {linkNavigation && <span><BasicTextCopy value={linkNavigation}/></span>}
                        <div>
                            {linkNavigation}
                        </div>
                    </div>
                )
            }
        },
        {
            name: intl.formatMessage({ id: 'navigationType' }),
            center: true,
            minWidth: "180px",
            maxWidth : '180px',
            cell: (row) => {
                const { navigationType } = row
                let type =Object.values(NAVIGATION_TYPE).find(option => option?.value == navigationType)?.label
                return (
                    <div>
                        {type}
                    </div>
                )
            }
        },
        {
            name: intl.formatMessage({ id: 'display_location' }),
            center: true,
            minWidth: "150px",
            maxWidth : '150px',
            cell: (row) => row?.displayPosition
        },
        {
            name: intl.formatMessage({ id: "action" }),
            selector: "action",
            center: true,
            minWidth: "200px",
            maxWidth : '200px',
            cell: (row) => {
                const { homePageConfigId } = row;
                return (
                    <>
                        <div
                        className="pr-1 w-25"
                        onClick={() =>
                            handleHideConfig({
                            id: homePageConfigId,
                            data: {
                                isHidden: row.isHidden == 0 ? 1 : 0
                            }
                            })
                        }>
                        {row.isHidden === 0 ? <Eye size={16}/> : <EyeOff size={16}/>}
                        </div>
                        <div href='/' onClick={e => {
                            e.preventDefault();
                            history.push("/pages/edit-homepageconfig", row)
                        }}>
                            <Edit className='mr-50 pointer' size={15} />
                        </div>
                        <div onClick={e => {
                            e.preventDefault();
                            setOpenModal(true)
                            setHomePageConfigId(homePageConfigId)
                        }}>
                            <Trash className='mr-50 pointer ml-2' size={15} />
                        </div>
                    </>
                );
            },
        },
    ];

    const history = useHistory()
    const [paramsFilter, setParamsFilter] = useState({
        filter: {
            configCategory:configCategory
        },
        skip: 0,
        limit: 20,
    });
    const [data, setData] = useState([])
    const [total, setTotal] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [homePageConfigId, setHomePageConfigId] = useState(0);
    const [firstPage, setFirstPage] = useState(false)
    
    // Chạy hàm và in kết quả
    const handleHideConfig=(params)=>{
        HomePageConfig.handleUpdateData(params)
        .then((res) => {
            if (res) {
            const { statusCode, data, message } = res;
            if (statusCode === 200) {
                getData(paramsFilter)
                toast.success(intl.formatMessage({ id: 'update_success' }));
            } else {
                toast.warn(intl.formatMessage({ id: 'update_fail' }));
            }
            }
        });
    }
    
    const getData = (params) => {
        HomePageConfig.getList(params).then((res) => {
            if (res) {
                const { statusCode, data, message } = res;
                setParamsFilter(params);
                if (statusCode === 200) {
                    setData(data?.data);
                    setTotal(data?.totalNextPage);
                } else {
                    toast.warn(intl.formatMessage({ id: "connect_error" }));
                }
            } else {
                setTotal(1);
                setData([]);
            }
        });
    }

    const handleDelete = (id) => {
        HomePageConfig.deleteById(id).then((res) => {
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
                <Row className="mx-0 mt-1">
                <Col  sm='4' lg='3' xs='6' className='mb-1'>
                    <Button.Ripple
                    color='primary'
                    type='button'
                    size="md"
                    onClick={(e) => {
                        e.preventDefault();
                        history.push(`/pages/edit-homepageconfig?category=${configCategory}`)
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
                        data={data}
                        progressPending={isLoading}
                    />
                    {CustomPaginations()}
                </div>
            </Card>
            <Modal
                isOpen={openModal}
                toggle={() => setOpenModal(false)}
                className={`modal-dialog-centered `}
                >
                <ModalHeader toggle={() => setOpenModal(false)}>
                    {intl.formatMessage({ id: 'delete' })}
                </ModalHeader>
                <ModalBody>
                    <p>Bạn có chắc chắn muốn xoá ?
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button.Ripple color='primary'
                    size="sm"
                    className="px-2"
                    onClick={() => {
                        setOpenModal(false)
                        handleDelete(homePageConfigId)
                    }}>
                    {intl.formatMessage({ id: 'delete' })}
                    </Button.Ripple>
                </ModalFooter>
                </Modal>
        </Fragment>
    )
}
export default injectIntl(HomepageServiceItem);
