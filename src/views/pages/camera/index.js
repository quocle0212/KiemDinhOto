import { useEffect, useState } from 'react'
import { Edit, Search, Trash } from 'react-feather'
import { useIntl } from 'react-intl'
import { Badge, Button, Card, CardBody, Col, Input, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import CameraService from '../../../services/cameraService'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import { CAMERA_BRAND, CAMERA_RESOLUTION, CAMERA_STATUS } from '../../../constants/camera'
import DataTable from 'react-data-table-component'
import BasicTablePaging from '../../components/BasicTablePaging'
import { COLUMNS_WIDTH } from '../../../constants/app'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { toast } from 'react-toastify'

export default function Camera() {
  const intl = useIntl()
  const history = useHistory()
  const [dataList, setDataList] = useState([])
  const [filter, setFilter] = useState({
    // filter: {
    //   status: undefined
    // },
    limit: 10,
    skip: 0
    // searchText: ''
  })
  const [searchValue, setSearchValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [idCameraToDelete, setIdCameraToDelete] = useState(null)
  const [firstPage, setFirstPage] = useState(true)

  const optionsStatus = [
    {
      value: undefined,
      label: 'Tất cả trạng thái'
    },
    ...Object.values(CAMERA_STATUS)
  ]

  const optionsBrand = [
    {
      value: undefined,
      label: 'Tất cả hãng'
    },
    ...Object.values(CAMERA_BRAND)
  ]

  const optionsResolution = [
    {
      value: undefined,
      label: 'Tất cả độ phân giải'
    },
    ...Object.values(CAMERA_RESOLUTION)
  ]

  const serverSideColumns = [
    {
      name: 'ID',
      minWidth: COLUMNS_WIDTH.SMALL,
      cell: (row) => row?.stationCameraId
    },
    {
      name: 'MÃ TRUNG TÂM',
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => optionsStationId.find((item) => item.value === row?.stationsId)?.label
    },
    {
      name: 'TÊN CAMERA',
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => row?.name
    },
    {
      name: 'HÃNG SẢN XUẤT',
      minWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => row?.brand
    },
    {
      name: 'MODEL',
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => row?.model
    },
    {
      name: 'IP/HOST',
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => row?.stationCameraConnections?.[0]?.ipAddress
    },
    {
      name: 'TRẠNG THÁI',
      minWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => <Badge color={Object.values(CAMERA_STATUS)?.find((item) => item.value === row?.status)?.color}>
        {Object.values(CAMERA_STATUS)?.find((item) => item.value === row?.status)?.label}
      </Badge>
    },
    {
      name: 'ĐỘ PHÂN GIẢI',
      minWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => Object.values(CAMERA_RESOLUTION)?.find((item) => item.value === row?.resolution)?.label
    },
    {
      name: 'HÀNH ĐỘNG',
      minWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => (
        <div>
          <Edit className="pointer" size={15} onClick={() => row?.stationCameraId && history.push(`/pages/detail-camera/${row?.stationCameraId}`)} />
          <Trash className="pointer ml-3" size={15} onClick={() => setIdCameraToDelete(row?.stationCameraId)} />
        </div>
      )
    }
  ]

  const getData = (filter) => {
    if (isLoading) return
    setIsLoading(true)
    CameraService.getList(filter).then((res) => {
      setIsLoading(false)
      const { data } = res
      setDataList(data || [])
    })
  }

  const deleteCamera = () => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    CameraService.deleteById({ id: idCameraToDelete }).then((res) => {
      setIsLoading(false)
      if (res) {
        getData(filter)
        setIdCameraToDelete(null)
        toast.success('Xóa thành công')
      } else {
        toast.error('Xóa thất bại')
      }
    })
  }
  useEffect(() => {
    getData(filter)
  }, [filter])

  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const listNewStation = listStation.map((item) => {
    return {
      ...item,
      label: item.stationCode,
      value: item.stationsId
    }
  })

  const optionsStationId = [
    {
      label: 'Tất cả',
      value: ''
    },
    ...listNewStation
  ]

  return (
    <div>
      <Card>
        <CardBody>
          <Row className="mb-1">
            <Col lg="3" sm="4" xs="12" className="d-flex mb-1">
              <InputGroup className="input-search-group">
                <Input
                  placeholder={intl.formatMessage({ id: 'Search' })}
                  className="dataTable-filter"
                  type="search"
                  bsSize="md"
                  id="search-input"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value)
                  }}
                />
              </InputGroup>
              <Button
                color="primary"
                size="md"
                onClick={() => {
                  setFirstPage(!firstPage)
                  setFilter((prev) => ({
                    ...prev,
                    searchText: searchValue,
                    skip: 0
                  }))
                }}>
                <Search size={15} />
              </Button>
            </Col>
            <Col lg="3" sm="4" xs="12" className="d-flex mb-1">
              <BasicAutoCompleteDropdown
                className="w-100"
                placeholder={intl.formatMessage({ id: 'station_code' })}
                name="stationsId"
                options={optionsStationId}
                value={optionsStationId.find((el) => el.value === filter?.filter?.stationsId)}
                onChange={({ value }) => {
                  setFirstPage(!firstPage)
                  setFilter((prev) => ({
                    ...prev,
                    filter: {
                      ...prev.filter,
                      stationsId: value || undefined
                    },
                    skip: 0
                  }))
                }}
              />
            </Col>
            <Col lg="3" sm="4" xs="12" className="d-flex mb-1">
              <BasicAutoCompleteDropdown
                className="w-100"
                options={optionsStatus}
                value={optionsStatus.find((el) => el.value === filter?.filter?.status)}
                onChange={({ value }) => {
                  setFirstPage(!firstPage)
                  setFilter((prev) => ({
                    ...prev,
                    filter: {
                      ...prev.filter,
                      status: value
                    },
                    skip: 0
                  }))
                }}
              />
            </Col>
            {/* <Col lg="3" sm="4" xs="12" className="d-flex mt-sm-0 mt-1">
              <BasicAutoCompleteDropdown
                className="w-100"
                options={optionsBrand}
                value={optionsBrand.find((el) => el.value === filter?.filter?.brand)}
                onChange={({ value }) => {
                  setFirstPage(!firstPage)
                  setFilter((prev) => ({
                    ...prev,
                    filter: {
                      ...prev.filter,
                      brand: value
                    },
                    skip: 0
                  }))
                }}
              />
            </Col> */}
            <Col lg="3" sm="4" xs="12" className="d-flex mb-1">
              <BasicAutoCompleteDropdown
                className="w-100"
                options={optionsResolution}
                value={optionsResolution.find((el) => el.value === filter?.filter?.resolution)}
                onChange={({ value }) => {
                  setFirstPage(!firstPage)
                  setFilter((prev) => ({
                    ...prev,
                    filter: {
                      ...prev.filter,
                      resolution: value
                    },
                    skip: 0
                  }))
                }}
              />
            </Col>
            <Col lg="3" sm="4" xs="12" className="d-flex mb-1">
              <Button.Ripple
                color="primary"
                size="md"
                onClick={() => {
                  history.push(`/pages/detail-camera/0`)
                }}>
                {intl.formatMessage({ id: 'add_new' })}
              </Button.Ripple>
            </Col>
          </Row>
          <DataTable noHeader paginationServer className="react-dataTable" columns={serverSideColumns} data={dataList} progressPending={isLoading} />
          <BasicTablePaging
            firstPage={firstPage}
            items={dataList?.length}
            limit={filter.limit}
            handlePaginations={(page) =>
              setFilter({
                ...filter,
                skip: (page - 1) * filter.limit
              })
            }
          />
          <Modal isOpen={idCameraToDelete ? true : false} toggle={() => setIdCameraToDelete(null)} className={`modal-dialog-centered `}>
            <ModalHeader toggle={() => setIdCameraToDelete(null)}>Xóa camera</ModalHeader>
            <ModalBody>
              <p>
                Bạn có chắc chắn muốn xoá camera với id là <strong>{idCameraToDelete}</strong> không?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button.Ripple
                color="primary"
                size="sm"
                className="px-2"
                onClick={() => {
                  deleteCamera()
                }}>
                Xóa camera
              </Button.Ripple>
            </ModalFooter>
          </Modal>
        </CardBody>
      </Card>
    </div>
  )
}
