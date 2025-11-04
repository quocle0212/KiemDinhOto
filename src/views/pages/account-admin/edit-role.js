/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useEffect } from 'react'
// ** Custom Components
import './index.scss'
import { useHistory } from 'react-router-dom'
import Service from '../../../services/request'
import Breadcrumbs from '@components/breadcrumbs'
// ** Third Party Components
import { toast } from 'react-toastify';
import { Lock } from 'react-feather'
import { Row, Col, Button, Card, Table, CustomInput, Input, Form, FormGroup, Label } from 'reactstrap'
import AdminService from '../../../services/adminService'
import addKeyLocalStorage from '../../../helper/localStorage'

const UserAccountTab = (props) => {
  const id = props.match.params ? props.match.params.id : null
  const [listPermission, setListPermission] = useState([])
  const history = useHistory()
  const [role, setRole] = useState({
    roleName: '',
    permission: []
  })
  function getData() {
    const newParams = {
      filter: {

      },
      skip: 0,
      limit: 100,
    }

    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");

      AdminService.handlePermission(newParams,newToken ).then(res => {
        if (res) {
          const { data, message } = res

          if (data) {

            setListPermission([...data.data])
          } else {
            toast.warn(message || 'Something was wrong!')
          }
        }
      })
    } else {
      window.localStorage.clear()
    }
  }


  useEffect(() => {
    getData()
    if (id) {
      const data = props.location.state.data || {}
      role.roleName = data.roleName
      role.permission = data.permissions.split(',')
      setRole({
        ...role
      })
    }
  }, [])

  function handleRenderTable() {
    const newData = []
    let tmp = []
    for (let i = 0; i < listPermission.length; i++) {
      tmp.push(listPermission[i])

      if ((i % 4 === 0 && i !== 0) || i + 1 === listPermission.length) {
        if (tmp.length < 4) {
          const fillLength = 4 - tmp.length
          for (let j = 0; j < fillLength; j++) {
            tmp.push({})
          }
        }
        newData.push(tmp)
        tmp = []
      }
    }

    return (
      <>
        {newData.map(el => {
          return (
            <tr>
              {
                el && el.map(item => {
                  const valueCheck = role.permission.includes(item.permissionKey)
                  return (
                    <>
                      {item.permissionKey ?
                        <td>
                          <CustomInput onChange={(e) => {
                            const { checked } = e.target
                            if (checked && !valueCheck) {
                              role.permission.push(item.permissionKey)

                            } else {
                              const newRole = role.permission.filter(el2 => el2 !== item.permissionKey)
                              role.permission = newRole
                            }
                            setRole({
                              ...role
                            })
                          }}
                            type='checkbox'
                            checked={valueCheck}
                            id={item.permissionKey}
                            label={item.permissionName}
                          />
                        </td> :
                        <td></td>
                      }
                    </>
                  )
                })
              }
            </tr>
          )
        })}
      </>
    )
  }

  function handleSubmit() {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    let path = 'Role/insert'
    const permissions = role.permission.join(',')
    let newParams = {
      roleName: role.roleName,
      permissions
    }
    if (id) {
      path = 'Role/updateById'
      newParams = {
        id,
        data: newParams
      }
    }

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path, data: newParams, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, message } = res
          if (statusCode === 200 || statusCode === 201) {
            toast.success(`${id ? 'Update' : 'Create'} role successfully`)
          } else {
            toast.warn(message || 'Something was wrong!')
          }
        }
      })
    } else {
      window.localStorage.clear()
    }
  }

  return (
    <>
      <Card className="accountAdmin" >
        <Breadcrumbs onClickParent={() => {
          history.push(`/pages/account-admin`)
        }} breadCrumbTitle='Role' />
        <Row>
          <Col sm='12'>
            <Form onSubmit={e => e.preventDefault()}>
              <Row>
                <Col md='4' sm='12'>
                  <FormGroup>
                    <Label for='roleName'>Role Name</Label>
                    <Input onChange={(e) => {
                      const { value } = e.target
                      role.roleName = value
                      setRole({
                        ...role
                      })
                    }} value={role.roleName} type='text' id='roleName' placeholder='Role Name' />
                  </FormGroup>
                </Col>

                <Col sm='12'>
                  <div className='permissions border mt-1'>
                    <h6 className='py-1 mx-1 mb-0 font-medium-2'>
                      <Lock size={18} className='mr-25' />
                      <span className='align-middle'>{id ? 'Edit' : 'Add'} Permissions</span>
                    </h6>
                    <Table borderless striped responsive>

                      <tbody>
                        {
                          handleRenderTable()
                        }

                      </tbody>
                    </Table>
                  </div>
                </Col>
                <Col className='d-flex flex-sm-row flex-column mt-2' sm='12'>
                  <Button.Ripple onClick={() => { handleSubmit() }} className='mb-1 mb-sm-0 mr-0 mr-sm-1' type='submit' color='primary'>
                    Save Changes
                  </Button.Ripple>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </>
  )
}
export default UserAccountTab
