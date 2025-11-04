import { Fragment, memo } from 'react'
import {
    Card,
    Row,
    Col,
} from 'reactstrap'
import { injectIntl } from 'react-intl'
import './index.scss'
import { readAllStationsDataFromLocal } from "../../../../helper/localStorage"
import Icon from '@mdi/react';
import { mdiCartOutline, mdiLinkVariant } from '@mdi/js';
import { log } from 'handlebars'

const StationDeviceReportWidget = ({ intl, listStation }) => {

    let oneValue = 1
    let zeroValue = 0
    const totalLine = (array) => {
        let sum = 0;
        array?.map((value) => {
            sum += value?.totalInspectionLine;
        });

        return sum;
    }

    const totalActive = (array) => {
        let sum = 0;
        const arrayOneValue = array?.filter((item) => item?.stationStatus === oneValue)
        arrayOneValue?.map((value) => {
            sum += value?.totalInspectionLine;
        });
        return sum;
    }

    const totalNotActive = (array) => {
        let sum = 0;
        const arrayOneValue = array?.filter((item) => item?.stationStatus === zeroValue)
        arrayOneValue?.map((value) => {
            sum += value?.totalInspectionLine;
        });
        return sum;
    }

    const totalLineInspect = totalLine(listStation)
    const totalActives = totalActive(listStation)
    const totalNotActives = totalNotActive(listStation)

    return (
        <Fragment>
            <Row className='height-row'>
                <Col sm='12'>
                    <Card sm='6'>
                        <Row className="block-content">
                            <Col sm='12'><div className='size-title'>{intl.formatMessage({ id: "chain_number" })}</div></Col>
                            <Col sm='12'><div className='text-content'>{totalLineInspect}</div></Col>
                        </Row>
                        <Row>
                            <Col sm='6' className="block-content ml-10">
                                <Col sm='6'>
                                    <div className='block-icon'>
                                        <Icon className='mdiCartOutline-color' path={mdiCartOutline} size={1} />
                                    </div>
                                </Col>
                                <Col sm='6'>
                                    <div className='width-content text-others margintop-5'>
                                        {intl.formatMessage({ id: "actived" })}
                                    </div>
                                </Col>
                            </Col>
                            <Col sm='6' className="block-content ml-10">
                                <Col sm='6'>
                                    <div>
                                        <Icon className='mdiLinkVariant-color' path={mdiLinkVariant} size={1} />
                                    </div>
                                </Col>
                                <Col sm='6'>
                                    <div className='width-content text-others'>
                                        {intl.formatMessage({ id: "pause" })}
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                        <Row>
                             <Col sm='6' className='ps-10 ps-10-reponsive'>{totalActives}</Col> 
                             <Col sm='6' className='ps-10 mt-30'>{totalNotActives}</Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
export default injectIntl(memo(StationDeviceReportWidget))
