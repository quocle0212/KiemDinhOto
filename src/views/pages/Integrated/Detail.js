import React, { memo, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import {
    Button,
    Card,
    CardText,
    CardTitle,
    Col,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
  } from 'reactstrap';
import MySwitch from '../../components/switch';
import { ChevronLeft } from 'react-feather';
import { injectIntl } from "react-intl";
import "./index.scss";
import { toast } from 'react-toastify';
import PayOnline from "./PayOnline";
import Marketing from "./Marketing";

function Detail({intl}) {
  const history = useHistory();
  const stationID = useParams()
  const [activeTab, setActiveTab] = useState('1');

//  const onUpdateEnableUsePayMent = (id,data) => {
//   const dataUpdate = {
//    id: id,
//    data : data
//   }
//   const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
//    if (token) {
//      const newToken = token.replace(/"/g, '')
//   IntegratedService.handleUpdateDataPayment(dataUpdate,newToken).then(res => {
//    if (res) {
//      const { statusCode } = res
//      if (statusCode === 200) {
//       //  const newParams = {
//       //    ...paramsFilter,
//       //    skip: (currentPage - 1) * paramsFilter.limit
//       //  }
//        getData(stationID)
//        toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
//      } else {
//        toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
//      }
//    }
//  })}
//  }

  return (
    <div>
  <Card className='mx-0 mt-1 mb-50 p-2'>
  <div className="pointer mb-1" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: "goBack" })}
        </div>
    <Nav tabs>
    <NavItem>
        <NavLink
          className={activeTab == '1' ? 'active' : ''}
          onClick={() => setActiveTab('1')}
        >
          {intl.formatMessage({ id: "pay_olnine" })}
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={activeTab == '2' ? 'active' : ''}
          onClick={() => setActiveTab('2')}
        >
          {intl.formatMessage({ id: "message_SMS" })}
        </NavLink>
      </NavItem>
  
      {/* <NavItem>
        <NavLink
          className={activeTab == '3' ? 'active' : ''}
          onClick={() => setActiveTab('3')}
        >
          {intl.formatMessage({ id: 'Zalo_ZNS' })}
        </NavLink>
      </NavItem> */}
  
      {/* <NavItem>
        <NavLink
          className={activeTab == '4' ? 'active' : ''}
          onClick={() => setActiveTab('4')}
        >
          {intl.formatMessage({ id: "sms" })}
        </NavLink>
      </NavItem> */}
  
      {/* <NavItem>
        <NavLink
          className={activeTab == '5' ? 'active' : ''}
          onClick={() => setActiveTab('5')}
        >
          {intl.formatMessage({ id: "email" })}
        </NavLink>
      </NavItem> */}
  
      {/* <NavItem>
        <NavLink
          className={activeTab == '6' ? 'active' : ''}
          onClick={() => setActiveTab('6')}
        >
          {intl.formatMessage({ id: "VNPAY" })}
        </NavLink>
      </NavItem> */}
    </Nav>
    <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <PayOnline />
          </TabPane>
          <TabPane tabId="2">
             <Marketing />
          </TabPane>
          {/* <TabPane tabId="3">
          <MySwitch checked={items.stationEnableUseZNS === 1 ? true : false }
          onChange={e => {
            onUpdateStationEnableUse(items.stationsId,{
              stationEnableUseZNS: e.target.checked ? 1 : 0
            })
          }}/>
          </TabPane>
          <TabPane tabId="4">
          <MySwitch checked={items.stationEnableUseSMS === 1 ? true : false }
          onChange={e => {
            onUpdateStationEnableUse(items.stationsId,{
              stationEnableUseSMS: e.target.checked ? 1 : 0
            })
          }}/>
          </TabPane>
          <TabPane tabId="5">
          <MySwitch checked={items.stationEnableUseEmail === 1 ? true : false }
          onChange={e => {
            onUpdateStationEnableUse(items.stationsId,{
              stationEnableUseEmail: e.target.checked ? 1 : 0
            })
          }}/>
          </TabPane>
          <TabPane tabId="6">
          <MySwitch checked={items.stationEnableUseVNPAY === 1 ? true : false }
          onChange={e => {
            onUpdateStationEnableUse(items.stationsId,{
              stationEnableUseVNPAY: e.target.checked ? 1 : 0
            })
          }}/>
          </TabPane>  */}
      </TabContent>
  </Card>
</div>
  )
}
export default injectIntl(memo(Detail))