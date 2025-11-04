import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { X, ChevronUp, ChevronDown, Loader } from 'react-feather'
import StationDevice from '../../../services/statiosDevice'
import Service from '../../../services/request'
import SpinnerBorder from '../spinners/SpinnerBorder'
import moment from 'moment'
import { handleChangeOpenImport } from '../../../redux/actions/import'
import './popoverImport.scss'

const PopoverImportItem = ({ name, status }) => {
  return (
    <div className="documentary-popover-item">
      <div className="documentary-popover-item-name">{name}</div>
      <div className="documentary-popover-item-status">{status === 'import' ? <SpinnerBorder /> : <Loader />}</div>
    </div>
  )
}

const PopoverImportWarning = () => {
  const [data, setData] = useState([])
  const [showList, setShowList] = useState(true)
  const intl = useIntl()
  const { isOpen, dataUpload } = useSelector((state) => state.warning)
  const dispatch = useDispatch()

  function handleChangeOpen(value) {
    dispatch(handleChangeOpenImport(value))
  }

  function insertDocument(obj) {
    const newParams = {
      ...obj,
      crimeRecordTime: moment(obj.crimeRecordTime).subtract(1, 'days')
    }

    Service.send({
      method: 'POST',
      path: 'CustomerCriminalRecord/insert',
      data: newParams,
      query: null
    }).then((res) => {
      if (res.statusCode === 200) {
        toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "add_warning" }) }))
      }
      if (res.statusCode !== 200) {
        toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'add_new' }) }))
      }

      setData(prev => {
        prev.shift();
        if (prev.length === 0) {
          setTimeout(() => {
            window.location = '/pages/warning'
          }, 2000)
        }
        return [...prev]
      })
    })
  }

  useEffect(() => {
    if (dataUpload.length > 0) {
      setData((prev) => [...prev, ...dataUpload])
    }
  }, [dataUpload])

  useEffect(() => {
    if (data.length > 0) {
      setTimeout(() => {
        insertDocument(data[0])
      }, 100)
    } else {
      handleChangeOpen(false)
    }
  }, [data])

  if (!isOpen) {
    return <></>
  }

  return (
    <div className="documentary-popover">
      <div className="documentary-popover-header">
        <h3 className="documentary-popover-header-title">{intl.formatMessage({ id: 'warning' })}</h3>
        <div className="documentary-popover-header-action">
          <div className="documentary-popover-header-icon" onClick={() => setShowList((prev) => !prev)}>
            {showList ? <ChevronDown /> : <ChevronUp />}
          </div>
          <div className="documentary-popover-header-icon" onClick={() => handleChangeOpen(false)}>
            <X />
          </div>
        </div>
      </div>
      {showList && (
        <div className="documentary-popover-list">
          {data.length > 0 && (
            <>
              <PopoverImportItem status="import" name={data[0].customerRecordPlatenumber} />
              {data.slice(1, data.length).map((item, index) => (
                <PopoverImportItem key={index} name={item.customerRecordPlatenumber} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default PopoverImportWarning