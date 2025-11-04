// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import _ from "lodash";
import "./index.scss";
import { useForm } from "react-hook-form";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Service from "../../../services/request";
import "uppy/dist/uppy.css";
import "@uppy/status-bar/dist/style.css";
import "@styles/react/libs/file-uploader/file-uploader.scss";
import {
  Card,
  Input,
  Label,
  Row,
  Col,
  Button,
  FormGroup,
  Form,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useLocation } from "react-router-dom";
import { injectIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import MySwitch from "../../components/switch/index";
import { ChevronLeft } from "react-feather";
import StationFunctions from '../../../services/StationFunctions'

const FormZNS = ({ intl }) => {
  // ** Store Vars
  const { state } = useLocation();
  const [userData, setUserData] = useState({});
  const [useUserZNSBrandConfig, setUseUserZNSBrandConfig] = useState(0);
  const [stationEnableUseZNS, setStationEnableUseZNS] = useState(0);
  const [isOpenModalTestZNS, setIsOpenModalTestZNS] = useState(false);
  const history = useHistory();
  const { register, errors, handleSubmit, setError } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    if (state && Object.keys(state).length > 0) {
      const stationCustomZNSConfig = state.stationCustomZNSConfig
        ? JSON.parse(state.stationCustomZNSConfig)
        : {};
      setUserData(stationCustomZNSConfig);
      setStationEnableUseZNS(state.stationEnableUseZNS);
      setUseUserZNSBrandConfig(state.stationUseCustomZNS);
    }
  }, [state]);

  function handleUpdateData(data) {
    if (stationEnableUseZNS === 1) {
      if (Object.keys(errors).length === 0) {
        let params = {
          stationsId: state.stationsId,
          znsProvider: userData.znsProvider,
        };
  
        if (useUserZNSBrandConfig === 1) {
          const branchParams = {
            znsBrand: data.znsBrand,
            znsToken: data.znsToken,
          }
          params = {...params, ...branchParams};
        }
  
        StationFunctions.handleUpdateConfigZNS(params).then((res) => {
          if (res) {
            const { statusCode } = res;
            if (statusCode === 200) {
              toast.success(
                intl.formatMessage(
                  { id: "actionSuccess" },
                  { action: intl.formatMessage({ id: "update" }) }
                )
              );
              setTimeout(() => {
                history.push("/pages/integrated");
              }, 1000);
            } else {
              toast.warn(
                intl.formatMessage(
                  { id: "actionFailed" },
                  { action: intl.formatMessage({ id: "update" }) }
                )
              );
            }
          }
        });
      }
    } else {
      toast.success(
        intl.formatMessage(
          { id: "actionSuccess" },
          { action: intl.formatMessage({ id: "update" }) }
        )
      );
      setTimeout(() => {
        history.push("/pages/integrated");
      }, 1000);
    }
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const onChangeUseCustomZNSBrand = (newValue) => {
    StationFunctions.handleUpdateData(
      {
        id: state.stationsId,
        data: {
          stationUseCustomZNS: newValue,
        }
      }).then((res) => {
      if (res) {
        const { statusCode } = res;
        if (statusCode === 200) {
          setUseUserZNSBrandConfig(newValue);
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "update" }) }
            )
          );
        }
      }
    });
  };

  const onUpdateStationEnableUseZNS = (newValue) => {
    StationFunctions.handleUpdateData( {
      id: state.stationsId,
      data: {
        stationEnableUseZNS: newValue,
      },
    }).then((res) => {
      if (res) {
        const { statusCode } = res;
        if (statusCode === 200) {
          setStationEnableUseZNS(newValue);
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "update" }) }
            )
          );
        }
      }
    });
  };

  function handleSelectZNSType(e) {
    const { value } = e.target;
    setUserData({
      ...userData,
      ['znsProvider']: value
    });
  }

  function handleSendTestZNS(value) {
    const params = {
      phoneNumber: value,
      znsConfig: {
        znsBrand: userData.znsBrand,
        znsToken: userData.znsToken,
        znsProvider: userData.znsProvider,
      },
    };
    // if (znsType === "") {
    //   params.znsConfig.znsProvider = userData.znsProvider;
    // }
    StationFunctions.handleSendTestZNS(params).then((result) => {
      if (result && result.statusCode === 200) {
        toast.success(intl.formatMessage({ id: "sent" }, { type: "" }));
        setIsOpenModalTestZNS(false);
      } else {
        toast.error(
          intl.formatMessage({ id: "sendZNSTestFailed" }, { type: "" })
        );
      }
    });
  }

  const isEnableZNSAndBranch =
    useUserZNSBrandConfig === 1 && stationEnableUseZNS === 1;

  return (
    <Fragment>
      <Card>
        <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: "goBack" })}
        </div>
        <div className="accountAdmin">
          <h1 className="accountAdmin__title">
            {intl.formatMessage({ id: "info" }, { type: "ZNS" }).toUpperCase()}
          </h1>
          <Row>
            <Col sm="12" md="8">
              <Form
                onSubmit={handleSubmit((data) => {
                  handleUpdateData({
                    ...data,
                  });
                })}
              >
                <FormGroup row>
                  <Label sm="3">
                    ZNS Enable
                  </Label>
                  <Col sm="9">
                    <MySwitch
                      checked={stationEnableUseZNS === 1 ? true : false}
                      onChange={(e) => {
                        onUpdateStationEnableUseZNS(e.target.checked ? 1 : 0);
                      }}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for="znsProvider">
                    {intl.formatMessage({ id: "supplier" }, { type: "ZNS" })}
                  </Label>
                  <Col sm="5">
                    <Input
                      className="w-100"
                      id="znsProvider"
                      type="select"
                      invalid={errors.znsProvider}
                      innerRef={register({ required: stationEnableUseZNS === 1 })}
                      name="znsProvider"
                      bsSize="sm"
                      value={userData.znsProvider}
                      onChange={handleSelectZNSType}
                      disabled={stationEnableUseZNS === 1 ? false : true}
                    >
                      <option value="">
                        {intl.formatMessage({ id: "selectService" })}
                      </option>
                      <option value="VMG">VMG</option>
                    </Input>
                  </Col>
                  <Col sm="4" />
                </FormGroup>

                <div className="row">
                  <Label sm="3">
                    {intl.formatMessage(
                      { id: "stationUseCustomZNSBrand" },
                      { type: "ZNS Brandname" }
                    )}
                  </Label>

                  <Col sm="9">
                    <MySwitch
                      checked={useUserZNSBrandConfig === 1 ? true : false}
                      onChange={(e) => {
                        if (userData.znsProvider) {
                          onChangeUseCustomZNSBrand(e.target.checked ? 1 : 0);
                        } else {
                          setError("znsProvider", { type: "focus" }, { shouldFocus: true });
                        }
                      }}
                      disabled={stationEnableUseZNS === 1 ? false : true}
                    />
                  </Col>
                </div>

                <FormGroup row>
                  <Label sm="3" for="znsBrand">
                    {intl.formatMessage({ id: "znsBrand" })}
                  </Label>

                  <Col sm="5">
                    <Input
                      name="znsBrand"
                      id="znsBrand"
                      disabled={!isEnableZNSAndBranch}
                      innerRef={register({
                        required: isEnableZNSAndBranch,
                      })}
                      invalid={errors.znsBrand}
                      value={(userData && userData.znsBrand) || ""}
                      placeholder={intl.formatMessage({ id: "znsBrand" })}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleOnchange(name, value);
                      }}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: KiemDinhOto</i>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="3" for="znsToken">
                    {intl.formatMessage({ id: "znsToken" })}
                  </Label>
                  <Col sm="5">
                    <Input
                      name="znsToken"
                      id="znsToken"
                      disabled={!isEnableZNSAndBranch}
                      innerRef={register({
                        required: isEnableZNSAndBranch,
                      })}
                      invalid={errors.znsToken}
                      value={(userData && userData.znsToken) || ""}
                      placeholder={intl.formatMessage({ id: "znsToken" })}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleOnchange(name, value);
                      }}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: XXX....</i>
                  </Col>
                </FormGroup>
                <div className="row m-0 mt-3">
                  <FormGroup className="p-0 col-12 col-sm-3">
                    <Button.Ripple
                      className="w-100"
                      color="primary"
                      type="submit"
                    >
                      {intl.formatMessage({ id: "submit" })}
                    </Button.Ripple>
                  </FormGroup>
                  <div className="col-1" />
                  {isEnableZNSAndBranch && (
                    <FormGroup className="col-12 col-sm-3 p-0">
                      <Button.Ripple
                        className="w-100"
                        color="primary"
                        onClick={() => setIsOpenModalTestZNS(true)}
                      >
                        Test ZNS
                      </Button.Ripple>
                    </FormGroup>
                  )}
                </div>
              </Form>
            </Col>
          </Row>
        </div>
      </Card>

      <Modal
        isOpen={isOpenModalTestZNS}
        toggle={() => setIsOpenModalTestZNS(!isOpenModalTestZNS)}
      >
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            const input = document.getElementById("testZNS");
            if (input.value) {
              handleSendTestZNS(input.value);
            }
          }}
        >
          <ModalHeader
            toggle={() => setIsOpenModalTestZNS(!isOpenModalTestZNS)}
          >
            {intl.formatMessage({ id: "checkZNS" })}
          </ModalHeader>
          <ModalBody>
            <label htmlFor="testZNS">
              {intl.formatMessage({ id: "enterPhoneSendZNS" })}
            </label>
            <FormGroup>
              <Input
                name="testZNS"
                id="testZNS"
                placeholder="Nhập SĐT"
                type="ZNS"
                required
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <FormGroup>
              <Button color="primary" type="submit">
                {intl.formatMessage({ id: "send" })}
              </Button>
            </FormGroup>
          </ModalFooter>
        </Form>
      </Modal>
    </Fragment>
  );
};
export default injectIntl(memo(FormZNS));
