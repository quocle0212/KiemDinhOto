import { useEffect, useState } from 'react'
import { Trash, Edit } from 'react-feather'
import { Button, Card, CardBody, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import AlertService from '../../../services/alertService'
import DataTable from 'react-data-table-component'
import BasicTablePaging from '../../components/BasicTablePaging'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import moment from 'moment'
import Type from '../../components/vehicletype'
import { COLUMNS_WIDTH } from '../../../constants/app'
import './index.scss'

export default function Alert() {
  const history = useHistory()
  const [dataList, setDataList] = useState([])
  const [filter, setFilter] = useState({
    limit: 10,
    skip: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [idAlertToDelete, setIdAlertToDelete] = useState(null)
  const [firstPage, setFirstPage] = useState(true)

  const serverSideColumns = [
    {
      name: 'STT',
      minWidth: COLUMNS_WIDTH.SMALL,
      maxWidth: COLUMNS_WIDTH.SMALL,
      cell: (row, index) => {
        return <div>{(filter.skip || 0) + index + 1}</div>
      }
    },
    {
      name: 'BIỂN SỐ XE',
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => {
        const { vehiclePlateNumber, vehiclePlateColor } = row
        return (
          <p className={`color_licensePlates
            ${vehiclePlateColor === 'WHITE' ? 'color_white' : ' '}
            ${vehiclePlateColor === 'BLUE' ? 'color_blue' : ' '}
            ${vehiclePlateColor === 'YELLOW' ? 'color_yellow' : ' '}
            ${vehiclePlateColor === 'RED' ? 'color_red' : ' '}
          `}>{vehiclePlateNumber}</p>
        )
      }
    },
    {
      name: 'LOẠI PHƯƠNG TIỆN',
      minWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => {
        return <Type vehicleType={Number(row.vehicleType)} />
      }
    },
    {
      name: 'LỖI VI PHẠM',
      minWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => row?.violationType
    },
    {
      name: 'TRẠNG THÁI',
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => {
        const statusMap = {
          'PENDING': { label: 'Chưa xử lý', color: '#dc3545' },
          'PROCESSED': { label: 'Đã xử lý', color: '#28a745' },
          'NO_VIOLATION': { label: 'Không vi phạm', color: '#000000' }
        }
        const status = statusMap[row?.violationStatus]
        return (
          <span style={{ 
            color: status?.color || '#000000',
            fontWeight: '500'
          }}>
            {status?.label || row?.violationStatus}
          </span>
        )
      }
    },
    {
      name: 'THỜI GIAN VI PHẠM',
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => {
        const time = moment(row?.violationTime)
        return (
          <div>
            <div>{time.format('HH:mm:ss')}</div>
            <div>{time.format('DD/MM/YYYY')}</div>
          </div>
        )
      }
    },
    {
      name: 'ĐỊA ĐIỂM VI PHẠM',
      minWidth: COLUMNS_WIDTH.XXLARGE,
      cell: (row) => row?.violationLocation
    },
    {
      name: 'ĐƠN VỊ PHÁT HIỆN',
      minWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => row?.detectionUnit
    },
    {
      name: 'ĐƠN VỊ GIẢI QUYẾT',
      minWidth: COLUMNS_WIDTH.XXLARGE,
      cell: (row) => row?.resolutionUnit
    },
    {
      name: 'THỜI GIAN TRA CỨU MỚI NHẤT',
      minWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => {
        const time = moment(row?.lastCheckTime)
        return (
          <div>
            <div>{time.format('HH:mm:ss')}</div>
            <div>{time.format('DD/MM/YYYY')}</div>
          </div>
        )
      }
    },
    {
      name: 'NGUỒN TRA CỨU',
      minWidth: COLUMNS_WIDTH.XLARGE,
      cell: (row) => row?.checkSource
    },
    {
      name: 'HÀNH ĐỘNG',
      minWidth: COLUMNS_WIDTH.LARGE,
      cell: (row) => (
        <div>
          <Edit className="pointer" size={15} onClick={() => row?.alertId && history.push(`/pages/detail-alert/${row?.alertId}`)} />
          <Trash className="pointer ml-3" size={15} onClick={() => setIdAlertToDelete(row?.alertId)} />
        </div>
      )
    }
  ]

  const getData = (filter) => {
    if (isLoading) return
    setIsLoading(true)
    AlertService.getList(filter).then((res) => {
      setIsLoading(false)
      const { data } = res
      setDataList(data || [])
    })
  }

  const deleteAlert = () => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    AlertService.deleteById({ id: idAlertToDelete }).then((res) => {
      setIsLoading(false)
      if (res) {
        getData(filter)
        setIdAlertToDelete(null)
        toast.success('Xóa thành công')
      } else {
        toast.error('Xóa thất bại')
      }
    })
  }
  
  useEffect(() => {
    getData(filter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  return (
    <div>
      <Card>
        <CardBody>
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
          <Modal isOpen={idAlertToDelete ? true : false} toggle={() => setIdAlertToDelete(null)} className={`modal-dialog-centered `}>
            <ModalHeader toggle={() => setIdAlertToDelete(null)}>Xóa alert</ModalHeader>
            <ModalBody>
              <p>
                Bạn có chắc chắn muốn xoá alert với id là <strong>{idAlertToDelete}</strong> không?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button.Ripple
                color="primary"
                size="sm"
                className="px-2"
                onClick={() => {
                  deleteAlert()
                }}>
                Xóa alert
              </Button.Ripple>
            </ModalFooter>
          </Modal>
        </CardBody>
      </Card>
    </div>
  )
}