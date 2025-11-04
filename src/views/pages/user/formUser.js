import React, { Fragment, memo, useEffect, useState } from "react";
import { ChevronLeft } from "react-feather";
import { useForm } from "react-hook-form";
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardImg,
  CardText,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import UserService from '../../../services/userService';
import BasicAutoCompleteDropdown from "../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown";
import ListSchedule from "./listSchedule";
import ListVehicle from "./listVehicle";

const FormUser = ({ intl }) => {
  const userCategory = [
    {value : 1, label : intl.formatMessage({ id: 'personal' })}, 
    {value : 2, label : intl.formatMessage({ id: 'company' })},
  ]
  const location = useLocation();
  const history = useHistory();
  const { userAvatar, username, appUserId, firstName, email, phoneNumber } =
    location.state;
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {},
  });
  const [userData, setUserData] = useState({});
  const [disabled, setDisabled] = useState(true)
  const [userDataTouched, setUserDataTouched] = useState({});

const getDetailUserById = (appUserId) =>{
  UserService.getDetailUserById({
    id : appUserId
  },).then((res) => {
    if (res) {
      const { statusCode, message, data } = res;
      if (statusCode === 200) {
        setUserData(data);
      } 
    }
  });
}

  function handleUpdateData(data) {
    let newdata={
      ...data,
      data:{
        ...data?.data,
        appUserCategory:userData?.appUserCategory
      }
    }
    UserService.updateUserById(newdata).then((res) => {
      if (res) {
        const { statusCode, error } = res;
        if (statusCode === 200) {
          // setUserData({});
          getDetailUserById(appUserId)
          toast.success(
            intl.formatMessage(
              { id: "actionSuccess" },
              { action: intl.formatMessage({ id: "update" }) }
            )
          );
        } else {
          if(error === 'DUPLICATE_EMAIL' && statusCode === 500){
            toast.error(<FormattedMessage id='error_email'/>)
          } else {
            toast.warn(
              intl.formatMessage(
                { id: "actionFailed" },
                { action: intl.formatMessage({ id: "update" }) }
              )
            );
          }
        }
      }
    });
    setDisabled(true)
  }
 
  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value,
    });
    setUserDataTouched({
      ...userDataTouched,
      [name]: value,
    })
    setDisabled(false)
  };

  useEffect(() => {
    getDetailUserById(appUserId)
  }, []);

  const onKeyDown = (e) =>{
    let key = e.keyCode
    if((key >= 48 && key <= 59) || (key >= 96 && key <= 105)){
       e.preventDefault()
    }
  }
  
  return (
    <Fragment>
      <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
        <ChevronLeft />
        {intl.formatMessage({ id: "goBack" })}
      </div>
      <Row>
        <Col className="col-sm-4 col-xs-12">
          <Card className="mt-4">
            <CardHeader className="justify-content-center flex-column">
              <CardImg
                className="mt-3"
                src={userData.userAvatar}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
              <CardText className="mt-2 h3">{userData.firstName}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit((data) => {
                  handleUpdateData({
                    id: appUserId,
                    data: userDataTouched,
                  });
                })}
              >
                <FormGroup>
                  <Label for="firstName">
                    {intl.formatMessage({ id: "firstName" })}
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    innerRef={register()}
                    invalid={errors.firstName && true}
                    value={userData.firstName || ""}
                    onKeyDown={(e) => onKeyDown(e)}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="email">
                    {intl.formatMessage({ id: "email" })}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    innerRef={register()}
                    invalid={errors.email && true}
                    value={userData.email || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="companyName">
                    {intl.formatMessage({ id: "companyName" })}
                  </Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    innerRef={register()}
                    invalid={errors.companyName && true}
                    value={userData.companyName || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="classify">
                    {intl.formatMessage({ id: "classify" })}
                  </Label>
                  <BasicAutoCompleteDropdown
                    name="appUserCategory"
                    id="appUserCategory"
                    placeholder={intl.formatMessage({ id: "classify" })}
                    options={userCategory}
                    value = {
                      userCategory.filter(option => 
                          option.value == userData.appUserCategory)
                    }
                    onChange={({value}) => {
                      handleOnchange('appUserCategory', value)
                    }}>
                  </BasicAutoCompleteDropdown>
                </FormGroup>

                <FormGroup>
                  <Label for="username">
                    {intl.formatMessage({ id: "username" })}
                  </Label>
                  <Input
                    id="username"
                    disabled
                    name="username"
                    innerRef={register({ required: true })}
                    invalid={errors.username && true}
                    value={userData.username || ""}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="phoneNumber">
                    {intl.formatMessage({ id: "phoneNumber" })}
                  </Label>
                  <Input
                    innerRef={register()}
                    invalid={errors.phoneNumber && true}
                    name="phoneNumber"
                    options={{ phone: true, phoneRegionCode: "VI" }}
                    value={userData?.phoneNumber?.substring(0, 5) + '*****' || ""}
                    // type='number'
                    disabled
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleOnchange(name, value);
                    }}
                  />
                </FormGroup>

                <FormGroup className="d-flex mb-0 justify-content-center">
                  <Button.Ripple className="mr-1" color="primary" type="submit" disabled={disabled}>
                    {intl.formatMessage({ id: "submit" })}
                  </Button.Ripple>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col className="col-sm-7 col-xs-12">
          <Card className="mt-4 col-xs-12">
              <ListSchedule appUserId={appUserId}/>
              <ListVehicle appUserId={appUserId}/>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default injectIntl(memo(FormUser));
