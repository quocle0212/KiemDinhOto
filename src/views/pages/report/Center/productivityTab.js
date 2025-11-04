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
import { MAX_SCHEDULE_PER_INSPECTION_LINE } from '../../../../constants/app'

const ProductivityTab = ({ intl }) => {
    const readLocal = readAllStationsDataFromLocal();
    const totalLine = (array) => {
        let sum = 0;
        array?.map((value) => {
            sum += value?.totalInspectionLine;
        });

        return sum;
    }

    const totalReality = readLocal?.reduce((acc, station) => {
        const bookingConfig = station.stationBookingConfig;
        const totalVehicle = bookingConfig.reduce((acc, configTime) => {
            let afterSum = 0;
            if (configTime.enableBooking) {
                afterSum += configTime.limitSmallCar ? configTime.limitSmallCar : 0;
                afterSum += configTime.limitOtherVehicle ? configTime.limitOtherVehicle : 0;
                afterSum += configTime.limitRoMooc ? configTime.limitRoMooc : 0;
            }
            return acc + afterSum;
        }, 0);

        return acc + totalVehicle;
    }, 0);
    
    const totalLineInspect = totalLine(readLocal)
    const totalProductives = totalLineInspect * MAX_SCHEDULE_PER_INSPECTION_LINE
    const totalNotOpen = totalProductives - totalReality

	return (
		<Fragment>
			<Row className='height-row'>
				<Col sm='12'>
					<Card sm='6'>
						<Row className="block-content">
							<Col sm='12'><div className='size-title'>{intl.formatMessage({ id: "wattage" })}</div></Col>
							<Col sm='12'><div className='text-content'>{totalProductives}</div></Col>
						</Row>
						<Row style={{ padding: "24px" , paddingBottom : 30 }}>
							<Col sm={"12"} md="12" lg="12" xl="6">
								<Row className="productivityTab-item">
									<Col sm={"12"}>
										<div className='block-icon'>
											<Icon className='mdiCartOutline-color' path={mdiCartOutline} size={1} />
										</div>
										<div className='width-content text-others margintop-5'>
											{intl.formatMessage({ id: "notopen" })}
										</div>
									</Col>
									<Col sm='12'>{totalNotOpen}</Col>
								</Row>
							</Col>
							<Col sm={"12"} md="12" lg="12" xl="6">
								<Row className="productivityTab-item">
									<Col sm='12'>
										<div>
											<Icon className='mdiLinkVariant-color' path={mdiLinkVariant} size={1} />
										</div>
										<div className='width-content text-others'>
											{intl.formatMessage({ id: "reality" })}
										</div>
									</Col>
									<Col sm='12'>{totalReality}</Col>
								</Row>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>
		</Fragment>
	)
}
export default injectIntl(memo(ProductivityTab))
