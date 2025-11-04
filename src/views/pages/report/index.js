// @ts-nocheck
// ** React Imports
import React, { Fragment, useState, useEffect, memo, lazy, useCallback, useMemo } from "react";
// ** Store & Actions
import { Home, User, Calendar, Cpu, Map, Aperture, Codepen } from 'react-feather'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import TabOverview from './tabOverview'
import "./index.scss";
import TabSchedule from './tabSchedule'
import ProductivityTab from './Center/productivityTab'
import TabStaff from "./tabStaff";
import LineTab from "./Center/lineTab";
import {
    Row,
    Col,
} from "reactstrap";
import ReportService from '../../../services/reportService'
import { injectIntl } from "react-intl";
import moment from "moment";
import TabStations from './tabStations'
import { readAllStationsDataFromLocal } from "../../../helper/localStorage"
import ActiveCenter from "./Center/ActiveCenter";
import EnableBooking from "./Center/EnableBooking";
import Wattage from "./Center/Wattage";
import TypeSchedule from "./typeSchedule";
import Vehicle from "./vehicle";
import ServiceChart from "./service"
import TypeCar from "./typeCar";
import ReportUsers from "./user";
import Registry from "./Registry";
import ActivityStatic from "./activityStatic";
import OverviewActived from "../overviewActived";
import OverviewSchedule from "../overviewSchedule";
import OverviewCenter from "../overviewCenter";

const readLocal = readAllStationsDataFromLocal();
const DefaultFilter = {

};

const TabReport = ({ intl }) => {
    // ** Store Vars

    const [days, setDays] = useState([])
    let startDate = new Date();
    let endDate = new Date();
    startDate.setDate(startDate.getDate() - 4);
    endDate.setDate(endDate.getDate() + 2);

    const FILTER_SCHEDULE = {
        filter: {

        },
        startDate: moment(startDate).format("DD/MM/YYYY"),
        endDate: moment(endDate).format("DD/MM/YYYY"),
    }
   
    let tabOverview = '1'
    let tabStations = '2'
    let tabUser = '3'
    let schedules = '4'
    let tabVehicle = '5'
    let statusNew = 0
    let statusConfirmed = 10 
    let statusCanceled = 20 
    let statusClosed = 30  
    let tabCenter = '6'
    let tabRegistry = '7'
    let tabActivityStatistics = '8'
    let tabOverviewSchedules = '9'
    let tabOverviewActivate = '10'
    let tabOverviewCenter = '11'

    const [active, setActive] = useState(tabCenter)
    const [schedule, setSchedule] = useState([])
    const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
    const [total, setTotal] = useState()
    const [dayOverview, setDayOverview] = useState([])
    const [data, setData] = useState([]);
    const [totalConfirmedSchedule, setTotalConfirmedSchedule] = useState([])
    const [totalClosedSchedule, setTotalClosedSchedule] = useState([])
    const [totalNewSchedule, setTotalNewSchedule] = useState([])
    const [totalSchedule, setTotalSchedule] = useState([])

    const DataChartSchedule = (paramsFilter) => {
        ReportService.DataChart(paramsFilter).then((result) => {
            if (result) {
                setDayOverview(result.data);
            }
        })
    }

    const totalConfirmedScheduleHandler = (paramsFilter) => {
        const _paramsFilter = JSON.parse(JSON.stringify(paramsFilter));
        _paramsFilter.filter.CustomerScheduleStatus = statusConfirmed;

        ReportService.countScheduleByFilter(_paramsFilter).then((result) => {
            if (result) {
                setTotalConfirmedSchedule(result.total)
            }
        })
    }

    const totalCanceledScheduleHandler = (paramsFilter) => {
        const _paramsFilter = JSON.parse(JSON.stringify(paramsFilter));
        _paramsFilter.filter.CustomerScheduleStatus = statusNew;

        ReportService.countScheduleByFilter(_paramsFilter).then((result) => {
            if (result) {
                setTotalNewSchedule(result.total)
            }
        })
    }

    const totalClosedScheduleHandler = (paramsFilter) => {
        const _paramsFilter = JSON.parse(JSON.stringify(paramsFilter));
        _paramsFilter.filter.CustomerScheduleStatus = statusClosed;
        ReportService.countScheduleByFilter(_paramsFilter).then((result) => {
            if (result) {
                setTotalClosedSchedule(result.total)
            }
        })
    }

    const toggle = tab => {
        if (active !== tab) {
            setActive(tab)
        }
    }

    const totalStation = readLocal?.length || 0

    const totalOverload = useMemo(() => {
        let sum = 0;
        readLocal.reduce((acc, value) => {
            if (!value?.availableStatus) {
                sum++
            }
        }, 0)
        return sum
    }, [readLocal?.length])

    const totalActived = useMemo(() => {
        const totalActivedList = readLocal.filter(station => {
            const bookingConfig = station.stationBookingConfig || {};
            return bookingConfig.some(config => config.enableBooking);
        });
        return totalActivedList.length
    }, [readLocal?.length])

    const totalWorked = useMemo(() => {
        let sum = 0
        readLocal.reduce((acc, value) => {
            if (value?.stationStatus) {
                sum++
            }
        }, 0)
        return sum
    }, [readLocal?.length])

    useEffect(() => {
        totalConfirmedScheduleHandler(FILTER_SCHEDULE)
        totalCanceledScheduleHandler(FILTER_SCHEDULE)
        totalClosedScheduleHandler(FILTER_SCHEDULE)
        DataChartSchedule(FILTER_SCHEDULE)
    }, []);

    return (
        <Fragment>
            <Nav tabs>
                {/* <NavItem>
                    <NavLink
                        active={active === tabOverview}
                        onClick={() => {
                            toggle(tabOverview)
                        }}
                    >
                        <Home size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'overview' })}</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === tabUser}
                        onClick={() => {
                            toggle(tabUser)
                        }}
                    >
                        <User size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'User' })}</span>
                    </NavLink>
                </NavItem> */}
                <NavItem>
                    <NavLink
                        active={active === tabCenter}
                        onClick={() => {
                            toggle(tabCenter)
                        }}
                    >
                        <Map size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'center' })}</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === schedules}
                        onClick={() => {
                            toggle(schedules)
                        }}
                    >
                        <Calendar size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'schedules' })}</span>
                    </NavLink>
                </NavItem>
                {/* <NavItem>
                    <NavLink
                        active={active === tabVehicle}
                        onClick={() => {
                            toggle(tabVehicle)
                        }}
                    >
                        <Cpu size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'Vehicle' })}</span>
                    </NavLink>
                </NavItem> */}
                <NavItem>
                    <NavLink
                        active={active === tabRegistry}
                        onClick={() => {
                            toggle(tabRegistry)
                        }}
                    >
                        <Aperture size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'actives' })}</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === tabActivityStatistics}
                        onClick={() => {
                            toggle(tabActivityStatistics)
                        }}
                    >
                        <Codepen size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'activity_statistics' })}</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === tabOverviewSchedules}
                        onClick={() => {
                            toggle(tabOverviewSchedules)
                        }}
                    >
                        <Codepen size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'center' })}</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === tabOverviewActivate}
                        onClick={() => {
                            toggle(tabOverviewActivate)
                        }}
                    >
                        <Codepen size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'schedules' })}</span>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        active={active === tabOverviewCenter}
                        onClick={() => {
                            toggle(tabOverviewCenter)
                        }}
                    >
                        <Codepen size={14} />
                        <span className='align-middle'>{intl.formatMessage({ id: 'actives' })}</span>
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent className='py-50' activeTab={active}>
                {/* <TabPane tabId={tabOverview}>
                    <TabOverview
                        days={days}
                        data={data}
                    />
                </TabPane>
                <TabPane tabId={tabUser}>
                    <ReportUsers />
                </TabPane> */}
                <TabPane tabId={schedules}>
                <Row >
                  <Col sm='12' xs='12'>
                    <TabSchedule
                        days={days}
                        schedule={schedule}
                        total={total}
                        dayOverview={dayOverview}
                        totalConfirmedSchedule={totalConfirmedSchedule}
                        totalNewSchedule={totalNewSchedule}
                        totalClosedSchedule={totalClosedSchedule}
                        totalSchedule={totalSchedule}
                    />
                    </Col>
                </Row>
                <Row>
                    <Col sm='4' xs='12'>
                        <TypeSchedule />
                    </Col>
                    <Col sm='4' xs='12'>
                        <ServiceChart />
                    </Col>
                    <Col sm='4' xs='12'>
                        <TypeCar />
                    </Col>
                </Row>
                </TabPane>
                <TabPane tabId={tabVehicle}>
                    <Vehicle />
                </TabPane>
                <TabPane tabId={tabCenter}>
                    <Row sm='12'>
                        <Col sm='6'>
                            <TabStations
                                totalStations={totalStation}
                                totalOverloadStations={totalOverload}
                                totalActivedStations={totalActived}
                                totalWorkedStations={totalWorked}
                            />
                        </Col>
                        <Col sm='6'>
                            <Row>
                                <Col sm="6">
                                    <ProductivityTab />
                                </Col>
                                <Col sm="6">
                                    <LineTab />
                                </Col>
                            </Row>
                            <Row>
                                <Col sm='12'>
                                    <TabStaff />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12" md="4" lg="4">
                            {/* {active === tabCenter ? <ActiveCenter /> : null} */}
                        </Col>
                        <Col sm="12" md="4" lg="4">
                            {/* {active === tabCenter ? <EnableBooking /> : null} */}
                        </Col>
                        <Col sm="12" md="4" lg="4">
                            {/* {active === tabCenter ? <Wattage /> : null} */}
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId={tabRegistry}>
                    {active === tabRegistry ? <Registry /> : null}
                </TabPane>
                <TabPane tabId={tabActivityStatistics}>
                    {active === tabActivityStatistics ? <ActivityStatic /> : null}
                </TabPane>
                <TabPane tabId={tabOverviewSchedules}>
                    {active === tabOverviewSchedules ? <OverviewSchedule /> : null}
                </TabPane>
                <TabPane tabId={tabOverviewActivate}>
                    {active === tabOverviewActivate ? <OverviewActived /> : null}
                </TabPane>
                <TabPane tabId={tabOverviewCenter}>
                    {active === tabOverviewCenter ? <OverviewCenter /> : null}
                </TabPane>
            </TabContent>
        </Fragment>
    );
};

export default injectIntl(memo(TabReport));
