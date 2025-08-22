import * as React from "react";
import PropTypes from 'prop-types';

import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Card, Typography, CardContent } from "@mui/material";

const ParetoChart = ({
  categories,
  values,
  title = "Pareto Chart",
}) => {
  // Sort categories + values descending
  const sorted = [...categories.map((c, i) => ({ cat: c, val: values[i] }))].sort(
    (a, b) => b.val - a.val
  );

  const sortedCategories = sorted.map((s) => s.cat);
  const sortedValues = sorted.map((s) => s.val);

  // Cumulative percentage
  const total = sortedValues.reduce((a, b) => a + b, 0);
  const cumulative = sortedValues.map(
    (v, i) =>
      (sortedValues.slice(0, i + 1).reduce((a, b) => a + b, 0) / total) * 100
  );

  return (
    <Card sx={{height: '100%'}}>
      <CardContent sx={{width: '100%'}}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box sx={{ width: "100%", height: 400, position: "relative" }}>
            {/* Bar Chart for counts */}
            <BarChart
              xAxis={[{ scaleType: "band", data: sortedCategories }]}
              series={[{ data: sortedValues, label: "Issues" }]}
              height={400}
            //   margin={{ top: 20, right: 60, bottom: 40, left: 60 }}
              sx={{width: '100%'}}
            />

            {/* Line Chart overlay for cumulative % */}
            {/* <LineChart
              xAxis={[{ scaleType: "band", data: sortedCategories }]}
              yAxis={[{ min: 0, max: 100 }]}
              series={[{ data: cumulative, label: "Cumulative %" }]}
              height={400}
            //   margin={{ top: 20, right: 60, bottom: 40, left: 60 }}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                width: '100%'
              }}
            /> */}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ParetoChart;

ParetoChart.propTypes = {
  categories: PropTypes.array,
  values: PropTypes.number,
  title: PropTypes.string
}
