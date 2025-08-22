import { Link } from 'react-router-dom';
import { useState, useRef, forwardRef } from 'react';

import { Box } from '@mui/system';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Button, Select, MenuItem } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';
import AnalyticsConversionRates from '../analytics-conversion-rates';
import AppAreaInstalled from '../app-area-installed';
import AppCurrentDownload from '../app-current-download';
import AnalyticsWidgetSummary from '../analytics-widget-summary';
import RoomPriority from '../room-priority';

// ----------------------------------------------------------------------

const GuestAnalytics = forwardRef((props, ref) => {
  const settings = useSettingsContext();
  const theme = useTheme();

  const [range, setRange] = useState('month'); // 'day' | 'month' | 'year'
  const [categoryFilter, setCategoryFilter] = useState('All');

  const userSatisfactionData = [
    { label: 'Very Satisfied', value: 60 },
    { label: 'Satisfied', value: 25 },
    { label: 'Neutral', value: 10 },
    { label: 'Unsatisfied', value: 5 },
  ];

  const chartRangeData = {
    day: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      series: [
        {
          year: '2024',
          data: [
            { name: 'Positive', data: [5, 6, 7, 4, 6, 5, 3] },
            { name: 'Neutral', data: [3, 5, 6, 2, 4, 5, 2] },
            { name: 'Negetive', data: [2, 1, 2, 2, 1, 2, 3] },
          ],
        },
      ],
    },
    month: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      series: [
        {
          year: '2024',
          data: [
            { name: 'Positive', data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49] },
            { name: 'Neutral', data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77] },
            { name: 'Negetive', data: [40, 24, 33, 56, 47, 88, 99, 17, 45, 13, 96, 97] },
          ],
        },
        {
          year: '2025',
          data: [
            { name: 'Positive', data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49] },
            { name: 'Neutral', data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77] },
            { name: 'Negetive', data: [20, 24, 53, 56, 47, 38, 99, 17, 65, 13, 96, 77] },
          ],
        },
      ],
    },
    year: {
      categories: ['2022', '2023', '2024'],
      series: [
        {
          year: 'Total',
          data: [
            { name: 'Positive', data: [300, 350, 400, 420, 450, 480] },
            { name: 'Neutral', data: [280, 330, 390, 410, 440, 470] },
            { name: 'Negetive', data: [100, 90, 85, 80, 75, 70] },
          ],
        },
      ],
    },
  };

  const priorityData = [
    { label: 'High', value: 5 },
    { label: 'Medium', value: 3 },
    { label: 'Low', value: 7 },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} ref={ref}>
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ mt: 5 }}>
          Guest Analytics
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained">
            View Detailed Report
          </Button>
        </Box>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2, alignItems: 'stretch' }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ height: '100%' }}>
            <AppAreaInstalled
              title="Guest Feedback"
              subheader="Distribution of Positive, Negative, and Neutral Feedback"
              chart={{
                categories: chartRangeData[range].categories,
                series:
                  chartRangeData[range].series.length > 1
                    ? chartRangeData[range].series
                    : [
                        {
                          year: 'Total',
                          data: chartRangeData[range].series[0].data,
                        },
                      ],
                colors: [
                  [theme.palette.success.light, theme.palette.success.main],
                  [theme.palette.info.light, theme.palette.info.main],
                  [theme.palette.error.light, theme.palette.error.main],
                ],
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ height: '100%' }}>
            <AppCurrentDownload
              title="Guest Satisfaction"
              subheader="Survey responses from recent guests"
              chart={{
                series: userSatisfactionData,
                colors: [
                  theme.palette.success.main,
                  theme.palette.info.main,
                  theme.palette.warning.main,
                  theme.palette.error.main,
                ],
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
});

export default GuestAnalytics;
