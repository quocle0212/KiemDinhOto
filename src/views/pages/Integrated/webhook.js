import '@styles/react/libs/tables/react-dataTable-component.scss'
import React, { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Search, Trash } from 'react-feather'
import { injectIntl } from "react-intl"
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Badge, Button, Card, Col, Form, FormGroup, Input, InputGroup, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import addKeyLocalStorage, { APP_USER_DATA_KEY } from '../../../helper/localStorage'
import IntegratedService from '../../../services/Integrated'
import StationFunctions from '../../../services/StationFunctions'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicTablePaging from '../../components/BasicTablePaging'
import { STATUS_OPTIONS } from './../../../constants/app'
import "./index.scss";
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import Select from 'react-select';
import { selectThemeColors } from '@utils';
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'

const Webhook = ({intl}) =>{
    const params = useParams()
    const stationID = params?.id
    const DefaultFilter = {
      filter: {
        stationsId: stationID,
      },
      searchText:'test',
      skip: 0,
      limit: 20
    }
    const [currentPage, setCurrentPage] = useState(1)
    const [modal, setModal] = useState(false)
    const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [editData, setEditData] = useState([])
    const [firstPage, setFirstPage] = useState(false)

    const MySwal = withReactContent(Swal)
    const ModalSwal = (stationDevicesId) => {
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
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success', onDeleteDevice(stationDevicesId))
        }
      })
    }
    const typeOptions = [
      {
        value:1,
        label: 'Thông báo lịch hẹn'
      },
      {
        value:2,
        label: 'Thông báo hạn đăng kiểm'
      },
      {
        value:3,
        label: 'Thông báo phạt nguội'
      },
    ]
    const onDeleteDevice = (id) => {
      IntegratedService.handleDeleteWebhook(id).then((result) => {
        const { statusCode } = result
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
      });
    };
    const history = useHistory()
    const onUpdateWebhook = (data) => {
     const dataUpdate = {
      id: data.stationWebHooksId,
      data : {
        webhookType:data?.webhookType,
        webhookUrl:data?.webhookUrl,
      }
     }
     const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
      if (token) {
        const newToken = token.replace(/"/g, '')
     IntegratedService.handleUpdateWebhook(dataUpdate,newToken).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          const newParams = {
            ...paramsFilter,
            skip: (currentPage - 1) * paramsFilter.limit
          }
          getData(newParams)
          setModal(false)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
        }
      }
    })
  }
    }
    const columns = [
      {
        name: intl.formatMessage({ id: 'index' }),
        minWidth: '70px',
        maxWidth: '70px',
        center: true,
        selector: row => row.stationCode,
        cell: (row,index) => {
          return (
            <div className='d-flex justify-content-center aligns-items-center'>
              {paramsFilter.limit*(currentPage-1) + index + 1}
            </div>
          )
        },
      },
      {
        name: intl.formatMessage({ id: 'link' }),
        minWidth: '450px',
        maxWidth: '450px',
        selector: row => row.stationsName,
        cell: (row) => row?.webhookUrl
      },
      {
        name: intl.formatMessage({ id: 'chain_type' }),
        selector: row => row.stationsId,
        sortable: true,
        minWidth: '250px',
        maxWidth: '250px',
        cell: (row) => typeOptions.find(item=>item?.value == row?.webhookType)?.label
      },
      {
        name: "Trạng thái",
        minWidth: '180px',
        center: true,
        maxWidth: '180px',
        cell:(row) => row?.webhookStatus == 1 ? intl.formatMessage({id:'active'}) : intl.formatMessage({id:'isWrong'})
      },
    
      {
        name: intl.formatMessage({ id: 'action' }),
        selector: 'action',
        center:true,
        minWidth: "180px",
        maxWidth: '180px',
        cell: (row) => {
          const { stationWebHooksId } = row
          return(
            <>
              <div href='/' onClick={e => {
                e.preventDefault();
                setModal(true)
                setEditData(row)
              }}>
                <Edit className='mr-50 pointer' size={15} />
              </div>
              <div href='/' onClick={e => {
                e.preventDefault();
                ModalSwal({
                  id: stationWebHooksId,
                })
              }}>
                <Trash className='mr-50 pointer ml-2' size={15} />
              </div>
            </>
          )
        }
      },
    ]

    const handlePaginations = (page) => {
      const newParams = {
        ...paramsFilter,
        skip: (page - 1) * paramsFilter.limit
      }
      if(page === 1){
        getData(paramsFilter)
        return null
      }
      getData(newParams)
      setCurrentPage(page + 1)
    }

    function getData(params){
      const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
      if (token) {
        const newToken = token.replace(/"/g, '')
        IntegratedService.getListWebhook(params, newToken).then((res) => {
          if (res) {
            const { statusCode, data, message } = res
            if (statusCode === 200) {
              setItems(data.data)
            } else {
              toast.warn(intl.formatMessage({ id: 'actionFailed' }))
            }
          } else {
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
    const handleOnchange = (name, value) => {
      setEditData({
        ...editData,
        [name]: value,
      });
    };
  return (
    <Fragment>
      <Card>
        <div className='mx-0 mb-50 p-1'>
          <DataTable
            noHeader
            paginationServer
            className='react-dataTable'
            columns= {columns}
            sortIcon={<ChevronDown size={10} />}
            data={items}
            progressPending={isLoading}
          />
          {CustomPaginations()}
        </div>
      </Card>
      <Modal
        isOpen={modal}
        toggle={() => {setModal(false)}}
        className={`modal-dialog-centered `}
      >
        <ModalHeader toggle={() => setModal(false)}>
            {intl.formatMessage({id: "edit"})} webhook
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for='link'>
                {intl.formatMessage({id: "link"})}<span className='text-danger'>*</span>
              </Label>
              <Input
                required
                id='link'
                name='webhookUrl'
                placeholder='link'
                defaultValue={editData?.webhookUrl}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='type'>
                {intl.formatMessage({id: "chain_type"})}<span className='text-danger'>*</span>
              </Label>
              <BasicAutoCompleteDropdown
                id="type"
                name="webhookType"
                required
                onChange={({value}) => {
                  handleOnchange('webhookType', value);
                }} 
                placeholder={intl.formatMessage({ id: "Area" })}
                options={typeOptions}
                value = {
                  typeOptions.filter(option => 
                    option.value == editData?.webhookType) || typeOptions[1]?.value
                }
              />
            </FormGroup>
            <FormGroup className='d-flex mb-0'>
              <Button.Ripple className='mr-1' color='primary' onClick={()=>onUpdateWebhook(editData)}>
                {intl.formatMessage({id: "submit"})}
            </Button.Ripple>

            </FormGroup>
          </Form>
        </ModalBody>

      </Modal>
    </Fragment>
  )
}

export default injectIntl(memo(Webhook)) 
