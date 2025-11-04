// @ts-nocheck
// ** React Imports
import { Fragment, useEffect, memo, useState } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import _ from "lodash";
import "./index.scss";
import { useForm } from "react-hook-form";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "uppy/dist/uppy.css";
import "@uppy/status-bar/dist/style.css";
import "@styles/react/libs/file-uploader/file-uploader.scss";
import {
  Card,
  Input,
  Label,
  Row,
  Col,
  FormGroup,
  Form,
  Button
} from "reactstrap";
import { useLocation } from "react-router-dom";
import { injectIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { ChevronLeft } from "react-feather";
import Service from "../../../services/request";
import StationFunctions from '../../../services/StationFunctions'

const FormVNpay = ({ intl }) => {
  // ** Store Vars
  const { state } = useLocation();
  const history = useHistory();
  const [stationVNPayData, setStationVNPayData] = useState({})
  const { register, errors, handleSubmit } = useForm({
    defaultValues: stationVNPayData,
    values: stationVNPayData
  });

  function getDataStationVNPay(stationsId) {
    StationFunctions.getDataStationVNPay({
      stationsId: stationsId,
    },).then((res) => {
      if (res) {
        const { data, statusCode } = res;
        if (statusCode === 200) {
          setStationVNPayData(data);
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "fetchData" }) }
            )
          );
        }
      }
    });
  }

  useEffect(() => {
    if (state && Object.keys(state).length > 0) {
      getDataStationVNPay(state.stationsId)
    }
  }, [state]);

  function handleUpdateData(data) {
    for (let key in data) {
      if (!data[key]) {
        delete data[key]
      }
    }

    StationFunctions.handleInsertOrUpdate({
      ...data,
      stationsId: state.stationsId
    }).then((res) => {
      if (res) {
        const { statusCode } = res;
        if (statusCode === 200) {
          toast.success(
            intl.formatMessage(
              { id: "actionSuccess" },
              { action: intl.formatMessage({ id: "update" }) }
            )
          );
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "fetchData" }) }
            )
          );
        }
      }
    });
  }

  return (
    <Fragment>
      <Card>
        <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: "goBack" })}
        </div>

        <div className="accountAdmin">
          <h1 className="accountAdmin__title">
            {intl.formatMessage({ id: "info" }, { type: "VNPay" }).toUpperCase()}
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
                <div className="h3 mb-3">Thông tin thanh toán tự động</div>
                <FormGroup row>
                  <Label sm="4" for="vnpayQRSecret">
                    VnpayQRSecret
                  </Label>
                  <Col sm="5">
                    <Input
                      name="vnpayQRSecret"
                      id="vnpayQRSecret"
                      defaultValue={stationVNPayData.vnpayQRSecret}
                      innerRef={register()}
                      invalid={errors.vnpayQRSecret}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="4" for="vnpayQRTMNCode">
                    VnpayQRTMNCode
                  </Label>
                  <Col sm="5">
                    <Input
                      name="vnpayQRTMNCode"
                      id="vnpayQRTMNCode"
                      defaultValue={stationVNPayData.vnpayQRTMNCode}
                      innerRef={register()}
                      invalid={errors.vnpayQRTMNCode}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="4" for="vnpayQRRedirectURL">
                    VnpayQRTMNCode
                  </Label>
                  <Col sm="5">
                    <Input
                      name="vnpayQRRedirectURL"
                      id="vnpayQRRedirectURL"
                      defaultValue={stationVNPayData.vnpayQRRedirectURL}
                      innerRef={register()}
                      invalid={errors.vnpayQRRedirectURL}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="4" for="vnpayQRBankCode">
                    VnpayQRBankCode
                  </Label>
                  <Col sm="5">
                    <Input
                      name="vnpayQRBankCode"
                      id="vnpayQRBankCode"
                      defaultValue={stationVNPayData.vnpayQRBankCode}
                      innerRef={register()}
                      invalid={errors.vnpayQRBankCode}
                    />
                  </Col>
                </FormGroup>

                <div className="h3 my-3">Thông tin tạo mã QR động</div>
                <FormGroup row>
                  <Label sm="4" for="vnpayQROfflineMerchantCode">
                    VnpayQROfflineMerchantCode
                  </Label>
                  <Col sm="5">
                    <Input
                      name="vnpayQROfflineMerchantCode"
                      id="vnpayQROfflineMerchantCode"
                      defaultValue={stationVNPayData.vnpayQROfflineMerchantCode}
                      innerRef={register()}
                      invalid={errors.vnpayQROfflineMerchantCode}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="4" for="vnpayQROfflineMerchantName">
                    VnpayQROfflineMerchantName
                  </Label>
                  <Col sm="5">
                    <Input
                      name="vnpayQROfflineMerchantName"
                      id="vnpayQROfflineMerchantName"
                      defaultValue={stationVNPayData.vnpayQROfflineMerchantName}
                      innerRef={register()}
                      invalid={errors.vnpayQROfflineMerchantName}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="4" for="vnpayQROfflineMerchantType">
                    VnpayQROfflineMerchantType
                  </Label>
                  <Col sm="5">
                    <Input
                      name="vnpayQROfflineMerchantType"
                      id="vnpayQROfflineMerchantType"
                      defaultValue={stationVNPayData.vnpayQROfflineMerchantType}
                      innerRef={register()}
                      invalid={errors.vnpayQROfflineMerchantType}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="4" for="vnpayQROfflineTerminalId">
                    VnpayQROfflineTerminalId
                  </Label>
                  <Col sm="5">
                    <Input
                      name="vnpayQROfflineTerminalId"
                      id="vnpayQROfflineTerminalId"
                      defaultValue={stationVNPayData.vnpayQROfflineTerminalId}
                      innerRef={register()}
                      invalid={errors.vnpayQROfflineTerminalId}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="4" for="vnpayQROfflineAppId">
                    VnpayQROfflineAppId
                  </Label>
                  <Col sm="5">
                    <Input
                      name="vnpayQROfflineAppId"
                      id="vnpayQROfflineAppId"
                      defaultValue={stationVNPayData.vnpayQROfflineAppId}
                      innerRef={register()}
                      invalid={errors.vnpayQROfflineAppId}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="4" for="vnpayQROfflineMasterCode">
                    VnpayQROfflineMasterCode
                  </Label>
                  <Col sm="5">
                    <Input
                      name="vnpayQROfflineMasterCode"
                      id="vnpayQROfflineMasterCode"
                      defaultValue={stationVNPayData.vnpayQROfflineMasterCode}
                      innerRef={register()}
                      invalid={errors.vnpayQROfflineMasterCode}
                    />
                  </Col>
                </FormGroup>


                <FormGroup row>
                  <Label sm="4" for="vnpayQROfflineCreateQRSecret">
                    VnpayQROfflineCreateQRSecret
                  </Label>
                  <Col sm="5">
                    <Input
                      name="vnpayQROfflineCreateQRSecret"
                      id="vnpayQROfflineCreateQRSecret"
                      defaultValue={stationVNPayData.vnpayQROfflineCreateQRSecret}
                      innerRef={register()}
                      invalid={errors.vnpayQROfflineCreateQRSecret}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="4" for="vnpayQROfflineUpdatePaymentSecret">
                    VnpayQROfflineUpdatePaymentSecret
                  </Label>
                  <Col sm="5">
                    <Input
                      name="vnpayQROfflineUpdatePaymentSecret"
                      id="vnpayQROfflineUpdatePaymentSecret"
                      defaultValue={stationVNPayData.vnpayQROfflineUpdatePaymentSecret}
                      innerRef={register()}
                      invalid={errors.vnpayQROfflineUpdatePaymentSecret}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label sm="4" for="vnpayQROfflineChecktransSecret">
                    VnpayQROfflineChecktransSecret
                  </Label>
                  <Col sm="5">
                    <Input
                      name="vnpayQROfflineChecktransSecret"
                      id="vnpayQROfflineChecktransSecret"
                      defaultValue={stationVNPayData.vnpayQROfflineChecktransSecret}
                      innerRef={register()}
                      invalid={errors.vnpayQROfflineChecktransSecret}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="4" for="vnpayQROfflineRefundSecret">
                    VnpayQROfflineRefundSecret
                  </Label>
                  <Col sm="5">
                    <Input
                      name="vnpayQROfflineRefundSecret"
                      id="vnpayQROfflineRefundSecret"
                      defaultValue={stationVNPayData.vnpayQROfflineRefundSecret}
                      innerRef={register()}
                      invalid={errors.vnpayQROfflineRefundSecret}
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Button
                    outline
                    className="mx-2"
                    onClick={history.goBack}
                  >{intl.formatMessage({ id: 'cancel' })}</Button>
                  <Button.Ripple type="submit" color="primary">{intl.formatMessage({ id: 'submit' })}</Button.Ripple>
                </FormGroup>

              </Form>
            </Col>
          </Row>
        </div>
      </Card>
    </Fragment >
  );
};
export default injectIntl(memo(FormVNpay));
