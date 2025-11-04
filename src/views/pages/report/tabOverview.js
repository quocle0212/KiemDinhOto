// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import { Home, Settings, EyeOff, User, Calendar, HardDrive, Cpu } from 'react-feather'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import _ from "lodash";
import "./index.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Service from "../../../services/request";
import TabStations from './tabStations'
import {
  Card,
  CardHeader,
  CardBody,
  CardText,
  Input,
  Label,
  Row,
  Col,
} from "reactstrap";

import { injectIntl } from "react-intl";
import TopStation from "./TopStation";
import NotActiveStation from "./NotActiveStation";
import ReportService from '../../../services/reportService'
import { kFormatter } from '@utils'
import TotalActiveStation from '@src/views/ui-elements/cards/statistics/TotalActiveStation'
import TotalInActiveStation from '@src/views/ui-elements/cards/statistics/TotalInActiveStation'
import TotalUser from '@src/views/ui-elements/cards/statistics/TotalUser'
import TotalCompletedSchedule from '@src/views/ui-elements/cards/statistics/TotalCompletedSchedule'
import { readTotalSchedule } from "../../../helper/localStorage";
import { readAllStationsDataFromLocal } from "../../../helper/localStorage";

const DefaultFilter = {
};

const TabOverview = ({ intl, days, data }) => {
  // ** Store Vars
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const [scheduleByStation, setScheduleByStation] = useState([])
  const [active, setActive] = useState([])
  const [area, setArea] = useState([])
  const [notActive, setNotActive] = useState([])
  const listActive = active.slice(0, 10)
  const readLocal = readAllStationsDataFromLocal();
  const totalSchedule = readTotalSchedule()

  const DataScheduleByStation = (paramsFilter) => {

    ReportService.DataScheduleByStation(paramsFilter).then((result) => {
      if (result) {
        setScheduleByStation(result.data);
      }
    })
  }

  const DataActiveStation = (paramsFilter) => {
    ReportService.DataActiveStation(paramsFilter).then((result) => {
      if (result) {
        setActive(result.data);
      }
    })
  }

  const DataStationArea = (paramsFilter) => {
    ReportService.DataStationArea(paramsFilter).then((result) => {
      if (result) {
        setArea(result.data);
      }
    })
  }

  const DatanotActiveStation = (paramsFilter) => {
    ReportService.DatanotActiveStation(paramsFilter).then((result) => {
      if (result) {
        setNotActive(result.data);
      }
    })
  }

  // ** Get data on mount
  const readTotalUser = JSON.parse(localStorage.getItem("StorageDev_TotalUser"))
  // useEffect(() => {
  //   DatanotActiveStation(paramsFilter)
  //   DataActiveStation(paramsFilter)
  //   DataStationArea(paramsFilter)
  //   DataScheduleByStation(paramsFilter)
  // }, []);

  return (
    <Fragment>
      <Card className='background-color'>
        <CardHeader className="justify-content-center flex-column">
          <h1 className="">{intl.formatMessage({ id: 'application_report' })}</h1>
        </CardHeader>
        <CardBody className="justify-content-center flex-column mt-3">
          <Row>
            <Col lg='3' sm='6'>
              <TotalActiveStation data={readLocal || 0} kFormatter={kFormatter} />
            </Col>
            <Col lg='3' sm='6'>
              <TotalInActiveStation data={readLocal || 0} kFormatter={kFormatter} />
            </Col>
            <Col lg='3' sm='6'>
              <TotalUser data={readTotalUser} kFormatter={kFormatter} />
            </Col>
            <Col lg='3' sm='6'>
              <TotalCompletedSchedule data={totalSchedule} kFormatter={kFormatter} />
            </Col>
          </Row>
          <Row className='mt-3'>
          </Row>
          <Row className='mt-1'>
            <Col>
              <TopStation
                intl={intl}
                scheduleByStation={scheduleByStation}
                active={listActive}
                area={area}
              />
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col>
              <NotActiveStation intl={intl} notActive={notActive} />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default injectIntl(memo(TabOverview));
