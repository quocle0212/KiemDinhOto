import React, { memo, Fragment, useState, useEffect } from 'react'
import { injectIntl } from 'react-intl'
import tabStaffService from '../../../../services/tabStaffService'
import Avatar from '@components/avatar'
import * as Icon from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, Media, CardText } from 'reactstrap'

const TabStaff = ({ intl, listStation  }) => {
    const area = listStation[0]?.stationArea

    const DefaultFilter = {
        filter: {
            stationArea : area,
        },
        limit: 20,
        skip: 0
    }
    const paramPatern = {
      filter: {
        appUserRoleId : 1,
        stationArea : area,
      }
    }
    const paramTechnician = {
      filter: {
        appUserRoleId: 2,
        stationArea : area,
      }
    }
    const paramHigh = {
      filter: {
        appUserRoleId: 3,
        stationArea : area,
      }
    }
    const paramAccount = {
      filter: {
        appUserRoleId: 5,
        stationArea : area,
      }
    }

    const [total, setTotal] = useState()
    const [patern, setPatern] = useState(0)
    const [technician, setTechnician] = useState(0)
    const [high, setHigh] = useState(0)
    const [accountant, setAccountant] = useState(0)

    const getDataStaffHandler = (paramsFilter) => {
        tabStaffService.getListStaff(paramsFilter).then((result) => {
            if (result) {
                setTotal(result.data.total);
            }
        })
    }
    const getTotalPatern = (paramPatern) => {
        tabStaffService.getListStaff(paramPatern).then((result) => {
            if (result) {
                setPatern(result.data.total);
            }
        })
    }
    const getTotalTechnician = (paramTechnician) => {
        tabStaffService.getListStaff(paramTechnician).then((result) => {
            if (result) {
                setTechnician(result.data.total);
            }
        })
    }
    const getTotalHigh = (paramHigh) => {
        tabStaffService.getListStaff(paramHigh).then((result) => {
            if (result) {
                setHigh(result.data.total);
            }
        })
    }
    const getTotalAccountant = (paramAccount) => {
        tabStaffService.getListStaff(paramAccount).then((result) => {
            if (result) {
                setAccountant(result.data.total);
            }
        })
    }
    const transactionsArr = [
        {
            title: intl.formatMessage({ id: 'patern' }),
            color: 'light-primary',
            subtitle: 'Starbucks',
            amount: patern,
            Icon: Icon['User'],
            down: 'text-primary'
        },
        {
            title: intl.formatMessage({ id: 'technician' }),
            color: 'light-success',
            subtitle: 'Add Money',
            amount: technician,
            Icon: Icon['User'],
            down: 'text-success'
        },
        {
            title: intl.formatMessage({ id: 'technicians_senior' }),
            color: 'light-warning',
            subtitle: 'Ordered Food',
            amount: high,
            Icon: Icon['User'],
            down : 'text-danger'
        },
        {
            title: intl.formatMessage({ id: 'vice_president' }),
            color: 'light-info',
            subtitle: 'Refund',
            amount: accountant,
            Icon: Icon['User'],
            down: 'text-warning'
        }
    ]

    const renderTransactions = () => {
        return transactionsArr.map(item => {
            return (
                <div key={item.title} className='transaction-item'>
                    <Media>
                        <Avatar className='rounded' color={item.color} icon={<item.Icon size={18} />} />
                        <Media body>
                            <h6 className='transaction-title'>{item.title}</h6>
                        </Media>
                    </Media>
                    <div className={`font-weight-bolder ${item.down}`}>{item.amount}</div>
                </div>
            )
        })
    }

    useEffect(() => {
        getDataStaffHandler(DefaultFilter)
        getTotalPatern(paramPatern)
        getTotalTechnician(paramTechnician)
        getTotalHigh(paramHigh)
        getTotalAccountant(paramAccount)
    }, [listStation]);

    return (
        <Fragment>
            <Card className='card-transaction'>
                <CardHeader >
                    <CardTitle tag='h3'>{intl.formatMessage({ id: 'staff' })}</CardTitle>
                    <CardTitle className="font-small-3">{intl.formatMessage({ id: 'total_staff' })} : {total}</CardTitle>
                </CardHeader>
                <CardBody>{renderTransactions()}</CardBody>
            </Card>
        </Fragment>
    )
}
export default injectIntl(memo(TabStaff))