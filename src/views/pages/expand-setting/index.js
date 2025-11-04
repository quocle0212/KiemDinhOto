import React, { memo, useEffect, useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, Card, CardTitle, CardText, Button, CardBody } from 'reactstrap';
import { toast } from 'react-toastify';
import "./index.scss"
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import ThirdPartyIntegration from '../../../services/thirdPartyIntegrationService';
import _ from 'lodash'
import { THIRDPARTY_CATEGORY, THIRDPARTY_CODE, THIRDPARTY_CODE_ENABLE, THIRDPARTY_CODE_IMAGE } from '../../../constants/app';
import { injectIntl } from 'react-intl';


const EXPAND_SETTING_APP = {
    NOTIFICATION: {
        name: 'Thông báo',
        apps: [
        ],
    },
    SMS: {
        name: 'SMS',
        apps: [
        ],
    },
    ZALO_MESSAGE: {
        name: 'Tin nhắn Zalo',
        apps: [
        ],
    },
    EMAIL: {
        name: 'Email',
        apps: [
        ],
    }
};

const toastMessage = 'Chức năng đang tắt. Vui lòng liên hệ đội ngũ kỹ thuật qua email info@ttdk.com.vn hoặc hotline 0343902960 (Zalo) để được hỗ trợ'

const ExpandSettingTabs = ({intl}) => {
    const THIRDPARTY_NAME ={
        [THIRDPARTY_CODE.CAPITAL_PAY]: intl.formatMessage({ id: 'capital_pay'}),
        [THIRDPARTY_CODE.SUNPAY]: intl.formatMessage({ id: 'sunpay'}),
        [THIRDPARTY_CODE.VNPAYQR]: intl.formatMessage({ id: 'vnpay_qr'}),
        [THIRDPARTY_CODE.TELEGRAM]: intl.formatMessage({ id: 'telegram'}),
        [THIRDPARTY_CODE.ZALO]: intl.formatMessage({ id: 'zalo' }),
        [THIRDPARTY_CODE.TTDK]: intl.formatMessage({ id: 'ttdk' }),
        [THIRDPARTY_CODE.VMG]: intl.formatMessage({ id: 'vmg' }),
        [THIRDPARTY_CODE.VIVAS]: intl.formatMessage({ id: 'vivas' }),
        [THIRDPARTY_CODE.FPT]: intl.formatMessage({ id: 'fpt' }),
        [THIRDPARTY_CODE.VNPT]: intl.formatMessage({ id: 'vnpt' }),
        [THIRDPARTY_CODE.VIETTEL]: intl.formatMessage({ id: 'viettel' }),
        [THIRDPARTY_CODE.ZALO_ZNS]: intl.formatMessage({ id: 'zalo_zns' }),
        [THIRDPARTY_CODE.SMARTGIFT]: intl.formatMessage({ id: 'smartgift' }),
        [THIRDPARTY_CODE.SMTP]: intl.formatMessage({ id: 'smtp' }),
        [THIRDPARTY_CODE.MAILGUN]: intl.formatMessage({ id: 'mailgun' })
      }
    const [activeTab, setActiveTab] = useState("NOTIFICATION");
    const history = useHistory()
    const [contentTab, setContentTab] = useState(EXPAND_SETTING_APP);

    const toggleTab = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const handleAppClick = (app) => {
        if (!app.isEnabled) {
            toast.error(toastMessage);
        } else {
            history.push(`/pages/third-party-setting/${app?.partyCode}/${app?.thirdPartyId}`)
        }
    };

    const handleGetConfig = async () => {
        try {
            const res = await ThirdPartyIntegration.getConfigsTelegram({
                filter: { stationsId: null }
            })

            //groupby theo partyCategory
            const groupedData = _.groupBy(res?.data, item => {
                for (const [key, value] of Object.entries(THIRDPARTY_CATEGORY)) {
                    if (value === item.partyCategory) {
                        return key;
                    }
                }
            });
            // Map thành dữ liệu theo cấu trúc của EXPAND_SETTING_APP
            for (const [category, apps] of Object.entries(groupedData)) {
                const settingApp = EXPAND_SETTING_APP[category];
                const appContents = []
                if (settingApp) {
                    apps.forEach(app => {
                        appContents.push({
                            name: THIRDPARTY_NAME[app?.partyCode], // Tên ứng dụng
                            isEnabled: THIRDPARTY_CODE_ENABLE[app?.partyCode] ? true : false, 
                            icon: THIRDPARTY_CODE_IMAGE[app?.partyCode],
                            partyCode: app?.partyCode,
                            thirdPartyId: app?.thirdPartyId
                        });
                    });
                    settingApp.apps = appContents
                }
            }
            setContentTab({ ...EXPAND_SETTING_APP })
        } catch (error) {

        }
    }

    useEffect(() => {
        handleGetConfig()
    }, [])


    const renderTabContent = () => {
        return Object.keys(contentTab).map((key, index) => {
            const tab = contentTab[key];
            return (
                <TabPane key={index} tabId={key}>
                    <Row>
                        {tab.apps.map((app, appIndex) => (
                            <Col md="4" lg="3" key={appIndex}>
                                <Card onClick={() => handleAppClick(app)}>
                                    <CardBody className={`expand-setting_content ${app?.isEnabled ? '' : 'expand-setting_disabled'}`}>
                                        {app?.icon ? <img src={app?.icon} /> : <div className='expand-setting_content-icon'>{app?.name}</div>}
                                        <CardTitle className='expand-setting_title'>{app?.name}</CardTitle>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </TabPane>
            );
        });
    };

    return (
        <div className='expand-setting'>
            <Nav tabs>
                {Object.keys(contentTab).map((key, index) => (
                    <NavItem key={index}>
                        <NavLink
                            className={activeTab === key ? 'active' : ''}
                            onClick={() => toggleTab(key)}
                        >
                            {contentTab[key].name}
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>
            <TabContent activeTab={activeTab}>
                {renderTabContent()}
            </TabContent>
        </div>
    );
};

export default injectIntl(memo(ExpandSettingTabs));
