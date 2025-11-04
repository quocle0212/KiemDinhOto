import React, { Fragment, useState, useEffect, useRef, use, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { ChevronLeft, Loader, Plus } from 'react-feather'
import { injectIntl } from 'react-intl'
import {
  Button,
  Card,
  Col,
  Input,
  Label,
  Row,
  FormGroup,
  FormFeedback,
  Toast,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardBody
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import OrderRequest from '../../../services/order'
import { toast } from 'react-toastify'
import {
  ORDER_ITEM_STATUS,
  VEHICLE_PURPOSE_USING,
  INSURTANCE_CAR_TYPES,
  VEHICLE_SUB_CATEGORY_BHOT,
  VEHICLE_SUB_TYPE_LABEL,
  INSURTANCE_STATUS_REF,
  VEHICLE_SUB_TYPE
} from '../../../constants/app'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import './index.scss'
import {
  validatePhoneNumber,
  validateEmail,
  validateVehicleIdentity,
  validateYearManufacture,
  validateLoadCapacity
} from '../../../helper/validatorFunc'
import { convertFileToBase64 } from '../../../helper/common'
import NewsService from '../../../services/news'
import ProductService from '../../../services/products'
import { formatDateDDMMYYYY } from '../../../utility/Utils'
import { splitNotes } from '../order/orderDetail'

export const TRANSPORT_TYPES = [
  { value: 1, label: 'Xe cứu thương' },
  { value: 2, label: 'Xe chở tiền' }
]

const MotorbikeInsuranceOrder = ({ intl }) => {
  const history = useHistory()
  const location = useLocation()
  const inputFileRef = useRef(null)
  const [file, setFile] = useState()
  const [isDragEnter, setIsDragEnter] = useState(false)
  const data = location.state
  const [detail, setDetail] = useState({})
  const [start, setStart] = useState()
  const [end, setEnd] = useState()
  const [firstName, setFirstName] = useState()
  const [phoneNumber, setPhoneNumber] = useState()
  const [userHomeAddress, setUserHomeAddress] = useState()
  const [vehicleIdentity, setVehicleIdentity] = useState()
  const [chassisNumber, setChassisNumber] = useState()
  const [engineNumber, setEngineNumber] = useState()
  const [vehicleForBusiness, setVehicleForBusiness] = useState()
  const [vehicleSubType, setVehicleSubType] = useState()
  const [vehicleSeatsLimit, setVehicleSeatsLimit] = useState()
  const [email, setEmail] = useState()
  const [vehicleBrandName, setVehicleBrandName] = useState()
  const [yearManufacture, setYearManufacture] = useState()
  const [isContractExported, setIsContractExported] = useState(false)
  const [insurance, setInsurance] = useState({})
  const [specialTransport, setSpecialTransport] = useState()
  const [vehicleTotalWeight, setVehicleTotalWeight] = useState(0)
  const [isPracticedCar, setIsPracticedCar] = useState()
  const [isTaxi, setIsTaxi] = useState()
  const [appUserIdentity, setAppUserIdentity] = useState()
  const [vehicleRegistrationImage, setVehicleRegistrationImage] = useState()
  const [listInsurence, setListInsurence] = useState([])
  const [filterForListInsurence, setFilterForListInsurence] = useState({})
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [dataNeedToChangeStartDate, setDataNeedToChangeStartDate] = useState({
    startDate: '',
    isExportedContract: false,
    isOpenFirstTime: false
  })
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    vehicleIdentity: '',
    vehicleTotalWeight: 0
  })
  const [formErrors, setFormErrors] = useState({
    plateNumber: '',
    email: '',
    phoneNumber: '',
    vehicleTotalWeight: ''
  })
  const [appUserCategory, setAppUserCategory] = useState(undefined)
  
  const optionsInsuranceDuration = [
    {
      value: 1,
      label: '1 năm'
    },
    {
      value: 2,
      label: '2 năm'
    },
    {
      value: 3,
      label: '3 năm'
    }
  ]

  const handleLoadCapacityChange = (value) => {
    setVehicleTotalWeight(value)
    handleInputChange('vehicleTotalWeight')(value)
    validateLoadCapacity(value)
      .then(() => {
        handleInputErrorChange('vehicleTotalWeight')('')
      })
      .catch((error) => {
        handleInputErrorChange('vehicleTotalWeight')(error)
      })
  }

  const handleInputChange = (field) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }
  const handleInputErrorChange = (field) => (error) => {
    setFormErrors((prev) => ({
      ...prev,
      [field]: error
    }))
  }
  const handlePlateNumberChange = (value) => {
    setVehicleIdentity(value)
    handleInputChange('vehicleIdentity')(value)
    validateVehicleIdentity(value)
      .then(() => {
        handleInputErrorChange('plateNumber')('')
      })
      .catch((error) => {
        handleInputErrorChange('plateNumber')(error)
      })
  }
  const handleEmailChange = (value) => {
    setEmail(value)
    handleInputChange('email')(value)
    validateEmail(value)
      .then(() => {
        handleInputErrorChange('email')('')
      })
      .catch((error) => {
        handleInputErrorChange('email')(error)
      })
  }

  const handleChangeYearManufacture = (value) => {
    setYearManufacture(value)
    handleInputChange('yearManufacture')(value)
    validateYearManufacture(value)
      .then(() => {
        handleInputErrorChange('yearManufacture')('')
      })
      .catch((error) => {
        handleInputErrorChange('yearManufacture')(error)
      })
  }
  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value)
    handleInputChange('phoneNumber')(value)
    validatePhoneNumber(value)
      .then(() => {
        handleInputErrorChange('phoneNumber')('')
      })
      .catch((error) => {
        handleInputErrorChange('phoneNumber')(error)
      })
  }

  const onFileChange = (e) => {
    const newFile = e.target.files[0]
    if (newFile) {
      if (!newFile.type.match('image.*')) {
      } else {
        inputFileRef.current && (inputFileRef.current.value = null)
        setFile(newFile)
      }
    }
  }

  const [productId, setProductId] = useState(data?.productId || '')
  const [orderItemFileName, setOrderItemFileName] = useState('')
  const [linkToOrderFile, setLinkToOrderFile] = useState('')
  const [insuranceDuration, setInsuranceDuration] = useState(1)
  let interval

  const [isExporting, setIsExporting] = useState(false)
  const getListById = async (params) => {
    const res = await OrderRequest.findByIdOrderItem(params)
    if (res.data?.orderItemVehicle) {
      const orderItemVehicle = JSON.parse(res.data?.orderItemVehicle)
      const dataParams = {
        productCategory: data?.productCategory,
        productType: res.data?.productType,
        isTaxi: orderItemVehicle?.isTaxi,
        isPracticedCar: orderItemVehicle?.isPracticedCar,
        vehicleType: orderItemVehicle?.vehicleType,
        vehicleSubType: orderItemVehicle?.vehicleSubType,
        usagePurposeType: 0,
        vehicleTotalWeight: orderItemVehicle?.vehicleTotalWeight === '' ? 0 : orderItemVehicle?.vehicleTotalWeight,
        specialTransport: orderItemVehicle?.specialTransport === '' ? 0 : orderItemVehicle?.specialTransport,
        vehicleSubCategory: orderItemVehicle?.vehicleSubCategory,
        vehicleSeatsLimit: orderItemVehicle?.vehicleSeatsLimit === '' ? 0 : orderItemVehicle?.vehicleSeatsLimit,
        vehicleForBusiness: orderItemVehicle?.vehicleForBusiness
      }
      setFilterForListInsurence({ filter: dataParams })
    }
    setDetail(res.data)
    setStart(JSON.parse(res.data?.orderItemOtherData)?.insuranceStartDate)
    setDataNeedToChangeStartDate((prev) => ({
      ...prev,
      startDate: JSON.parse(res.data?.orderItemOtherData)?.insuranceStartDate
    }))
    setEnd(JSON.parse(res.data?.orderItemOtherData)?.insuranceEndDate)
    const dataRaw = JSON.parse(res.data?.orderItemOtherData)
    const defaultInsuranceDuration = moment(dataRaw?.insuranceEndDate, 'DD/MM/YYYY')
      .add(1, 'day')
      .diff(moment(dataRaw?.insuranceStartDate, 'DD/MM/YYYY'), 'years')
    setInsuranceDuration(JSON.parse(res.data?.orderItemOtherData)?.insuranceDuration || defaultInsuranceDuration)
    setFirstName(JSON.parse(res.data?.orderItemUser)?.firstName || '')
    setPhoneNumber(JSON.parse(res.data?.orderItemUser)?.phoneNumber || '')
    setUserHomeAddress(JSON.parse(res.data?.orderItemUser)?.userHomeAddress || '')
    setVehicleIdentity(JSON.parse(res.data?.orderItemVehicle)?.vehicleIdentity || '')
    setChassisNumber(JSON.parse(res.data?.orderItemVehicle)?.chassisNumber || '')
    setEngineNumber(JSON.parse(res.data?.orderItemVehicle)?.engineNumber || '')
    setVehicleForBusiness(JSON.parse(res.data?.orderItemVehicle)?.vehicleForBusiness)
    setVehicleSubType(JSON.parse(res.data?.orderItemVehicle)?.vehicleSubType || '')
    setVehicleSeatsLimit(JSON.parse(res.data?.orderItemVehicle)?.vehicleSeatsLimit || '')
    setEmail(JSON.parse(res.data?.orderItemUser)?.email || '')
    setVehicleBrandName(JSON.parse(res.data?.orderItemVehicle)?.vehicleBrandName || '')
    setYearManufacture(JSON.parse(res.data?.orderItemVehicle)?.yearManufacture || '')
    setProductId(res.data?.productId || '')
    setSpecialTransport(JSON.parse(res.data?.orderItemVehicle)?.specialTransport || '')
    setVehicleTotalWeight(JSON.parse(res.data?.orderItemVehicle)?.vehicleTotalWeight || '')
    setIsPracticedCar(JSON.parse(res.data?.orderItemVehicle)?.isPracticedCar)
    setIsTaxi(JSON.parse(res.data?.orderItemVehicle)?.isTaxi)
    setAppUserIdentity(JSON.parse(res.data?.orderItemUser)?.appUserIdentity || '')
    setVehicleRegistrationImage(JSON.parse(res.data?.orderItemVehicle)?.vehicleRegistrationImage || '')
    setAppUserCategory(JSON.parse(res.data?.orderItemUser)?.appUserCategory || '')
  }

  useEffect(() => {
    getListById({ id: data.orderItemId })
    AppUserInsuranceFind()
  }, [])

  const isFormValid = () => {
    if (data.productCategory === 6) {
      // 6 là xe máy
      return firstName && phoneNumber && userHomeAddress && vehicleIdentity && chassisNumber && engineNumber && email && start && end
    }

    const baseValidation =
      firstName &&
      phoneNumber &&
      userHomeAddress &&
      vehicleIdentity &&
      chassisNumber &&
      engineNumber &&
      email &&
      vehicleBrandName &&
      start &&
      end &&
      yearManufacture &&
      appUserIdentity

    if (vehicleSubType === 12) {
      // Xe chở hàng
      return baseValidation && vehicleTotalWeight && !formErrors.vehicleTotalWeight
    }

    if (vehicleSubType === 10) {
      // Xe chuyên dụng
      return baseValidation && specialTransport
    }

    return baseValidation
  }

  const handleResetFieldsThatEffectToPrice = () => {
    setSpecialTransport(0)
    setIsPracticedCar(0)
    setIsTaxi(0)
  }

  const isFormValidUpdate = () => {
    const errors = []
    const errorMessages = []
    if (data.productCategory !== 6) {
      // 6 là xe máy
      if (!vehicleBrandName) {
        errors.push('vehicleBrandName')
        errorMessages.push('Nhãn hiệu')
      }
      if (!yearManufacture) {
        errors.push('yearManufacture')
        errorMessages.push('Năm sản xuất')
      }
      if (vehicleSubType === 12 && (!vehicleTotalWeight || formErrors.vehicleTotalWeight)) {
        errors.push('vehicleTotalWeight')
        errorMessages.push('trọng tải')
      }
      if (vehicleSubType === 10 && !specialTransport) {
        errors.push('specialTransport')
        errorMessages.push('loại vận chuyển')
      }
      if (!appUserIdentity) {
        errors.push('appUserIdentity')
        errorMessages.push('CCCD/CMT')
      }
    }
    if (!start) {
      errors.push('start')
      errorMessages.push('Ngày bắt đầu')
    }
    if (!insuranceDuration) {
      errors.push('insuranceDuration')
      errorMessages.push('thời gian bảo hiểm')
    }
    if (!chassisNumber) {
      errors.push('chassisNumber')
      errorMessages.push('số khung xe')
    }
    if (!productId) {
      errors.push('productId')
      errorMessages.push('tên bảo hiểm')
    }
    if (!engineNumber) {
      errors.push('engineNumber')
      errorMessages.push('số máy')
    }
    if (!firstName) {
      errors.push('firstName')
      errorMessages.push('họ tên')
    }
    if (!userHomeAddress) {
      errors.push('userHomeAddress')
      errorMessages.push('địa chỉ')
    }
    if (!phoneNumber || formErrors.phoneNumber) {
      errors.push('phoneNumber')
      errorMessages.push('số điện thoại')
    }
    if (!vehicleIdentity || formErrors.plateNumber) {
      errors.push('vehicleIdentity')
      errorMessages.push('biển số xe')
    }
    if (!email || formErrors.email) {
      errors.push('email')
      errorMessages.push('email')
    }
    if (!vehicleSubType) {
      errors.push('vehicleSubType')
      errorMessages.push('loại phương tiện')
    }
    return {
      isValid: errors.length === 0,
      errorMessages
    }
  }
  // Lấy danh sách các nhà bảo hiểm
  const getInsurenceList = async (data) => {
    try {
      ProductService.GetListInsurences({ ...data })
        .then((res) => {
          setListInsurence(res?.data || [])
          const isOld = (res?.data || [])?.find((item) => +item?.productId === +productId)
          if (!isOld) {
            setProductId((res?.data || [])?.[0]?.productId)
          }
        })
        .catch((err) => {
          setListInsurence([])
          Toast.error('Có lỗi xảy ra trong quá trình lấy danh sách bảo hiểm')
        })
    } catch (error) {
      Toast.error('Có lỗi xảy ra trong quá trình lấy danh sách bảo hiểm')
    }

    //   {Object.values(insurenceList)?.map(item =>(<div onClick={()=>handleChooseInsurance(item)} className={`insurance-item ${supplier[item?.productId] === supplierSelected  ? 'supplierActiveCheck':''}`}>
    //                 <img width={45} src={item?.productImages} alt="" />
    //                 <div>
    //                   <div>
    //                     {item?.productName}
    //                   </div>
    //                   <div className='text-small text-primary'>
    //                     {number_to_price(item?.productPrice)}đ
    //                   </div>
    //                 </div>
    //                 {supplier[item?.productId] === supplierSelected ? <div className='supplierCheck'><CheckCircle></CheckCircle></div> :''}
    //               </div>
    //             ))}
  }

  useEffect(() => {
    if (filterForListInsurence && vehicleSubType) {
      filterForListInsurence.filter.vehicleSubType = vehicleSubType
      getInsurenceList(filterForListInsurence)
    }
  }, [filterForListInsurence, vehicleSubType, vehicleSeatsLimit, isTaxi, vehicleForBusiness])

  useEffect(() => {
    if (
      dataNeedToChangeStartDate.startDate &&
      moment(dataNeedToChangeStartDate.startDate, 'DD/MM/YYYY').isBefore(moment(), 'day') &&
      !dataNeedToChangeStartDate.isExportedContract &&
      !dataNeedToChangeStartDate.isOpenFirstTime
    ) {
      // // Nếu có ngày bắt đầu và đã xuất hợp đồng
      // const validStartDate = getValidDate(dataNeedToChangeStartDate.startDate)
      // setStart(validStartDate)
      // const endDate = moment(validStartDate, 'DD/MM/YYYY').add(1, 'year').subtract(1, 'day')
      // setEnd(endDate.format('DD/MM/YYYY'))
      setDataNeedToChangeStartDate((prev) => ({
        ...prev,
        isOpenFirstTime: true
      }))
      setIsOpenModal(true)
    }
  }, [dataNeedToChangeStartDate])

  const handleConfirmModal = async () => {
    const validStartDate = getValidDate(dataNeedToChangeStartDate.startDate)
    const endDate = moment(validStartDate, 'DD/MM/YYYY').add(1, 'year').subtract(1, 'day')
    setStart(validStartDate)
    setEnd(endDate.format('DD/MM/YYYY'))
    setIsOpenModal(false)

    // Gọi update và truyền trực tiếp
    await handleUpdate(validStartDate, endDate.format('DD/MM/YYYY'))
  }

  const handleUpdate = async (startDate = start, endDate = end) => {
    const { isValid, errorMessages } = isFormValidUpdate()
    if (!isValid) {
      toast.error(`Vui lòng nhập ${errorMessages.join(', ')}`)
      return
    }

    let fileImage = null
    if (file) {
      fileImage = await handlePostNews(file)
    }

    const valueVehicle = {
      ...JSON.parse(data.orderItemVehicle),
      vehicleIdentity,
      chassisNumber,
      engineNumber,
      vehicleBrandName,
      vehicleForBusiness,
      yearManufacture,
      vehicleSubType,
      vehicleSubCategory: handleCategory(vehicleSubType, vehicleSeatsLimit),
      vehicleSeatsLimit,
      specialTransport,
      vehicleTotalWeight,
      isPracticedCar,
      isTaxi,
      vehicleRegistrationImage: fileImage?.data
    }

    const valueUser = {
      ...JSON.parse(data.orderItemUser),
      firstName,
      phoneNumber,
      userHomeAddress,
      email,
      appUserIdentity
    }

    const valueData = {
      ...JSON.parse(data.orderItemOtherData),
      insuranceStartDate: startDate || start,
      insuranceEndDate: endDate || end,
      insuranceDuration: data.productCategory === 6 ? insuranceDuration : undefined
    }
    if (moment(startDate, 'DD/MM/YYYY').isBefore(moment(), 'day')) {
      toast.error('Ngày bắt đầu phải từ hôm nay')
      return
    }

    const params = {
      id: data.orderItemId,
      data: {
        orderItemVehicle: JSON.stringify(valueVehicle),
        orderItemUser: JSON.stringify(valueUser),
        orderItemOtherData: JSON.stringify(valueData),
        productId: productId,
        orderItemName: listInsurence?.find((item) => String(item.productId) === String(productId))?.productName
      }
    }

    const res = await OrderRequest.updateOrderItem(params)
    if (res) {
      const { statusCode } = res
      if (statusCode === 200) {
        AppUserInsuranceFind()
        getListById({ id: data.orderItemId })
        toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
      } else {
        toast.error(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
      }
    }
  }

  const handleExport = () => {
    if (isExporting) {
      return
    }
    setIsExporting(true)
    OrderRequest.exportInsuranceContract({
      id: data.orderItemId
    })
      .then((res) => {
        setIsExporting(false)
        if (res) {
          const { statusCode, error, data: exportData } = res
          if (statusCode === 200) {
            setIsContractExported(true)
            AppUserInsuranceFind()
            getListById({ id: data.orderItemId })
            toast.success('Xuất file thành công')
            if (exportData?.contractData?.paymentLinkUrl) {
              window.open(exportData?.contractData?.paymentLinkUrl, '_blank')
            }
          } else {
            if (error === 'CREATE_PARTNER_INSURANCE_FAILED') {
              toast.error('Tạo hợp đồng bảo hiểm phía đối tác thất bại')
              return
            }
            toast.error('Xuất file thất bại')
          }
        }
      })
      .catch(() => {
        setIsExporting(false)
        toast.error('Có lỗi xảy ra trong quá trình xuất hợp đồng')
      })
  }

  const handleSend = () => {
    OrderRequest.sendContractToZalo({
      id: insurance?.appUserInsurranceId
    }).then((res) => {
      if (res) {
        const { statusCode, error } = res
        if (statusCode === 200) {
          toast.success('Gửi thành công')
        } else {
          toast.error('Gửi thất bại')
        }
      }
    })
  }

  const handleDownload = () => {
    OrderRequest.AppUserInsuranceFind({
      filter: {
        orderId: data.orderId,
        orderItemId: data.orderItemId
      }
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          window.open(data.data[0]?.coiUrl, '_blank')
          toast.success('Tải thành công')
        } else {
          toast.error('Tải thất bại')
        }
      }
    })
  }

  const AppUserInsuranceFind = () => {
    OrderRequest.AppUserInsuranceFind({
      filter: {
        orderId: data.orderId,
        orderItemId: data.orderItemId
      }
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          const fileName = getOrderFileName(data.data[0]?.coiUrl)
          setIsContractExported(data?.data[0]?.insuranceStatusRef === INSURTANCE_STATUS_REF.SUCCESS.value)
          setInsurance(data.data[0])
          setDataNeedToChangeStartDate((prev) => ({
            ...prev,
            isExportedContract: data.data[0]?.insuranceRefStatus === 'success' ? true : false
          }))
          setOrderItemFileName(fileName)

          if (data.data[0]?.coiUrl !== null) {
            setLinkToOrderFile(data.data[0]?.coiUrl)
            clearInterval(interval)
          } else setLinkToOrderFile('')
          // toast.success('Tải thành công')
        } else {
          // toast.error('Tải thất bại')
        }
      }
    })
  }

  const handleReturnObjectOption = (value) => {
    const newObj = INSURTANCE_CAR_TYPES.find((el) => el.value === value)
    if (value === 12) {
      // Xe chở hàng
      return [1, 2, 3].map((item) => ({ value: item, label: item }))
    }
    if (value === 10) {
      // Xe chuyên dụng
      return [2, 3, 4, 5, 6, 7, 8, 9].map((item) => ({ value: item, label: item }))
    }
    return newObj?.numberOfSeats.map((item) => {
      return { value: item, label: item }
    })
  }

  const handleCategory = (value, numberOfSeats) => {
    if (value === 1) {
      return VEHICLE_SUB_CATEGORY_BHOT.OTO_6CHO
    }
    if (value === 2) {
      if (numberOfSeats === 6) {
        // số chỗ ngồi
        return VEHICLE_SUB_CATEGORY_BHOT.OTO_6CHO
      }
      if (numberOfSeats === 7) {
        // số chỗ ngồi
        return VEHICLE_SUB_CATEGORY_BHOT.OTO_7CHO
      }
      if (numberOfSeats === 8) {
        // số chỗ ngồi
        return VEHICLE_SUB_CATEGORY_BHOT.OTO_8CHO
      }
      if (numberOfSeats === 9) {
        // số chỗ ngồi
        return VEHICLE_SUB_CATEGORY_BHOT.OTO_9CHO
      }
      if (numberOfSeats === 10) {
        // số chỗ ngồi
        return VEHICLE_SUB_CATEGORY_BHOT.OTO_10CHO
      }
      if (numberOfSeats === 11) {
        // số chỗ ngồi
        return VEHICLE_SUB_CATEGORY_BHOT.OTO_11CHO
      }
    }
    if (value === 3) {
      return VEHICLE_SUB_CATEGORY_BHOT.XE_BAN_TAI
    }
  }

  const getOrderFileName = (link) => {
    if (link) {
      const splitLink = link.split('/')

      return splitLink[splitLink.length - 1]
    }
  }
  const handleVehicleSubTypeChange = (value) => {
    if (value === 10) {
      setSpecialTransport(TRANSPORT_TYPES[0].value)
    }
    setVehicleSubType(value)
    const numberOfSeatsOptions = handleReturnObjectOption(value)

    if (numberOfSeatsOptions.length > 0) {
      setVehicleSeatsLimit(numberOfSeatsOptions[0].value)
    } else {
      setVehicleSeatsLimit(null)
    }
  }

  const onDrop = (e) => {
    setIsDragEnter(false)
    const newFile = e.dataTransfer.files?.[0]
    if (newFile) {
      if (!newFile.type.match('image.*')) {
        //File không đúng định dạng
      } else {
        setFile(newFile)
      }
    }
  }

  const onDragEnter = () => {
    setIsDragEnter(true)
  }

  const onDragLeave = () => {
    setIsDragEnter(false)
  }

  const handlePostNews = async (file) => {
    const dataUrl = await convertFileToBase64(file)
    const arrayData = file?.name.split('.')
    const format = arrayData[arrayData.length - 1]

    const newItem = {
      imageData: dataUrl.replace('data:' + file?.type + ';base64,', ''),
      imageFormat: format
    }
    return NewsService.handleUpload(newItem)
  }

  // Hàm này để mở ra 1 tab blank show lên cà vẹt đã nhập vào
  const showCavet = () => {
    const newWindow = window.open('', '_blank')
    newWindow.document.write('<html><head><title>Document</title></head><body>')
    newWindow.document.write('<img src="' + (file ? URL.createObjectURL(file) : vehicleRegistrationImage) + '" alt="Cà vẹt" />')
    newWindow.document.write('</body></html>')
    newWindow.document.close()
  }
  function getValidDate(startDateFromAPI) {
    // Parse chuỗi DD/MM/YYYY thành Date theo giờ Việt Nam
    const [day, month, year] = startDateFromAPI.split('/').map(Number)
    const inputDate = new Date(Date.UTC(year, month - 1, day)) // Giờ UTC 00:00

    // Lấy thời gian hiện tại ở Việt Nam (UTC+7)
    const now = new Date()
    const nowVN = new Date(now.getTime() + 7 * 60 * 60 * 1000) // +7 tiếng

    // Tạo ngày hôm nay (UTC+7) ở dạng yyyy-mm-dd 00:00
    const todayVN = new Date(Date.UTC(nowVN.getUTCFullYear(), nowVN.getUTCMonth(), nowVN.getUTCDate()))

    // So sánh
    if (inputDate <= todayVN) {
      // Trả về ngày mai theo giờ Việt Nam
      const tomorrowVN = new Date(todayVN)
      tomorrowVN.setUTCDate(tomorrowVN.getUTCDate() + 1)

      return formatDateDDMMYYYY(tomorrowVN)
    }

    return formatDateDDMMYYYY(inputDate)
  }

  const optionsSubtypeMotoBike = [
    {
      label: VEHICLE_SUB_TYPE_LABEL?.[VEHICLE_SUB_TYPE.MOTORCYCLE_OVER_50CC],
      value: VEHICLE_SUB_TYPE.MOTORCYCLE_OVER_50CC
    },
    {
      label: VEHICLE_SUB_TYPE_LABEL?.[VEHICLE_SUB_TYPE.MOTORCYCLE_UNDER_50CC],
      value: VEHICLE_SUB_TYPE.MOTORCYCLE_UNDER_50CC
    },
    {
      label: VEHICLE_SUB_TYPE_LABEL?.[VEHICLE_SUB_TYPE.ELECTRIC_MOTORBIKE],
      value: VEHICLE_SUB_TYPE.ELECTRIC_MOTORBIKE
    }
  ]

  const isDisabledUpdateButton = useMemo(() => {
    return [INSURTANCE_STATUS_REF.SUCCESS.value].includes(insurance?.insuranceStatusRef)
  }, [insurance])

  const isDisabledExportOrderButton = useMemo(() => {
    return [INSURTANCE_STATUS_REF.SUCCESS.value].includes(insurance?.insuranceStatusRef)
  }, [insurance])

  return (
    <Fragment>
      <style>{`
        p {
          margin-bottom: 0.5rem !important;
        }
        h4 {
          margin-bottom: 1.2rem !important;
        }
        ul {
          padding-left: 15px !important;
        }
      `}</style>
      <div className="pointer mb-1" onClick={history.goBack}>
        <ChevronLeft />
        Quay lại
      </div>
      <Row>
        <Col lg="9">
          <Card className="pt-1 pl-1 pr-1">
            <CardBody>
              <h4>Thời hạn bảo hiểm</h4>
              <Row className="mb-1">
                <Col lg="6">
                  <FormGroup>
                    <p for="startDate">{intl.formatMessage({ id: 'startDate' })}</p>
                    <Flatpickr
                      id="startDate"
                      value={start}
                      options={{
                        mode: 'single',
                        dateFormat: 'd/m/Y',
                        disableMobile: 'true'
                        // minDate: 'today',
                        // enable: [(date) => {
                        //   return moment(date).isAfter(moment(), 'day');
                        // }]
                      }}
                      placeholder={intl.formatMessage({ id: 'operation_day' })}
                      className="form-control form-control-input"
                      onChange={(date) => {
                        if (date.length === 0) {
                          setStart(null)
                          return
                        }
                        const startDate = moment(date[0])
                        const endDate = startDate
                          .clone()
                          .add(data.productCategory === 6 ? insuranceDuration || 1 : 1, 'year')
                          .subtract(1, 'day')

                        setStart(startDate.format('DD/MM/YYYY'))
                        setEnd(endDate.format('DD/MM/YYYY'))
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup>
                    <p for="endDate">{intl.formatMessage({ id: 'endDate' })}</p>
                    <Flatpickr
                      id="endDate"
                      value={end}
                      options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: 'true' }}
                      placeholder={intl.formatMessage({ id: 'operation_day' })}
                      className="form-control form-control-input"
                      onChange={(date) => {
                        const newDateObj = date.toString()
                        const newDate = moment(newDateObj).format('DD/MM/YYYY')
                        setEnd(newDate)
                      }}
                      disabled={true}
                    />
                  </FormGroup>
                </Col>
                {data.productCategory === 6 && (
                  <Col lg="6">
                    <FormGroup>
                      <p for="insuranceDuration">Thời hạn bảo hiểm</p>
                      <BasicAutoCompleteDropdown
                        name="insuranceDuration"
                        options={optionsInsuranceDuration}
                        value={optionsInsuranceDuration.find((el) => el.value === insuranceDuration)}
                        onChange={({ value }) => {
                          setInsuranceDuration(value)
                          const endDate = moment(start, 'DD/MM/YYYY')
                            .clone()
                            .add(value || 1, 'year')
                            .subtract(1, 'day')
                          setEnd(endDate.format('DD/MM/YYYY'))
                        }}
                      />
                    </FormGroup>
                  </Col>
                )}
              </Row>
              {data.productCategory === 6 ? (
                ''
              ) : (
                <>
                  <h4>Thông tin bảo hiểm</h4>
                  <Row className="mb-1">
                    <Col lg="12">
                      <FormGroup>
                        <div className="d-flex flex-column">
                          <FormGroup check className="">
                            <Input
                              type="radio"
                              name="vehicleForBusiness"
                              value={VEHICLE_PURPOSE_USING[0].value}
                              checked={vehicleForBusiness === 0}
                              onChange={(e) => {
                                handleResetFieldsThatEffectToPrice()
                                setVehicleForBusiness(Number(e.target.value))
                                if (vehicleSubType === 10) {
                                  setSpecialTransport(TRANSPORT_TYPES[0].value)
                                }
                              }}
                            />
                            <Label check>Xe ô tô không kinh doanh vận tải</Label>
                          </FormGroup>
                          <FormGroup check className="mt-1">
                            <Input
                              type="radio"
                              name="vehiclePurpose"
                              value={VEHICLE_PURPOSE_USING[1].value}
                              checked={vehicleForBusiness === 1}
                              onChange={(e) => {
                                handleResetFieldsThatEffectToPrice()
                                setVehicleForBusiness(Number(e.target.value))
                                if (vehicleSubType === 10) {
                                  setSpecialTransport(TRANSPORT_TYPES[0].value)
                                }
                              }}
                            />
                            <Label check>Xe ô tô kinh doanh vận tải</Label>
                          </FormGroup>
                        </div>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <p for="vehicleSubType">Loại xe</p>
                        <BasicAutoCompleteDropdown
                          name="vehicleSubType"
                          options={Object.values(INSURTANCE_CAR_TYPES)}
                          value={INSURTANCE_CAR_TYPES.find((el) => el.value === vehicleSubType)}
                          onChange={({ value }) => {
                            handleResetFieldsThatEffectToPrice()
                            handleVehicleSubTypeChange(value)
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <p for="numberOfSeats">Số chỗ ngồi</p>
                        <BasicAutoCompleteDropdown
                          name="numberOfSeats"
                          options={handleReturnObjectOption(vehicleSubType)}
                          value={handleReturnObjectOption(vehicleSubType)?.find((el) => el.value === vehicleSeatsLimit)}
                          onChange={({ value }) => {
                            setVehicleSeatsLimit(Number(value))
                          }}
                        />
                      </FormGroup>
                    </Col>
                    {vehicleSubType === 10 && (
                      <Col lg="6">
                        <FormGroup>
                          <p>Loại vận chuyển</p>
                          <BasicAutoCompleteDropdown
                            name="specialTransport"
                            options={TRANSPORT_TYPES}
                            value={TRANSPORT_TYPES.find((el) => el.value === specialTransport)}
                            onChange={({ value }) => {
                              setSpecialTransport(Number(value))
                            }}
                          />
                        </FormGroup>
                      </Col>
                    )}
                    {vehicleForBusiness === 0 && vehicleSubType !== 10 && (
                      <Col lg="6">
                        <FormGroup>
                          <p for="isPracticedCar">Xe tập lái</p>
                          <div className="d-flex flex-column">
                            <FormGroup check className="">
                              <Input
                                type="radio"
                                name="isPracticedCar"
                                value={0}
                                checked={isPracticedCar === 0}
                                onChange={(e) => {
                                  setIsPracticedCar(Number(e.target.value))
                                }}
                              />
                              <Label check>Không</Label>
                            </FormGroup>
                            <FormGroup check className="mt-1">
                              <Input
                                type="radio"
                                name="isPracticedCar"
                                value={1}
                                checked={isPracticedCar === 1}
                                onChange={(e) => {
                                  setIsPracticedCar(Number(e.target.value))
                                }}
                              />
                              <Label check>Có</Label>
                            </FormGroup>
                          </div>
                        </FormGroup>
                      </Col>
                    )}
                    {vehicleSubType === 12 && (
                      <Col lg="6">
                        <FormGroup>
                          <p for="vehicleTotalWeight">Trọng tải (tấn)</p>
                          <Input
                            id="vehicleTotalWeight"
                            name="vehicleTotalWeight"
                            type="number"
                            min="1"
                            max="40"
                            value={vehicleTotalWeight}
                            onChange={(e) => {
                              handleLoadCapacityChange(e.target.value)
                            }}
                            invalid={!!formErrors.vehicleTotalWeight}
                          />
                          {formErrors.vehicleTotalWeight && <FormFeedback>{formErrors.vehicleTotalWeight}</FormFeedback>}
                        </FormGroup>
                      </Col>
                    )}
                    {vehicleForBusiness === 1 && vehicleSubType !== 12 && vehicleSubType !== 10 && (
                      <Col lg="6">
                        <FormGroup>
                          <p for="isTaxi">Xe taxi</p>
                          <div className="d-flex flex-column">
                            <FormGroup check className="">
                              <Input
                                type="radio"
                                name="isTaxi"
                                value={0}
                                checked={isTaxi === 0}
                                onChange={(e) => {
                                  setIsTaxi(Number(e.target.value))
                                }}
                              />
                              <Label check>Không</Label>
                            </FormGroup>
                            <FormGroup check className="mt-1">
                              <Input
                                type="radio"
                                name="isTaxi"
                                value={1}
                                checked={isTaxi === 1}
                                onChange={(e) => {
                                  setIsTaxi(Number(e.target.value))
                                }}
                              />
                              <Label check>Có</Label>
                            </FormGroup>
                          </div>
                        </FormGroup>
                      </Col>
                    )}
                    <Col lg="6">
                      <FormGroup>
                        <p for="productId">{intl.formatMessage({ id: 'insuranceName' })}</p>
                        <Input
                          type="select"
                          id="productId"
                          name="productId"
                          value={productId}
                          onChange={(e) => {
                            const { value } = e.target
                            setProductId(value)
                          }}>
                          {listInsurence?.map((item) => (
                            <option key={item?.productId} value={item?.productId}>
                              {item?.productName}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                </>
              )}

              <h4>Thông tin đăng kí xe</h4>

              {data.productCategory !== 6 ? (
                <Row className="mb-1">
                  <Col lg="6">
                    <FormGroup>
                      <p for="userHomeAddress">Chụp ảnh giấy đăng ký xe (cavet)</p>
                      <div
                        onDrop={onDrop}
                        onDragEnter={onDragEnter}
                        onDragLeave={onDragLeave}
                        onClick={() => inputFileRef.current && inputFileRef.current.click()}
                        className={`drag-drop-order ${file || vehicleRegistrationImage ? 'before-bg-file' : ''}`}
                        style={{
                          '--bg': `url(${file ? URL.createObjectURL(file) : vehicleRegistrationImage})`
                        }}>
                        <input ref={inputFileRef} onChange={onFileChange} type="file" accept="image/*" hidden />
                        <p className="d-flex justify-content-center my-3 pointer-events-none">
                          <Plus size={50} className="icon" />
                        </p>
                        <p className="text-center text-[#F05123] pointer-events-none">
                          {isDragEnter ? 'Thả ảnh vào đây' : 'Kéo thả ảnh vào đây, hoặc bấm để chọn ảnh'}
                        </p>
                      </div>
                      {file || vehicleRegistrationImage ? (
                        <Button className="my-2" color="primary" onClick={showCavet}>
                          Xem ảnh
                        </Button>
                      ) : null}
                    </FormGroup>
                  </Col>
                </Row>
              ) : (
                ''
              )}

              <Row className="mb-1">
                <Col lg="6">
                  <FormGroup>
                    <p for="firstName">{intl.formatMessage({ id: 'firstName' })}</p>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => {
                        const { name, value } = e.target
                        setFirstName(value)
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup>
                    <p for="userHomeAddress">{intl.formatMessage({ id: 'address' })}</p>
                    <Input
                      id="userHomeAddress"
                      name="userHomeAddress"
                      value={userHomeAddress}
                      onChange={(e) => {
                        const { name, value } = e.target
                        setUserHomeAddress(value)
                      }}
                    />
                  </FormGroup>
                </Col>
                {data.productCategory === 6 ? (
                  ''
                ) : (
                  <Col lg="6">
                    <FormGroup>
                      <p for="vehicleBrandName">{intl.formatMessage({ id: 'brand' })}</p>
                      <Input
                        id="vehicleBrandName"
                        name="vehicleBrandName"
                        value={vehicleBrandName}
                        onChange={(e) => {
                          const { name, value } = e.target
                          setVehicleBrandName(value)
                        }}
                      />
                    </FormGroup>
                  </Col>
                )}
                <Col lg="6">
                  <FormGroup>
                    <p for="vehicleIdentity">{intl.formatMessage({ id: 'messagesDetail-customerMessagePlateNumber' })}</p>
                    <Input
                      id="vehicleIdentity"
                      name="vehicleIdentity"
                      style={{ textTransform: 'uppercase' }}
                      value={vehicleIdentity}
                      onChange={(e) => handlePlateNumberChange(e.target.value)}
                      invalid={!!formErrors.plateNumber}
                    />
                    {formErrors.plateNumber && <FormFeedback>{formErrors.plateNumber}</FormFeedback>}
                  </FormGroup>
                </Col>
                {data.productCategory === 6 ? (
                  <Col lg="6">
                    <FormGroup>
                      <p for="vehicleType">{intl.formatMessage({ id: 'vehicleType' })}</p>
                      <BasicAutoCompleteDropdown
                        name="vehicleType"
                        options={optionsSubtypeMotoBike}
                        value={optionsSubtypeMotoBike.find((el) => el.value === vehicleSubType)}
                        onChange={({ value }) => {
                          setVehicleSubType(value)
                        }}
                        placeholder="Loại phương tiện xe máy"
                      />
                      {/* <Input id="vehicleType" name="vehicleType" value={VEHICLE_SUB_TYPE_LABEL[vehicleSubType]} /> */}
                    </FormGroup>
                  </Col>
                ) : (
                  ''
                )}
                <Col lg="6">
                  <FormGroup>
                    <p for="engineNumber">{intl.formatMessage({ id: 'phone_number' })}</p>
                    <Input
                      id="engineNumber"
                      name="engineNumber"
                      value={engineNumber}
                      onChange={(e) => {
                        const { name, value } = e.target
                        setEngineNumber(value)
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup>
                    <p for="chassisNumber">{intl.formatMessage({ id: 'frame_number' })}</p>
                    <Input
                      id="chassisNumber"
                      name="chassisNumber"
                      value={chassisNumber}
                      onChange={(e) => {
                        const { name, value } = e.target
                        setChassisNumber(value)
                      }}
                    />
                  </FormGroup>
                </Col>
                {data.productCategory === 6 ? (
                  ''
                ) : (
                  <Col lg="6">
                    <FormGroup>
                      <p for="engineNumber">{intl.formatMessage({ id: 'year_manufacture' })}</p>
                      <Input
                        id="yearManufacture"
                        name="yearManufacture"
                        value={yearManufacture}
                        onChange={(e) => handleChangeYearManufacture(e.target.value)}
                        invalid={!!formErrors.yearManufacture}
                      />
                      {formErrors.yearManufacture && <FormFeedback>{formErrors.yearManufacture}</FormFeedback>}
                    </FormGroup>
                  </Col>
                )}
                {data.productCategory === 6 ? (
                  <Col lg="6">
                    <FormGroup>
                      <p for="productId">{intl.formatMessage({ id: 'insuranceName' })}</p>
                      <Input
                        type="select"
                        id="productId"
                        name="productId"
                        value={productId}
                        onChange={(e) => {
                          const { value } = e.target
                          setProductId(value)
                        }}>
                        {listInsurence?.map((item) => (
                          <option key={item?.productId} value={item?.productId}>
                            {item?.productName}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                ) : (
                  ''
                )}
              </Row>

              <h4>Người nhận giấy chứng nhận</h4>
              <Row className="mb-1">
                <Col lg="6">
                  <FormGroup>
                    <p for="firstName">{appUserCategory === 2 ? 'Tên tổ chức' : intl.formatMessage({ id: 'firstName' })}</p>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => {
                        const { name, value } = e.target
                        setFirstName(value)
                      }}
                    />
                  </FormGroup>
                </Col>
                {data.productCategory !== 6 ? (
                  <Col lg="6">
                    <FormGroup>
                      <p for="appUserIdentity">{appUserCategory === 2 ? 'Mã số thuế' : 'CCCD/CMT'}</p>
                      <Input
                        id="appUserIdentity"
                        name="appUserIdentity"
                        value={appUserIdentity}
                        onChange={(e) => {
                          const { name, value } = e.target
                          setAppUserIdentity(value)
                        }}
                        disabled={detail.orderItemStatus === ORDER_ITEM_STATUS.SUCCESS}
                      />
                    </FormGroup>
                  </Col>
                ) : (
                  ''
                )}
                <Col lg="6">
                  <FormGroup>
                    <p for="userHomeAddress">{intl.formatMessage({ id: 'address' })}</p>
                    <Input
                      id="userHomeAddress"
                      name="userHomeAddress"
                      value={userHomeAddress}
                      onChange={(e) => {
                        const { name, value } = e.target
                        setUserHomeAddress(value)
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg="6">
                  <FormGroup>
                    <p for="phoneNumber">{intl.formatMessage({ id: 'phoneNumber' })}</p>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => handlePhoneNumberChange(e.target.value)}
                      invalid={!!formErrors.phoneNumber}
                    />
                    {formErrors.phoneNumber && <FormFeedback>{formErrors.phoneNumber}</FormFeedback>}
                  </FormGroup>
                </Col>

                <Col lg="6">
                  <FormGroup>
                    <p for="email">{intl.formatMessage({ id: 'email' })}</p>
                    <Input id="email" name="email" value={email} onChange={(e) => handleEmailChange(e.target.value)} invalid={!!formErrors.email} />
                    {formErrors.email && <FormFeedback>{formErrors.email}</FormFeedback>}
                  </FormGroup>
                </Col>
              </Row>

              <h4>Thông tin hợp đồng</h4>
              <p>Ngày xuất: {insurance?.contractExportDate ? moment(insurance?.contractExportDate).format('DD/MM/YYYY') : 'Chưa có ngày xuất'}</p>
              <p>Mã hợp đồng: {insurance?.policyNumber || 'Chưa có mã hợp đồng'}</p>
              <p>Nhà cung cấp: {detail.productProvider || 'Chưa có nhà cung cấp'}</p>
              <p>
                Trạng thái:{' '}
                {Object?.values(INSURTANCE_STATUS_REF)?.find((item) => item?.value === insurance?.insuranceStatusRef)?.label || 'Chưa có trạng thái'}
              </p>
              <p>
                Ghi chú :{' '}
                {splitNotes(insurance?.insuranceNoteRef).length > 0 ? (
                  <ul>
                    {splitNotes(insurance?.insuranceNoteRef).map((text, index) => (
                      <li key={index}>
                        <p>{text}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  'Chưa có ghi chú'
                )}
              </p>
              <div>
                File Hợp Đồng:{' '}
                {insurance?.insuranceStatusRef === INSURTANCE_STATUS_REF.SUCCESS.value ? (
                  <div
                    style={{ textDecoration: 'underline', color: '#7167e7', cursor: 'pointer', display: 'inline-block' }}
                    onClick={() => window.open(linkToOrderFile)}>
                    {orderItemFileName}
                  </div>
                ) : (
                  'Chưa có file hợp đồng'
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="3">
          <Card>
            <CardBody className="d-flex flex-column" style={{ gap: 16 }}>
              <Row>
                <Col lg="12" md="6" sm="6" xs="12" className="mb-1">
                  <Button color="primary" className="w-100 text-nowrap" onClick={() => handleUpdate()} disabled={isDisabledUpdateButton}>
                    Cập nhật
                  </Button>
                </Col>
                <Col lg="12" md="6" sm="6" xs="12" className="mb-1">
                  <Button
                    style={{ paddingLeft: 4, paddingRight: 4 }}
                    color="success"
                    className="exportContract w-100 text-nowrap"
                    onClick={() => handleExport()}
                    disabled={!isFormValid() || isDisabledExportOrderButton}>
                    {isExporting && <Loader size={14} className="animate-spin" style={{ marginRight: 4 }} />}
                    Xuất hợp đồng
                  </Button>
                </Col>
                <Col lg="12" md="6" sm="6" xs="12" className="mb-1">
                  <Button
                    color="secondary"
                    className="w-100 text-nowrap"
                    onClick={() => handleSend()}
                    // disabled={linkToOrderFile?.length === 0 || linkToOrderFile === undefined}>
                    disabled={true}>
                    Gửi hợp đồng
                  </Button>
                </Col>
                <Col lg="12" md="6" sm="6" xs="12" className="mb-1">
                  <Button
                    style={{ paddingLeft: 4, paddingRight: 4 }}
                    color="warning d-flex align-items-center justify-content-around text-nowrap"
                    className="w-100"
                    onClick={() => handleDownload()}
                    disabled={linkToOrderFile?.length === 0 || linkToOrderFile === undefined}>
                    {isContractExported && (linkToOrderFile?.length === 0 || linkToOrderFile === undefined) && (
                      <Loader size={14} className="animate-spin" />
                    )}
                    <span>
                      {isContractExported && (linkToOrderFile?.length === 0 || linkToOrderFile === undefined) ? 'Đang tạo hợp đồng' : 'Tải hợp đồng'}
                    </span>
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal
        isOpen={!isDisabledUpdateButton && isOpenModal}
        toggle={() => setIsOpenModal(!isOpenModal)}
        className="modal-dialog-centered"
        backdrop={false}>
        <ModalHeader toggle={() => setIsOpenModal(!isOpenModal)}>LƯU Ý</ModalHeader>
        <ModalBody>Thời gian hiệu lực của bảo hiểm không hợp lệ! Vui lòng bấm cập nhật!</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleConfirmModal}>
            Cập nhật
          </Button>{' '}
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}

export default injectIntl(MotorbikeInsuranceOrder)
