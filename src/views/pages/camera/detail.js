import { ChevronLeft } from 'react-feather'
import { useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Card, CardBody, Col, CustomInput, FormGroup, Input, Row } from 'reactstrap'
import { useEffect, useState } from 'react'
import CameraService from '../../../services/cameraService'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import { CAMERA_BRAND, CAMERA_RESOLUTION, CAMERA_STATUS, CONNECTION_PROTOCOL, CONNECTION_TYPE } from '../../../constants/camera'
import { toast } from 'react-toastify'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'

export default function DetailCamera() {
  const { id } = useParams()
  const idCamera = +id > 0 ? +id : undefined
  const history = useHistory()
  const intl = useIntl()
  const [isLoading, setIsLoading] = useState(false)
  const [dataDetail, setDataDetail] = useState({})
  const [dataConnection, setDataConnection] = useState({})
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const listNewStation = listStation.map((item) => {
    return {
      ...item,
      label: item.stationCode,
      value: item.stationsId
    }
  })

  const optionsStationId = [...listNewStation]

  const getDetailById = () => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    CameraService.getDetailById({ id }).then((data) => {
      setIsLoading(false)
      setDataDetail({
        name: data?.name,
        description: data?.description,
        brand: data?.brand,
        model: data?.model,
        serialNumber: data?.serialNumber,
        resolution: data?.resolution,
        lens: data?.lens,
        installLocation: data?.installLocation,
        stationsId: data?.stationsId,
        status: data?.status,
        cameraRefId: data?.cameraRefId,
        cameraRefName: data?.cameraRefName,
        cameraRefProvider: data?.cameraRefProvider,
        cameraRefData: data?.cameraRefData
      })
      const dataConnection = data?.stationCameraConnections?.[0]
      setDataConnection({
        connectionName: dataConnection?.connectionName,
        connectionChannel: dataConnection?.connectionChannel,
        connectionProtocol: dataConnection?.connectionProtocol,
        connectionType: dataConnection?.connectionType,
        ipAddress: dataConnection?.ipAddress,
        port: dataConnection?.port,
        streamUrl: dataConnection?.streamUrl,
        username: dataConnection?.username,
        password: dataConnection?.password
      })
    })
  }

  const handleCreate = async () => {
    if (isLoading) {
      return
    }
    const error = checkRegex()
    if (error) {
      toast.warn(error)
      return
    }
    const cameraIdFromAPI = await saveCamera()
    if (!cameraIdFromAPI) {
      return toast.error('Tạo camera thất bại')
    }

    const resConnection = await saveConnection(cameraIdFromAPI)
    if (resConnection) {
      toast.success('Tạo camera thành công')
    } else {
      toast.error('Tạo thông tin kỹ thuật công nhưng thông tin kết nối thất bại')
    }
    setTimeout(() => {
      window.location.replace(`/pages/detail-camera/${cameraIdFromAPI}`)
    }, 500)
  }
  const handleUpdate = async () => {
    if (isLoading) {
      return
    }
    const error = checkRegex()
    if (error) {
      toast.warn(error)
      return
    }
    const resCamera = await saveCamera(idCamera)
    if (!resCamera) {
      return toast.error('Cập nhật thông tin kỹ thuật thất bại')
    }

    const resConnection = await saveConnection(idCamera)
    if (!resConnection) {
      toast.error('Cập nhật kết nối thất bại')
    } else {
      if (resCamera && resConnection) {
        toast.success('Cập nhật thành công')
        getDetailById()
      } else {
        toast.error('Cập nhật thất bại')
      }
    }
  }
  const saveCamera = async (idCamera) => {
    const payload = idCamera
      ? {
          data: {
            ...dataDetail
          },
          id
        }
      : {
          ...dataDetail
        }
    const func = idCamera ? CameraService.updateById : CameraService.create
    const res = await func(payload)
    return idCamera ? res : res?.[0]
  }
  const saveConnection = async (idCamera) => {
    let listConnection = await CameraService.StationCameraConnectionGetList({
      filter: {
        stationCameraId: String(idCamera)
      }
    })
    if (!listConnection) {
      return
    }
    listConnection = listConnection?.data || []

    const stationCameraConnectionId = listConnection?.[0]?.stationCameraConnectionId
    const payloadConnection = stationCameraConnectionId
      ? {
          id: stationCameraConnectionId,
          data: {
            ...dataConnection
          }
        }
      : {
          ...dataConnection,
          stationCameraId: idCamera
        }
    const func = stationCameraConnectionId ? CameraService.StationCameraConnectionUpdateById : CameraService.StationCameraConnectionInsert
    const res = await func(payloadConnection)
    return stationCameraConnectionId ? res : res?.[0]
  }

  const checkRegex = () => {
    if (!dataDetail?.stationsId) {
      return 'Vui lòng chọn mã trung tâm'
    }
    if (!dataDetail?.name) {
      return 'Vui lòng nhập tên camera'
    }
    if (!dataDetail?.description) {
      return 'Vui lòng nhập mô tả'
    }
    if (!dataDetail?.brand) {
      return 'Vui lòng nhập hãng sản xuất'
    }
    if (!dataDetail?.model) {
      return 'Vui lòng nhập model'
    }
    if (!dataDetail?.serialNumber) {
      return 'Vui lòng nhập số serial'
    }
    if (!dataDetail?.resolution) {
      return 'Vui lòng nhập số độ phân giải'
    }
    if (!dataDetail?.lens) {
      return 'Vui lòng nhập loại ống kính'
    }
    if (!dataDetail?.installLocation) {
      return 'Vui lòng nhập vị trí lắp đặt'
    }
    if (!dataConnection?.connectionName) {
      return 'Vui lòng nhập tên kết nối'
    }
    if (!dataConnection?.ipAddress) {
      return 'Vui lòng nhập địa chỉ IP'
    }
    if (!dataConnection?.port) {
      return 'Vui lòng nhập cổng'
    }
    if (!(+dataConnection?.port > 0)) {
      return 'Thông tin cổng phải là số'
    }
    if (+dataConnection?.port > 1000000000) {
      return 'Số nhập vào cổng quá lớn'
    }
    if (!dataConnection?.connectionType) {
      return 'Vui lòng chọn loại kết nối'
    }
    if (!dataConnection?.connectionProtocol) {
      return 'Vui lòng chọn giao thức kết nối'
    }
    if (!dataConnection?.connectionChannel) {
      return 'Vui lòng nhập kênh'
    }
    if (!(+dataConnection?.connectionChannel > 0)) {
      return 'Thông tin kênh phải là số'
    }
    if (+dataConnection?.connectionChannel > 1000000000) {
      return 'Số nhập vào kênh quá lớn'
    }
    if (!dataConnection?.streamUrl) {
      return 'Vui lòng nhập URL kết nối'
    }
    if (!dataConnection?.username) {
      return 'Vui lòng nhập tài khoản'
    }
    if (!dataConnection?.username) {
      return 'Vui lòng nhập mật khẩu'
    }
    return undefined
  }

  useEffect(() => {
    if (idCamera > 0) {
      getDetailById()
    }
  }, [idCamera])

  return (
    <div>
      {/* <button onClick={() => history.replace(`/pages/detail-camera/9`)}>sdfad</button> */}
      <style>
        {`
          p {
            margin-bottom: 0.5rem !important;
          }
          h5 {
            margin-bottom: 1.2rem !important;
          }
          ul {
            padding-left: 15px !important;
          }
        `}
      </style>
      <div className="pl-1 pb-1 pointer" onClick={() => history.goBack()}>
        <ChevronLeft />
        Quay lại
      </div>
      <div className="invoice-preview-wrapper">
        <Row className="invoice-preview">
          <Col xl={9} md={8} sm={12}>
            <Card className="invoice-preview-card">
              <CardBody className="invoice-padding pb-2">
                {!idCamera ? (
                  <h4 className="d-flex align-items-center" style={{ gap: 10 }}>
                    Thêm mới Camera
                  </h4>
                ) : (
                  <h4 className="d-flex align-items-center" style={{ gap: 10 }}>
                    Cập nhật Camera <span className="invoice-number">#{id}</span>{' '}
                  </h4>
                )}
              </CardBody>
              <CardBody className="invoice-padding pb-0 pt-0">
                <h5>Thông tin chung</h5>
                <Row className="mb-1">
                  <Col lg="6">
                    <FormGroup>
                      <p>Mã Trung tâm</p>
                      <BasicAutoCompleteDropdown
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 })
                        }}
                        className="w-100"
                        placeholder={intl.formatMessage({ id: 'station_code' })}
                        name="stationsId"
                        options={optionsStationId}
                        value={optionsStationId.find((el) => String(el.stationsId) === String(dataDetail?.stationsId))}
                        onChange={({ value }) => {
                          setDataDetail((prev) => ({
                            ...prev,
                            stationsId: value
                          }))
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Tên Camera</p>
                      <Input
                        placeholder="Nhập tên camera"
                        value={dataDetail?.name}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            name: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col lg="6">
                    <FormGroup>
                      <p>ID tham chiếu camera</p>
                      <Input
                        placeholder="Nhập ID tham chiếu camera"
                        value={dataDetail?.cameraRefId}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            cameraRefId: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Tên camera tích hợp</p>
                      <Input
                        placeholder="Nhập tên camera tích hợp"
                        value={dataDetail?.cameraRefName}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            cameraRefName: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Nhà cung cấp camera</p>
                      <Input
                        placeholder="Nhập nhà cung cấp camera"
                        value={dataDetail?.cameraRefProvider}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            cameraRefProvider: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Dữ liệu cấu hình camera</p>
                      <Input
                        placeholder="Nhập dữ liệu cấu hình camera"
                        value={dataDetail?.cameraRefData}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            cameraRefData: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col lg="6">
                    <FormGroup>
                      <p>Mô tả</p>
                      <Input
                        type="textarea"
                        placeholder="Nhập mô tả"
                        value={dataDetail?.description}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            description: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Trạng thái</p>
                      <CustomInput
                        className="mb-1"
                        type="radio"
                        label="Hoạt động"
                        name="status1"
                        id="status1"
                        checked={dataDetail?.status === CAMERA_STATUS.ONLINE.value}
                        onChange={() => setDataDetail({ ...dataDetail, status: CAMERA_STATUS.ONLINE.value })}
                      />
                      <CustomInput
                        className="mb-1"
                        type="radio"
                        label="Không hoạt động"
                        name="status2"
                        id="status2"
                        checked={dataDetail?.status === CAMERA_STATUS.OFFLINE.value}
                        onChange={() => setDataDetail({ ...dataDetail, status: CAMERA_STATUS.OFFLINE.value })}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <h5>Thông tin kỹ thuật</h5>
                <Row className="mb-1">
                  <Col lg="6">
                    <FormGroup>
                      <p>Hãng sản xuất</p>
                      <Input
                        placeholder="Nhập tên camera"
                        value={dataDetail?.brand}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            brand: e.target.value
                          })
                        }}
                      />
                      {/* <BasicAutoCompleteDropdown
                        placeholder="Chọn hãng sản xuất"
                        className="w-100"
                        options={Object.values(CAMERA_BRAND)}
                        value={Object.values(CAMERA_BRAND).find((el) => el.value === dataDetail?.brand)}
                        onChange={({ value }) => {
                          setDataDetail({
                            ...dataDetail,
                            brand: value
                          })
                        }}
                      /> */}
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Model</p>
                      <Input
                        placeholder="Nhập model"
                        value={dataDetail?.model}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            model: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Số Serial</p>
                      <Input
                        placeholder="Nhập số serial"
                        value={dataDetail?.serialNumber}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            serialNumber: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Độ phân giải</p>
                      <BasicAutoCompleteDropdown
                        placeholder="Chọn độ phân giải"
                        className="w-100"
                        options={Object.values(CAMERA_RESOLUTION)}
                        value={Object.values(CAMERA_RESOLUTION).find((el) => el.value === dataDetail?.resolution)}
                        onChange={({ value }) => {
                          setDataDetail({
                            ...dataDetail,
                            resolution: value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Loại ống kinh</p>
                      <Input
                        placeholder="Nhập loại ống kinh"
                        value={dataDetail?.lens}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            lens: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Vị trí lắp đặt</p>
                      <Input
                        placeholder="Nhập vị trí lắp đặt"
                        value={dataDetail?.installLocation}
                        onChange={(e) => {
                          setDataDetail({
                            ...dataDetail,
                            installLocation: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <h5>Thông tin kết nối</h5>
                <Row className="mb-1">
                  <Col lg="6">
                    <FormGroup>
                      <p>Tên kết nối</p>
                      <Input
                        placeholder="Nhập tên kết nối"
                        value={dataConnection?.connectionName}
                        onChange={(e) => {
                          setDataConnection({
                            ...dataConnection,
                            connectionName: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Địa chỉ IP</p>
                      <Input
                        placeholder="Nhập địa chỉ IP"
                        value={dataConnection?.ipAddress}
                        onChange={(e) => {
                          setDataConnection({
                            ...dataConnection,
                            ipAddress: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Cổng</p>
                      <Input
                        placeholder="Nhập cổng"
                        value={dataConnection?.port}
                        onChange={(e) => {
                          setDataConnection({
                            ...dataConnection,
                            port: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Loại kết nối</p>
                      <BasicAutoCompleteDropdown
                        placeholder="Chọn loại kết nối"
                        className="w-100"
                        options={Object.values(CONNECTION_TYPE)}
                        value={Object.values(CONNECTION_TYPE).find((el) => el.value === dataConnection?.connectionType)}
                        onChange={({ value }) => {
                          setDataConnection({
                            ...dataConnection,
                            connectionType: value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Giao thức kết nối</p>
                      <BasicAutoCompleteDropdown
                        placeholder="Chọn giao thức kết nối"
                        className="w-100"
                        options={Object.values(CONNECTION_PROTOCOL)}
                        value={Object.values(CONNECTION_PROTOCOL).find((el) => el.value === dataConnection?.connectionProtocol)}
                        onChange={({ value }) => {
                          setDataConnection({
                            ...dataConnection,
                            connectionProtocol: value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Kênh</p>
                      <Input
                        placeholder="Nhập kênh"
                        value={dataConnection?.connectionChannel}
                        onChange={(e) => {
                          setDataConnection({
                            ...dataConnection,
                            connectionChannel: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>URL kết nối</p>
                      <Input
                        placeholder="Nhập URL kết nối"
                        value={dataConnection?.streamUrl}
                        onChange={(e) => {
                          setDataConnection({
                            ...dataConnection,
                            streamUrl: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Tài khoản</p>
                      <Input
                        placeholder="Nhập tài khoản"
                        value={dataConnection?.username}
                        onChange={(e) => {
                          setDataConnection({
                            ...dataConnection,
                            username: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <p>Mật khẩu</p>
                      <Input
                        placeholder="Nhập mật khẩu"
                        value={dataConnection?.password}
                        onChange={(e) => {
                          setDataConnection({
                            ...dataConnection,
                            password: e.target.value
                          })
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                {/* {!isCreate && (
                  <>
                    <h5>Thông tin kết nối & livestream</h5>
                    <p>
                      Trạng thái kết nối:{' '}
                      <Badge color={Object.values(CAMERA_STATUS).find((el) => el.value === dataDetail?.status)?.color}>
                        {Object.values(CAMERA_STATUS).find((el) => el.value === dataDetail?.status)?.label}
                      </Badge>
                    </p>
                    <p>Lần cuối kiểm tra: {dataDetail?.lastCheckedAt && convertDateVN(dataDetail?.lastCheckedAt)}</p>
                  </>
                )} */}
              </CardBody>
            </Card>
          </Col>
          <Col xl={3} md={4} sm={12}>
            <Card className="invoice-action-wrapper">
              <CardBody>
                <Button
                  color="primary"
                  onClick={() => {
                    !idCamera ? handleCreate() : handleUpdate()
                  }}
                  className="mb-2 w-100 text-nowrap">
                  {!idCamera ? 'Thêm mới Camera' : 'Cập nhật Camera'}
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
