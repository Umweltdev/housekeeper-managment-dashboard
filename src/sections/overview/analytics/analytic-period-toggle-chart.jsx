import PropTypes from "prop-types";
import { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import ButtonBase from "@mui/material/ButtonBase";

import Iconify from "src/components/iconify";
import Chart, { useChart } from "src/components/chart";
import CustomPopover, { usePopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

export default function AnalyticPeriodToggleChart({
  title,
  subheader,
  datasets,
  defaultPeriod = "Day",
}) {
  const theme = useTheme();
  const popover = usePopover();

  const [period, setPeriod] = useState(defaultPeriod);

  const activeSeries = datasets.find((s) => s.period === period);

  const chartOptions = useChart({
    // colors: [theme.palette.primary.main],
    stroke: { width: 3 },
    xaxis: { categories: activeSeries?.categories },
    yaxis: { title: { text: activeSeries?.yLabel || "" } },
    // tooltip: { theme: "dark" },
    ...activeSeries?.options,
  });

  const handleChange = useCallback(
    (newValue) => {
      popover.onClose();
      setPeriod(newValue);
    },
    [popover]
  );

  return (
    <>
      <Card>
        <CardHeader
          title={`${title} (${period})`}
          subheader={subheader}
          action={
            <ButtonBase
              onClick={popover.onOpen}
              sx={{
                pl: 1,
                py: 0.5,
                pr: 0.5,
                borderRadius: 1,
                typography: "subtitle2",
                bgcolor: "background.neutral",
              }}
            >
              {period}
              <Iconify
                width={16}
                icon={
                  popover.open
                    ? "eva:arrow-ios-upward-fill"
                    : "eva:arrow-ios-downward-fill"
                }
                sx={{ ml: 0.5 }}
              />
            </ButtonBase>
          }
        />

        <Box sx={{ mt: 3, mx: 3 }}>
          <Chart
            dir="ltr"
            type={activeSeries?.type || "line"}
            series={activeSeries?.data || []}
            options={chartOptions}
            width="100%"
            height={400}
          />
        </Box>
      </Card>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {datasets.map((option) => (
          <MenuItem
            key={option.period}
            selected={option.period === period}
            onClick={() => handleChange(option.period)}
          >
            {option.period}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

AnalyticPeriodToggleChart.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      period: PropTypes.string.isRequired, // "Day", "Week", "Month"
      data: PropTypes.array.isRequired, // Apex-like series [{ name, data }]
      categories: PropTypes.array.isRequired, // X-axis labels
      type: PropTypes.string, // e.g., "line", "bar"
      yLabel: PropTypes.string, // optional Y-axis label
      options: PropTypes.object, // extra chart options
    })
  ).isRequired,
  defaultPeriod: PropTypes.string,
};
