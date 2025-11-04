import React, { memo, useMemo, useState } from 'react'
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Card,
  CardTitle,
  CardText,
  Button,
  CardBody,
  FormGroup,
  Label,
  Badge,
  Modal, 
  ModalBody, 
  ModalHeader,
  Form,
  Input
} from 'reactstrap'
import { toast } from 'react-toastify'
import './index.scss'
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { ChevronDown, ChevronLeft, Edit, Trash } from 'react-feather'
import { injectIntl } from 'react-intl'
import { useEffect } from 'react'
import StationFunctions from '../../../services/StationFunctions'
import MySwitch from '../../components/switch'
import IntegratedService from '../../../services/Integrated'
import Webhook from './webhook'
import UserService from '../../../services/userService'
import PayOnline from './PayOnline'
import Marketing from './Marketing'
import DataTable from 'react-data-table-component'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { optionServiceType } from '../../../constants/app'
import { set } from 'lodash'
import { useForm } from 'react-hook-form'

const IntegratedEdit = ({ intl }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { register, errors, handleSubmit } = useForm()
  const [items, setItems] = useState([])
  const listServiceType = optionServiceType(intl);
  const [modal, setModal] = useState(false)
  const [detailServiceData, setDetailServiceData] = useState({})
  const [serviceNameValid, setServiceNameValid] = useState(false)
  const [fieldsStatus, setFieldsStatus] = useState({
    serviceName: false,
    servicePrice: false
  })
  const handleOpenEditModal = (data) => {
    setDetailServiceData(data)
    setModal(true)
  }

  const handleDelete = async (stationServicesId) => {
    IntegratedService.handleUpdateDatadeleteById({ id: stationServicesId }).then((res) => {
      if (res.statusCode === 200) {
        getStationServices(stationID)
        toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'delete' }) }))
      } else {
        toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'delete' }) }))
      }
    })
  }

  const MySwal = withReactContent(Swal)
  const ModalSwal = (stationServicesId) => {
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
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success', handleDelete(stationServicesId))
        }
      })
    }

  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'index' }),
      selector: 'stationServicesId',
      sortable: true,
      cell: (row, index) => <span>{index + 1}</span>
    },
    {
      name: intl.formatMessage({ id: 'service_name' }),
      selector: 'serviceName',
      sortable: true,
      minWidth: '300px',
    },
    {
      name: intl.formatMessage({ id: 'category' }),
      selector: 'serviceType',
      sortable: true,
      cell: (row) => {
        let serviceType = listServiceType.find((item) => item.value === row.serviceType)
        return <span>{serviceType?.label}</span>
      }
    },
    {
      name: intl.formatMessage({ id: 'amountAdvance' }),
      selector: 'servicePrice',
      sortable: true,
      cell: (row) => <span>{row.servicePrice===null?intl.formatMessage({id:'no_fee'}):row?.servicePrice}</span>
    },
    {
      name: intl.formatMessage({ id: 'action' }),
      selector: (row) => row.stationsId,
      sortable: true,
      minWidth: '250px',
      maxWidth: '250px',
      cell: (row) => {
        return (
          <div>
            <span
              href="/"
              className="pointer"
              onClick={() => {handleOpenEditModal(row)}}>
              <Edit className="mr-50" size={15} />{' '}
            </span>

            <span className="pointer" onClick={() => ModalSwal(row?.stationServicesId)}>
              <Trash className="pointer ml-2" size={15} />
            </span>
          </div>
        )
      }
    }
  ]
  const CONTENT_TAB = {
    system: {
      name: 'Hệ Thống',
      content: [
        { key: 'enableOperateMenu', value: 0, label: intl.formatMessage({ id: 'operation' }) },
        { key: 'enableCustomerMenu', value: 0, label: intl.formatMessage({ id: 'customer' }) },
        { key: 'enableScheduleMenu', value: 0, label: intl.formatMessage({ id: 'schedule' }) },
        { key: 'enableMarketingMessages', value: 0, label: intl.formatMessage({ id: 'marketing_online' }) },
        { key: 'enableDocumentMenu', value: 0, label: intl.formatMessage({ id: 'documentEnable' }) },
        { key: 'enableDeviceMenu', value: 0, label: intl.formatMessage({ id: 'devices' }) },
        { key: 'enableManagerMenu', value: 0, label: intl.formatMessage({ id: 'management' }) },
        { key: 'enableVehicleRegistrationMenu', value: 0, label: intl.formatMessage({ id: 'vehicleRegistration' }) },
        { key: 'enableContactMenu', value: 0, label: intl.formatMessage({ id: 'phone_book' }) },
        // { key: 'enableChatMenu', value: 0, label: intl.formatMessage({ id: 'chat' }) },
        { key: 'enableNewsMenu', value: 0, label: intl.formatMessage({ id: 'News' }) },
        { key: 'enableInvoiceMenu', value: 0, label: intl.formatMessage({ id: 'Invoice' }) },
        { key: 'enableCameraMenu', value: 0, label: intl.formatMessage({ id: 'Camera' }) },
        { key: 'enableSettingstMenu', value: 0, label: intl.formatMessage({ id: 'Setting' }) },
        { key: 'enableOrderMenu', value: 0, label: intl.formatMessage({ id: 'order' }) },
        { key: 'enableToriChatMenu', value: 0, label: intl.formatMessage({ id: 'torichatAI' }) },
      ]
    },
    //Dich vu update sau
    service: {
      name: 'Dịch vụ',
      content: [
        { key: 'stationEnableUseMomo', value: 0, label: 'Tra cứu phạt nguội' },
        { key: 'stationEnableUseEmail', value: 0, label: 'Dán thẻ VETC' }, 
        { key: 'stationEnableUseVNPAY', value: 0, label: 'Đóng phí phạt nguội' },
        { key: 'stationEnableUseZNS', value: 0, label: 'Gia hạn bảo hiểm TNDS' },
        { key: 'stationEnableUseSMS', value: 0, label: 'Đóng phí VETC' },
        { key: 'stationEnableUseSMS', value: 0, label: 'Gia hạn BH thân vỏ' },
        { key: 'stationEnableUseSMS', value: 0, label: 'Bảo dưỡng, sửa chữa xe cơ giới' },
        { key: 'stationEnableUseSMS', value: 0, label: 'Đăng kiểm xe cơ giới' },
        { key: 'stationEnableUseSMS', value: 0, label: 'Nạp tiền ePass' },
        { key: 'stationEnableUseSMS', value: 0, label: 'Cứu hộ xe bị hư hỏng' },
        { key: 'stationEnableUseSMS', value: 0, label: 'Tư vấn hoán cải' },
        { key: 'stationEnableUseSMS', value: 0, label: 'Tự động thông báo phạt nguội' }
      ]
    },
    more: {
      name: 'Mở rộng',
      content: [
        { key: 'stationEnableUseMomo', value: 0, label: 'Sử dụng Momo' },
        { key: 'stationEnableUseEmail', value: 0, label: 'Sử dụng Email' },
        { key: 'stationEnableUseVNPAY', value: 0, label: 'Sử dụng VNPAY' },
        { key: 'stationEnableUseZNS', value: 0, label: 'Sử dụng ZNS' },
        { key: 'stationEnableUseSMS', value: 0, label: 'Sử dụng SMS' }
      ]
    }
  }
  const [activeTab, setActiveTab] = useState('system')
  const [contentTab, setContentTab] = useState([])
  const [stationServices, setStationServices] = useState([])
  const history = useHistory()
  const params = useParams()
  const stationID = params?.id
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  const getMetaData = async () => {
    await UserService.getMetaData({}).then((result) => {
      const { statusCode, data } = result
      if (result) {
        let newValues = []
        Object.values(data.STATION_SERVICE).map((item) => {
          let values = {
            value: item?.serviceType,
            label: item?.serviceName,
            price: item?.servicePrice
          }
          newValues.push(values)
        })
        CONTENT_TAB.service.content = newValues
        setContentTab(CONTENT_TAB)
        handleGetStationById(stationID)
      }
    }).catch((err) => {
      toast.error(intl.formatMessage({ id: 'error' }))
    }).finally(() => {
      setIsLoading(false)
    })
  }

  const handleUpadateData = async (obj) => {
    const body = {
      id: stationID,
      data: {
        [obj.key]: obj.value
      }
    }
    const res = await IntegratedService.handleUpdateData(body)
    if (res.statusCode === 200) {
      // Tạo một bản sao của state contentTab
      const cloneTabContent = JSON.parse(JSON.stringify(contentTab))

      // Duyệt qua mỗi tab
      Object.keys(cloneTabContent).forEach((tabKey) => {
        // Duyệt qua mỗi mục trong content của tab đó
        cloneTabContent[tabKey].content.forEach((item) => {
          // Kiểm tra xem key của mục có trùng với key được truyền vào không
          if (item.key === obj.key) {
            // Cập nhật giá trị của mục
            item.value = obj.value
          }
        })
      })

      // Cập nhật state mới
      setContentTab(cloneTabContent)
      toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
    } else {
      toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
    }
  }

  const handleSubmitEditService = async (data) => {
    const serviceName = detailServiceData?.serviceName.trim()
    const servicePrice = detailServiceData?.servicePrice === '' ? null : detailServiceData?.servicePrice
    if(servicePrice < 0){
      setFieldsStatus((prevState) => ({...prevState, servicePrice: true}))
      toast.error(intl.formatMessage({ id: 'price_not_negative' }))
      return
    }
    if(serviceName.length === 0){
      setFieldsStatus((prevState) => ({...prevState, serviceName: true}))
      toast.error(intl.formatMessage({ id: 'service_name_required' }))
      return
    }
    const dataEdit = {
      id: detailServiceData?.stationServicesId,
      data:{
        serviceName,
        servicePrice,
        stationsId: detailServiceData?.stationsId,
        serviceType: detailServiceData?.serviceType
      }
    }
    IntegratedService.handleUpdateById(dataEdit).then((res) => {
      if (res.statusCode === 200) {
        getStationServices(stationID)
        toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        setModal(false)
      } else {
        toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
      }
    }).catch((err) => {
      toast.error(intl.formatMessage({ id: 'error' }))
    }).finally(() => {
      setIsLoading(false)
    })
  }

  const handleUpadateDataService = async (checked, obj) => {
    const body = {
      stationsId: stationID,
      serviceType: obj.value,
      serviceName: obj.label
    }

    const paramss = {
      id: obj.stationServicesId
    }

    if (checked === false) {
      const res = await IntegratedService.handleUpdateDatadeleteById(paramss)
      if (res.statusCode === 200) {
        getStationServices(stationID)
        toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
      } else {
        toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
      }
      return
    }

    let res = await IntegratedService.handleUpdateDatainsert(body)
    if (res.statusCode === 200) {
      getStationServices(stationID)
      toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
    } else {
      toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
    }
  }

  const memoizedCountContentWithValueOne = useMemo(() => {
    return () => {
      let res = {}
      Object.keys(contentTab).forEach((tabKey) => {
        const content = contentTab[tabKey].content

        if (tabKey === 'service') {
          res = {
            ...res,
            [tabKey]: stationServices.length
          }
          return res
        }

        let count = 0
        content.forEach((item) => {
          if (item.value === 1) {
            count++
          }
        })
        res = {
          ...res,
          [tabKey]: count
        }
      })

      return res
    }
  }, [contentTab, stationServices])

  const handleGetStationById = async (id) => {
    if (id) {
      const { data } = await StationFunctions.getStaionById({ id })
      // Clone CONTENT_TAB để so sánh và cập nhật
      const cloneTabContent = JSON.parse(JSON.stringify(CONTENT_TAB))

      // Duyệt qua từng tab trong CONTENT_TAB
      Object.keys(cloneTabContent).forEach((tabKey) => {
        const tab = cloneTabContent[tabKey]

        // So sánh từng item trong content của tab với data API
        tab.content = tab.content.map((item) => {
          // Nếu key của item có trong data API thì cập nhật value
          if (data[item.key] !== undefined) {
            return {
              ...item,
              value: data[item.key]
            }
          }
          return item
        })
      })
      // Cập nhật state với dữ liệu đã được so sánh và cập nhật
      setContentTab(cloneTabContent)
    }
  }

  const getStationServices = async (id) => {
    const newParam = {
      filter: {
        stationsId: id
      },
      skip: 0,
      limit: 100
    }
    if (id) {
      const { data } = await StationFunctions.getStationServices(newParam)
      setStationServices(data.data)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    getStationServices(stationID)
    getMetaData()
  }, [stationID])

  const renderTabContent = () => {
    return Object.keys(contentTab).map((key, index) => {
      const tab = contentTab[key]
      if (tab.name === 'Dịch vụ') {
        return (
          <TabPane key={index} tabId={key}>
            <Card>
              <CardBody>
                {/* <Row>
                  {tab.content.map((content, appIndex) => {
                    for (let i = 0; i < stationServices.length; i++) {
                      if (stationServices[i].serviceName === content.label) {
                        content.stationServicesId = stationServices[i].stationServicesId
                      }
                    }
                    // The below code is to check if any service in stationServices matches with contentTab and then check the switch
                    // Kiểm tra xem có dịch vụ nào trong stationServices khớp với contentTab không
                    const isChecked = key === 'service' && stationServices?.some((service) => service.serviceType === content.value)
                    return (
                      <Col sm="2" key={appIndex}> ==> replace with the new table template
                        <FormGroup>
                          <Label className="pr-2" for="isEnable">
                            {content.label}
                          </Label>
                          <div className="d-block">
                            <MySwitch
                              name={content.key}
                              checked={isChecked}
                              onChange={(e) => {
                                handleUpadateDataService(e.target.checked, content)
                              }}
                            />
                          </div>
                        </FormGroup>
                      </Col>
                    )
                  })}
                </Row> */}
                <>
                  <div id="users-data-table">
                    <DataTable
                      noHeader
                      // pagination
                      paginationServer
                      className="react-dataTable"
                      columns={serverSideColumns}
                      sortIcon={<ChevronDown size={10} />}
                      // paginationComponent={CustomPagination}
                      data={stationServices || []}
                      progressPending={isLoading}
                    />
                  </div>
                </>
              </CardBody>
            </Card>
          </TabPane>
        )
      }
      return (
        <TabPane key={index} tabId={key}>
          <Card>
            <CardBody>
              <Row>
                {tab.content.map((content, appIndex) => (
                  <Col sm="2" key={appIndex}>
                    <FormGroup>
                      <Label className="pr-2" for="isEnable">
                        {content.label}
                      </Label>
                      <div className="d-block">
                        <MySwitch
                          name={content.key}
                          checked={content.value}
                          onChange={(e) => {
                            handleUpadateData({
                              key: content.key,
                              value: e.target.checked ? 1 : 0
                            })
                          }}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        </TabPane>
      )
    })
  }

  return (
    <div className="expand-setting">
      <div className="pointer mb-1" onClick={history.goBack}>
        <ChevronLeft />
        {intl.formatMessage({ id: 'goBack' })}
      </div>
      <Nav tabs>
        {Object.keys(contentTab).map((key, index) => (
          <NavItem key={index}>
            <NavLink className={activeTab === key ? 'active' : ''} onClick={() => toggleTab(key)}>
              {contentTab[key].name}
              <Badge className="ml-2" color="primary">
                {memoizedCountContentWithValueOne()[key]}{' '}
              </Badge>
            </NavLink>
          </NavItem>
        ))}
        <NavItem>
          <NavLink className={activeTab == '3' ? 'active' : ''} onClick={() => setActiveTab('3')}>
            Webhooks
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab == '4' ? 'active' : ''} onClick={() => setActiveTab('4')}>
           {intl.formatMessage({ id: "pay_olnine" })}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab == '5' ? 'active' : ''} onClick={() => setActiveTab('5')}>
           {intl.formatMessage({ id: "message_SMS" })}
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        {renderTabContent()}
        <TabPane tabId="3">
          <Webhook />
        </TabPane>
        <TabPane tabId="4">
          <PayOnline />
        </TabPane>
        <TabPane tabId="5">
          <Marketing />
        </TabPane>
      </TabContent>
      <Modal isOpen={modal} toggle={() => setModal(false)} className={`modal-dialog-centered `}>
        <ModalHeader toggle={() => setModal(false)}>{intl.formatMessage({ id: 'information' })}</ModalHeader>
        <ModalBody>
          <Form
          initi
          onSubmit={handleSubmit(handleSubmitEditService)}>
            <FormGroup>
              <Label for="serviceName">{intl.formatMessage({ id: 'service_name' })}</Label>
              <Input
                invalid={fieldsStatus.serviceName}
                type="text"
                id="serviceName"
                name="serviceName"
                innerRef={register()}
                value={detailServiceData?.serviceName}
                onChange={(e) => {
                  setDetailServiceData((prevState) => ({...prevState, serviceName: e.target.value}))
                  setFieldsStatus((prevState) => ({...prevState, serviceName: false}))
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="servicePrice">{intl.formatMessage({ id: 'amountAdvance' })}</Label>
              <Input
                type="number"
                invalid={fieldsStatus.servicePrice}
                id="servicePrice"
                name="servicePrice"
                value={detailServiceData?.servicePrice}
                onChange={(e) => {
                  setDetailServiceData((prevState) => ({...prevState, servicePrice: e.target.value}))
                  setFieldsStatus((prevState) => ({...prevState, servicePrice: false}))
                }}
              />
            </FormGroup>
            <FormGroup className="d-flex mb-0">
              <Button.Ripple className="mr-1" color="primary" type="submit">
                {intl.formatMessage({ id: 'submit' })}
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default injectIntl(memo(IntegratedEdit))
