"use client";

import React from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

type BarChartComponentProps = {
  data: { [key: string]: string | number }[];
  dataKey: string;
};

const BarChartComponent: React.FC<BarChartComponentProps> = ({ data, dataKey }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ReBarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={dataKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="Học viên" fill="#8884d8" />
    </ReBarChart>
  </ResponsiveContainer>
);

export default BarChartComponent;
