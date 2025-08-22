import PropTypes from 'prop-types';

import { Box, Card, Select, MenuItem, CardHeader, InputLabel, FormControl  } from '@mui/material';

import Chart, { useChart } from 'src/components/chart';

export default function AnalyticesToggleStackBar({ title, subheader, chart,  range, setRange , ...other}) {
  const { labels, colors, series } = chart;

  const chartOptions = useChart({
    chart: { stacked: true },
    colors,
    xaxis: { categories: labels },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `${val} rooms`,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
      },
    },
  });

  return (
    <Card {...other}>
        <CardHeader
        title={title}
        subheader={subheader}
        action={
            <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Range</InputLabel>
            <Select value={range} label="Range" onChange={(e) => setRange(e.target.value)}>
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="year">Year</MenuItem>
            </Select>
            </FormControl>
        }
        />
      <Box sx={{ p: 3, pb: 1 }}>
        <Chart type="bar" series={series} options={chartOptions} width="100%" height={325} />
      </Box>
    </Card>
  );
}

AnalyticesToggleStackBar.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  range: PropTypes.string,
  setRange: PropTypes.func
};
