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

const LineTab = ({ intl }) => {
    const readLocal = readAllStationsDataFromLocal();
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

    const totalLineInspect = totalLine(readLocal)
    const totalActives = totalActive(readLocal)
    const totalNotActives = totalNotActive(readLocal)

    return (
        <Fragment>
            <Row className='height-row'>
                <Col sm='12'>
                    <Card sm='6'>
                        <Row className="block-content">
                            <Col sm='12'><div className='size-title'>{intl.formatMessage({ id: "chain_number" })}</div></Col>
                            <Col sm='12'><div className='text-content'>{totalLineInspect}</div></Col>
                        </Row>
                        <Row style={{ padding: "24px" , paddingBottom : 30 }}>
                            <Col sm={"12"} md="12" lg="12" xl="6">
                                <Row className="productivityTab-item">
                                    <Col sm='12'>
                                        <div className='block-icon'>
                                            <Icon className='mdiCartOutline-color' path={mdiCartOutline} size={1} />
                                        </div>
                                        <div className='width-content text-others margintop-5'>
                                            {intl.formatMessage({ id: "actived" })}
                                        </div>
                                    </Col>
                                    <Col sm='12'>{totalActives}</Col>
                                </Row>
                            </Col>
                            <Col sm={"12"} md="12" lg="12" xl="6">
                                <Row className="productivityTab-item">
                                        <Col sm='12'>
                                            <div>
                                                <Icon className='mdiLinkVariant-color' path={mdiLinkVariant} size={1} />
                                            </div>
                                        </Col>
                                        <Col sm='12'>
                                            <div className='width-content text-others'>
                                                {intl.formatMessage({ id: "pause" })}
                                            </div>
                                        </Col>
                                    <Col sm='12'>{totalNotActives}</Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
export default injectIntl(memo(LineTab))
