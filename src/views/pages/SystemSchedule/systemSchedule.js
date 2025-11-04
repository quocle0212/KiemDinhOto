import '@styles/react/libs/tables/react-dataTable-component.scss'
import React, { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit } from 'react-feather'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Card, Form, FormGroup, Input, Modal, ModalBody, ModalHeader } from 'reactstrap'
import addKeyLocalStorage from '../../../helper/localStorage'
import SystemConfigurationsService from '../../../services/SystemConfigurationsService'
import MySwitch from '../../components/switch'

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 50
}

const SystemSchedule = ({ intl }) => {
  const history = useHistory()
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState([])
  const [openOne, setOpenOne] = useState(false)
  const [update, setUpdate] = useState(0)

  // ** React hook form vars
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })

  const onUpdateEnableUse = (dataUpdate) => {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      SystemConfigurationsService.handleUpdateSystemSetting(dataUpdate, newToken).then((res) => {
        if (res) {
          const { statusCode } = res
          if (statusCode === 200) {
            getData(paramsFilter)
            toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
          }
        }
      })
    }
  }

  const columns = [
    {
      name: intl.formatMessage({ id: 'feature' }),
      minWidth: '450px',
      maxWidth: '700px',
      cell: (row) => {
        const { note } = row
        return (
          <div className="text-table">
            <span>{note.replaceAll('( ', '(').replaceAll(' )', ')')}</span>
          </div>
        )
      }
    },
  {
   name: intl.formatMessage({ id: 'on/off' }),
   center: true,
   minWidth: '150px',
   maxWidth: '150px',
   cell: (row) => {
     const { key, value } = row;
    
     if (key === 'ALLOW_TODAY_BOOKING_APPOINTMENTS') {
       let inputRef = null;
      
       return (
         <Input
           type="number"
           min={0}
           max={60}
           defaultValue={value ?? ''}
           placeholder="0-60"
           innerRef={(ref) => {
             inputRef = ref;
           }}
           onKeyDown={(e) => {
             if (e.key === 'Enter') {
               let raw = inputRef?.value;
              
               if (raw === '') {
                 onUpdateEnableUse({
                   id: key,
                   data: { value: null }
                 });
                 return;
               }
              
               let parsed = parseInt(raw);
              
               if (isNaN(parsed)) return;
              
               if (parsed < 0) parsed = 0;
               if (parsed > 60) parsed = 60;
              
               // Cập nhật lại giá trị trong input luôn
               inputRef.value = parsed;
              
               onUpdateEnableUse({
                 id: key,
                 data: { value: parsed }
               });
             }
           }}
         />
       );
     }
    
     return (
       <MySwitch
         checked={value === 1}
         onChange={(e) => {
           onUpdateEnableUse({
             id: key,
             data: {
               value: e.target.checked ? 1 : 0
             }
           });
         }}
       />
     );
   }
  },
    {
      name: intl.formatMessage({ id: 'edit_name_feature' }),
      selector: 'action',
      center: true,
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        return (
          <>
            <div
              href="/"
              className="pointer"
              onClick={() => {
                setOpenOne(true)
                setUpdate(row)
              }}>
              <Edit className="pointer" size={15} />
            </div>
          </>
        )
      }
    }
  ]

  function getData(params) {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      SystemConfigurationsService.getSystemSetting(params, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          if (statusCode === 200) {
            setItems(data)
          } else {
            toast.warn(intl.formatMessage({ id: 'no_data' }))
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

  return (
    <Fragment>
      <Card>
        <div className="mx-0 mb-50">
          <DataTable
            noHeader
            // pagination
            paginationServer
            className="react-dataTable"
            columns={columns}
            sortIcon={<ChevronDown size={10} />}
            data={items}
            progressPending={isLoading}
          />
        </div>
      </Card>
      <Modal isOpen={openOne} toggle={() => setOpenOne(false)} size="md" className={`modal-dialog-centered `}>
        <ModalHeader toggle={() => setOpenOne(false)}>{intl.formatMessage({ id: 'edit_name_feature' })}</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
            })}>
            <FormGroup>
              <Input
                name="reason"
                type="textarea"
                rows={5}
                className="mb-2"
                innerRef={register({ required: true })}
                invalid={errors.username && true}
                value={update.note}
                onChange={(e) => setUpdate({ ...update, note: e.target.value })}
              />
            </FormGroup>
            <FormGroup className="d-flex justify-content-center">
              <Button.Ripple
                className="mr-1"
                color="info"
                onClick={() => {
                  if (update.note === '') {
                    toast.warn(intl.formatMessage({ id: 'isRequired' }))
                  } else {
                    onUpdateEnableUse({
                    id: update.key,
                    data: { note: update.note }
                    })
                    setOpenOne(false)
                  }
                }}>
                {intl.formatMessage({ id: 'submit' })}
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default injectIntl(memo(SystemSchedule))
