import React, { memo, useState } from 'react'
import { Modal, ModalHeader, ModalBody, Button, Progress } from 'reactstrap'
import { injectIntl, useIntl } from 'react-intl'
import XLSX from 'xlsx'
import { toast } from 'react-toastify'
import axios from 'axios'
import { HOST } from '../../../constants/url'
import { trimStrings } from '../../../helper/common'
import { decryptAes256CBC } from '../../../constants/EncryptionFunctions'
import addKeyLocalStorage from '../../../helper/localStorage'

function LoadingDialogExportFile(props) {
  const { title, createRowData, filter, linkApi, nameFile, limit = 100, className = '', style = {}, mockDataFallback } = props
  const { formatMessage: f } = useIntl()
  const [isLoadingExportExcel, setIsLoadingExportExcel] = useState(false)
  const [cancelRequest, setCancelRequest] = useState(undefined)

  const onExportExcel = async () => {
    let isError = false

    async function fetchData(payload) {
      const url = HOST + `${linkApi}`
      const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
      const headers = token ? { Authorization: `Bearer ${token.replace(/"/g, '')}` } : {}
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      setCancelRequest(source)

      const data = await axios({
        method: 'POST',
        url,
        data: trimStrings(payload),
        headers,
        cancelToken: source.token
      })
        .then((result) => {
          const data = result.data
          let decryption = data
          if (data.idEn) {
            decryption = decryptAes256CBC(data) // mã hoá lấy về
          }

          const newData = { ...data, ...decryption }

          if (Array.isArray(newData.data.data)) {
            return newData.data.data
          } else if (Array.isArray(newData.data)) {
            return newData.data
          } else {
            return 'error'
          }
        })
        .catch((error) => {
          // Nếu có mockDataFallback, sử dụng nó thay vì báo lỗi
          if (mockDataFallback && typeof mockDataFallback === 'function') {
            try {
              const mockResult = mockDataFallback(payload)
              // Xử lý cấu trúc mock data
              if (mockResult && mockResult.statusCode === 200) {
                const mockData = mockResult.data?.data || mockResult.data || []
                if (Array.isArray(mockData)) {
                  return mockData
                }
              }
            } catch (mockError) {
              console.error('Mock data fallback error:', mockError)
            }
          }
          
          toast.warn('Quá trình xuất file đã dừng. Vui lòng thử lại sau!')
          return 'error'
        })
      return data
    }

    const paramsFilter = { ...filter, skip: 0, limit }
    let arrayData = []

    async function handleFetchData() {
      const data = await fetchData(paramsFilter)

      if (data === 'error') {
        isError = true
        return
      }
      if (Array.isArray(data)) {
        arrayData = [...arrayData, ...data]
        paramsFilter.skip += limit
        if (data.length === limit) {
          return await handleFetchData()
        }
      }
    }

    await handleFetchData()

    if (!isError) {
      if (arrayData.length > 0) {
        const convertedData = arrayData.map((item, idx) => createRowData(item, idx))
        if (convertedData?.length > 0) {
          let wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(convertedData)
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet')
          XLSX.writeFile(wb, `${nameFile}.xlsx`)
        }
      } else {
        toast.warn('Không có dữ liệu để xuất file')
      }
    } else {
      toast.warn('Không có dữ liệu để xuất file')
    }

    handleClose()
  }

  function handleClose() {
    setCancelRequest(undefined)
    setIsLoadingExportExcel(false)
  }
  return (
    <>
      <Button
        onClick={() => {
          setIsLoadingExportExcel(true)
          onExportExcel()
        }}
        style={style}
        size="md"
        color="warning"
        className={`${className}`}>
        Xuất file
      </Button>
      <Modal isOpen={isLoadingExportExcel} size="sm" className={`modal-dialog-centered `}>
        <ModalHeader
          toggle={() => {
            cancelRequest.cancel('Operation canceled by the user.')
          }}>
          {title}
        </ModalHeader>
        <ModalBody>
          <p>Đang tải dữ liệu...</p>
          <Progress animated color="primary" value={100} />
        </ModalBody>
      </Modal>
    </>
  )
}

export default injectIntl(memo(LoadingDialogExportFile))
