import React from "react";
import { Card, Col, Label, Input, Button, Form } from "reactstrap";
import Select, { components } from "react-select";
import { selectThemeColors } from "@utils";
import { useForm } from "react-hook-form";
import { injectIntl } from "react-intl";
import Request from "../../../services/request";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import './index.scss';
import { ChevronLeft } from 'react-feather'

function RoleAdd({ intl }) {
  const history = useHistory();
  const [userData, setUserData] = React.useState({})
  const [isValid, setIsValid] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [role, setRole] = React.useState("");
  const [pems, setPems] = React.useState([]);
  const { register,errors, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {}
  })

  const permissions = data?.data?.map(item =>{
    return {
      ...item,
      value : item.permissionKey,
      label : intl.formatMessage({ id: item.permissionKey })
    }
  })
  function fetchData() {
    Request.send({
      method: "POST",
      path: "Permission/find",
    }).then((result) => {
      if (result && result.statusCode === 200) {
        const { data } = result;
        setData(data);
      }
    });
  }

  function addRole(data) {
    if(data?.permissions === undefined || data?.permissions?.length === 0){
      setIsValid(true)
      return null
    }
    if (/^\s*$/.test(data.pricePerTenant) || data.pricePerTenant === undefined) {
      toast.warn(intl.formatMessage({ id: 'please_name' }))
      return null
    }
    Request.send({
      method: "POST",
      path: "Role/insert",
      data: {
        roleName: data.pricePerTenant,
        permissions: data.permissions.join(",")
      }
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;

        history.push("/pages/account-admin");
        // if (statusCode === 200) {
        // } else {
        //   toast.warn(
        //     intl.formatMessage(
        //       { id: "actionFailed" },
        //       { action: intl.formatMessage({ id: "fetchData" }) }
        //     )
        //   );
        // }
      }
    });
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
  }

  return (
    <React.Fragment>
      <Card className="px-2 pb-2">
      <div className="pt-1 pl-1 pointer" onClick={() => {
        history.push('/pages/account-admin?tab=2')
        }}>
          <ChevronLeft />
          {intl.formatMessage({ id: 'goBack' })}
        </div>
        <center>
          <h3 className="pt-2">Thêm vai trò</h3>
        </center>
        <Form
              onSubmit={handleSubmit((data) => {
                addRole({
                    pricePerTenant : userData.pricePerTenant,
                    permissions: userData.permissions,
                  })
              })}>
        <Col className="mb-1" md="12" sm="12">
          <Label>Tên vai trò</Label>
          <Input
            id="pricePerTenant"
            name="pricePerTenant"
            placeholder={"Nhập tên vai trò"}
            type="text"
            value={userData.pricePerTenant || ''}
            onChange={(e) => {
              const { name, value } = e.target
              handleOnchange(name, value)
            }} />
        </Col>
        <Col className="mb-1" md="12" sm="12">
          <Label>Quyền</Label>
          <Select
            isClearable={false}
            theme={selectThemeColors}
            isMulti
            name="permissions"
            options={permissions}
            className="reacts-select"
            classNamePrefix="select"
            placeholder="Chọn quyền"
            onChange={(e) => {
              setIsValid(false)
              handleOnchange("permissions", e.map(per => per.value))
            }}
          />
          {isValid && <p style={{ color : 'red'}}>Chọn quyền</p>}
        </Col>

        <Col className="mb-1" md="2" sm="2">
          <Button.Ripple
            className="mr-1"
            color="primary"
            type="submit"
            // onClick={addRole}
          >
            {intl.formatMessage({ id: "submit" })}
          </Button.Ripple>
        </Col>
        </Form>
      </Card>
    </React.Fragment>
  );
}

export default injectIntl(RoleAdd);
