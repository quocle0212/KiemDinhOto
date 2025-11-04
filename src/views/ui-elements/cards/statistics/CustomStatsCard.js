import React from 'react';
import { useIntl } from 'react-intl';
import { Box } from 'react-feather';
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart';
import { Card } from 'reactstrap';
import { formatDisplayNumber } from '../../../../utility/Utils';
import SpinnerTextAlignment from '../../../components/spinners/SpinnerTextAlignment';
import './index.scss';

const CustomStatsCard = ({ data, icon, color, statTitleId,children }) => {
  const intl = useIntl();
  if (data === undefined) {
    return (
      <Card className='custom-stats-card d-flex justify-content-center align-items-center'>
        <SpinnerTextAlignment size={60} />
      </Card>
    );
  }

  return (
    <div style={{ boxShadow: "0 4px 24px 0 rgba(34, 41, 47, 0.1)" }} className='pb-2'>
      <StatsWithAreaChart
        icon={icon}
        color={color}
        stats={formatDisplayNumber(data)}
        statTitle={intl.formatMessage({ id: statTitleId })}
        className='custom-stats-card'
      />
      {children}
    </div>
  );
};

CustomStatsCard.defaultProps = {
  icon: <Box size={21} />,
  color: 'primary',
  statTitleId: 'default_stat_title',
};

export default CustomStatsCard;
