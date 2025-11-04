import { memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { injectIntl } from 'react-intl'
import BasicTablePaging from '../../components/BasicTablePaging'
import PaymentMethodService from '../../../services/paymentMethodService'
import { CustomInput } from 'reactstrap'
import { toast } from 'react-toastify'

export const PAYMENT_TYPE= {
  ATM_BANK: 1,
  MOMO_BANK: 2,
  GTEL_PAY: 3,
  VNPAY: 4,
  ZALOPAY: 5,
  VIETTEL_PAY: 6,
  TA_MOVE: 7,
}

function PaymentMethod({ intl }) {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [paramsFilter, setParamsFilter] = useState({
    skip: 0,
    limit: 20,
    filter: {
      stationsId: null,
    }
  })

  const getData = () => {
    setIsLoading(true)
    PaymentMethodService.find(paramsFilter).then((res) => {
      setIsLoading(false)
      if (res?.statusCode === 200) {
        setData(res?.data?.data || [])
      } else {
        setData([])
      }
    })
  }

  useEffect(() => {
    getData()
  }, [paramsFilter])

  const serverSideColumns = [
    {
      name: 'ID',
      minWidth: '120px',
      cell: (row) => row?.paymentMethodId
    },
    {
      name: 'Loại',
      minWidth: '150px',
      cell: (row) => {
        const data = Object.entries(PAYMENT_TYPE)
        .filter(([key, val]) => val === row?.paymentMethodType)
        .map(([key]) => key)
        return data ? data?.[0]?.replaceAll('_', ' ') : ''
      }
    },
    {
      name: 'Ngân hàng',
      minWidth: '200px',
      cell: (row) => row?.paymentMethodName
    },
    {
      name: 'Tên tài khoản',
      minWidth: '250px',
      cell: (row) => row?.paymentMethodReceiverName
    },
    {
      name: 'Số tài khoản',
      minWidth: '150px',
      cell: (row) => row?.paymentMethodIdentityNumber
    },
    {
      name: 'Đơn vị',
      minWidth: '150px',
      cell: (row) => row?.paymentMethodUnit
    },
    {
      name: 'Hoạt động',
      minWidth: '150px',
      cell: (row) => (
        <CustomInput
          type="switch"
          id={`EnableMethod${row?.paymentMethodId}`}
          name={`EnableMethod${row?.paymentMethodId}`}
          checked={row?.paymentMethodEnable === 1 ? true : false}
          onChange={(e) => updateStatusEnablePaymentMethid(row?.paymentMethodId, e.target.checked ? 1 : 0)}
        />
      )
    }
  ]

  const updateStatusEnablePaymentMethid = (id, paymentMethodEnable) => {
    PaymentMethodService.updateById({
      id: id,
      data: {
        paymentMethodEnable: paymentMethodEnable
      }
    }).then((res) => {
      if (res.statusCode === 200) {
        toast.success('Cập nhật thành công')
        getData(paramsFilter)
      } else {
        toast.error('Cập nhật thành công')
      }
    })
  }

  const CustomPaginations = () => {
    const lengthItem = data.length
    return <BasicTablePaging items={lengthItem} handlePaginations={handlePaginations} />
  }

  const handlePaginations = (page) => {
    setParamsFilter({ ...paramsFilter, skip: (page - 1) * paramsFilter.limit })
  }

  return (
    <div>
      <DataTable noHeader paginationServer className="react-dataTable" columns={serverSideColumns} data={data} progressPending={isLoading} />
      {CustomPaginations()}
    </div>
  )
}

export default injectIntl(memo(PaymentMethod))
