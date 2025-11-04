import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, ChevronLeft } from 'react-feather'
import { injectIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { toast } from 'react-toastify'
import { Card, Col, Input, Label } from 'reactstrap'
import Request from '../../../services/request'
import { getAllPermissionFormatArray } from '../../../constants/permission'

function RoleAdd({ intl }) {
  const history = useHistory()
  const { state } = useLocation()
  const [total, setTotal] = useState(20)
  const [data, setData] = React.useState(getAllPermissionFormatArray())
  
  const [role, setRole] = React.useState('')
  const [list, setList] = React.useState([])
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [items, setItems] = useState([])

  const DefaultFilter = {
    filter: {
      roleName : state.data.roleName
    }
  }

  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'permission' }),
      sortable: true,
      maxWidth: '300px',
      cell : (row) =>{
        const permissionName = row?.label
        return (
          <>{permissionName}</>
        )
      }
    },
    {
      name: '',
      center: true,
      maxWidth: '200px',
      cell: (row) => {
        const permissionKey = row?.value
        const isChecked = list[0]?.permissions.split(',').indexOf(permissionKey) > -1
        return (
          <>{ 
            <Input 
            checked={isChecked}
            type="checkbox" 
            onChange={(e) => {
              let permissionList = list[0]?.permissions.split(',')
              if (!e.target.checked) {
                permissionList = permissionList.filter(item => item !== permissionKey)
              } else {
                permissionList.push(permissionKey)
              }
              // console.log('new permissions', permissionList.join(','))
              updateRole(permissionList)
              // call API update role
              // nếu thành công thì call API get
              // nếu thất bại thì thông báo lỗi
            }}
            name={permissionKey}
            />
          }
          </>
        )
      }
    }
  ]

  function fetchData() {
    Request.send({
      method: 'POST',
      path: 'Permission/find'
    }).then((result) => {
      if (result && result.statusCode === 200) {
        const { data } = result
        // setData(data.data)
        setTotal(data.total)
      }
    })
  }

  function fetchListData() {
    Request.send({
      method: 'POST',
      path: 'Role/find',
      data : DefaultFilter,
    }).then((result) => {
      if (result && result.statusCode === 200) {
        const { data } = result
        setList(data.data)
      }
    })
  }

  function updateRole(permissionList) {
    Request.send({
      method: 'POST',
      path: 'Role/updateById',
      data: {
        id: state?.data?.roleId,
        data: {
          roleName: state.data.role,
          permissions: permissionList.join(",")
        }
      }
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        fetchListData()
        toast.success(
          intl.formatMessage(
            { id: "actionSuccess" },
            { action: intl.formatMessage({ id: "update" }) }
          )
        );

      }
    })
  }

  React.useEffect(() => {
    if (!state || !state.data) {
      history.push('/pages/account-admin')
    }
    fetchData()
    fetchListData()
    // setPems(state?.data?.permissions.split(','))
    // setRole(state?.data?.roleName)
  }, [])

  const handlePerPage = (e) => {
    setCurrentPage(1)
    setRowsPerPage(parseInt(e.target.value))
  }

  const handlePagination = (page) => {
    const newParams = {
      skip: page.selected
    }
    fetchData(newParams)
    setCurrentPage(page.selected + 1)
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel="..."
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'}
      />
    )
  }

  return (
    <React.Fragment>
      <div className="pt-1 pl-1 pointer" onClick={() => {
        history.push('/pages/account-admin?tab=2')
      }}
        >
          <ChevronLeft />
          {intl.formatMessage({ id: 'goBack' })}
        </div>
      <Card className="px-2 pb-2">
        <center>
          <h3 className="pt-2">Sửa vai trò</h3>
        </center>
        <Col className="mb-1" md="12" sm="12">
          <Label>Tên vai trò</Label>
          <Input
            id="pricePerTenant"
            name="pricePerTenant"
            placeholder={'Nhập tên vai trò'}
            type="text"
            value={role}
            onChange={(e) => {
              setRole(e.target.value)
            }}
          />
        </Col>
        <Col className="mb-1" md="12" sm="12">
          <DataTable
            noHeader
            //pagination
            paginationServer
            className="react-dataTable"
            columns={serverSideColumns}
            sortIcon={<ChevronDown size={10} />}
            //paginationComponent={CustomPagination}
            data={data}
          />
        </Col>
        {/* <Col className="mb-1" md="12" sm="12">
          <Label>Quyền</Label>
          <Select
            isClearable={false}
            theme={selectThemeColors}
            isMulti
            name="permissions"
            options={permissions}
            className="react-select"
            classNamePrefix="select"
            placeholder="Chọn quyền"
            onChange={(e) => {
              setPems(e.map(per => per.value))
            }}
            defaultValue={pems}
            value={pems.map(p => {
                return {value: p, label: p}
            })}
          />
        </Col> */}

        {/* <Col className="mb-1" md="2" sm="2">
          <Button.Ripple disabled={!role} className="mr-1" color="primary" type="button" onClick={updateRole}>
            {intl.formatMessage({ id: 'submit' })}
          </Button.Ripple>
        </Col> */}
      </Card>
    </React.Fragment>
  )
}

export default injectIntl(RoleAdd)
