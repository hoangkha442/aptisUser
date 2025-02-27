"use client";

import React from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

type LineChartComponentProps = {
  data: { month: string; currentYear: number; previousYear: number }[];
};

const LineChartComponent: React.FC<LineChartComponentProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ReLineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="currentYear" stroke="#8884d8" activeDot={{ r: 8 }} name="Học viên mới năm nay" />
      <Line type="monotone" dataKey="previousYear" stroke="#82ca9d" name="Học viên mới năm ngoái" />
    </ReLineChart>
  </ResponsiveContainer>
);

export default LineChartComponent;
