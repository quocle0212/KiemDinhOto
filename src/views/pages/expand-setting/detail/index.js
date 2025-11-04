import React, { memo } from 'react'
import { ChevronLeft } from 'react-feather';
import { injectIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { THIRDPARTY_CATEGORY, THIRDPARTY_CODE } from '../../../../constants/app';
import TelegramThirdParty from './TelegramThirdParty';
 function DetailThirdParty({intl}) {
    const history = useHistory()
    const { partyCode } = useParams()

    //render theo thrid party code
    const renderContent = () => {
        switch (partyCode) {
            case THIRDPARTY_CODE.TELEGRAM:
                return <TelegramThirdParty />
            default:
                break;
        }

    }
    return (
        <div>
            <div className="pt-1 pl-1" style={{ cursor: 'pointer' }} onClick={() => history.push("/pages/expand-setting")}>
                <ChevronLeft />
                {intl.formatMessage({ id: "goBack" })}
            </div>
            {renderContent()}
        </div>
    )
}

export default injectIntl(memo(DetailThirdParty))
