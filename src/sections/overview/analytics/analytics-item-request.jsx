import { useState } from 'react';
import PropTypes from 'prop-types';

import { Card, CardHeader, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

export default function AnalyticsItemRequest({ title, subheader, data }) {
  const [range, setRange] = useState('day');

  const selectedData = data[range] || [];

  const chartOptions = useChart({
    tooltip: {
      y: {
        formatter: (val) => `${val} times`,
        title: {
          formatter: () => 'Requested',
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 4,
      },
    },
    xaxis: {
      categories: selectedData.map((item) => item.item),
    },
  });

  const chartSeries = [
    {
      name: 'Times Requested',
      data: selectedData.map((item) => item.timesRequested),
    },
  ];

  return (
    <Card sx={{height: '100%'}}>
      <CardHeader
        title={title}
        subheader={subheader}
      />

      <Box sx={{ mx: 3, height: '100%'}}>
        <Chart dir="ltr" type="bar" series={chartSeries} options={chartOptions} height={360} />
      </Box>
    </Card>
  );
}

AnalyticsItemRequest.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  data: PropTypes.object.isRequired,
};
