"use client";
import React, { useState } from "react";
import { DatePicker, Card, Col, Row, Typography } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis as BarXAxis, YAxis as BarYAxis } from "recharts";

dayjs.extend(customParseFormat);

const dateFormat = "DD/MM/YYYY";

const Students = () => {
  const currentDate = dayjs();

  // Dữ liệu card
  const dataCard = [
    {
      id: "1",
      title: "Tỉ lệ nhu cầu học",
      desc: "Tỉ lệ nhu cầu học của học viên",
      chartType: "line", 
    },
    {
      id: "2",
      title: "Tỉ lệ mục đích học",
      desc: "Tỉ lệ mục đích học của học viên",
      chartType: "bar", 
    },
    {
      id: "3",
      title: "Tỉ lệ học viên từ nguồn",
      desc: "Tỉ lệ học viên theo nguồn khách hàng",
      chartType: "bar",
    },
  ];

  // Dữ liệu mới cho biểu đồ
  const newStudentsData = [
    { month: "Tháng 1", currentYear: 10, previousYear: 5 },
    { month: "Tháng 2", currentYear: 15, previousYear: 10 },
    { month: "Tháng 3", currentYear: 20, previousYear: 18 },
    { month: "Tháng 4", currentYear: 25, previousYear: 20 },
    { month: "Tháng 5", currentYear: 30, previousYear: 28 },
    { month: "Tháng 6", currentYear: 35, previousYear: 30 },
    { month: "Tháng 7", currentYear: 40, previousYear: 38 },
    { month: "Tháng 8", currentYear: 45, previousYear: 40 },
    { month: "Tháng 9", currentYear: 50, previousYear: 48 },
    { month: "Tháng 10", currentYear: 55, previousYear: 52 },
    { month: "Tháng 11", currentYear: 60, previousYear: 55 },
    { month: "Tháng 12", currentYear: 70, previousYear: 65 },
  ];

  // Dữ liệu phân bổ độ tuổi học viên
  const ageDistributionData = [
    { ageGroup: "< 12", "Học viên": 5 },
    { ageGroup: "12 - 18", "Học viên": 10 },
    { ageGroup: "19 - 30", "Học viên": 15 },
    { ageGroup: "31 - 45", "Học viên": 25 },
    { ageGroup: "45+", "Học viên": 15 },
  ];

  // Dữ liệu học viên theo nguồn
  const sourceData = [
    { source: "Facebook", "Học viên": 30 },
    { source: "Bạn bè", "Học viên": 25 },
    { source: "Tìm kiếm trực tuyến", "Học viên": 20 },
    { source: "Giới thiệu từ giáo viên", "Học viên": 10 },
    { source: "Khác", "Học viên": 15 },
  ];

  return (
    <section>
      {/* Chọn ngày */}
      <DatePicker defaultValue={currentDate} format={dateFormat} />

      {/* Học viên */}
      <Row gutter={16} className="mt-4">
        <Col span={5}>
          <Card title="Tổng số học viên" variant="outlined">
            <Typography className="font-bold text-4xl">247</Typography>
          </Card>
        </Col>
        <Col span={5}>
          <Card title="Học viên sắp học xong" variant="outlined">
            <Typography className="font-bold text-4xl">12</Typography>
          </Card>
        </Col>
      </Row>

      {/* Render các Card Mục đích học và nhu cầu học */}
      <Row gutter={16} className="mt-4">
        {dataCard.map((data) => (
          <Col span={8} key={data.id}>
            <Card
              variant="outlined"
              title={
                <div className="py-3">
                  <p>{data.title}</p>
                  <Typography className="font-normal">{data.desc}</Typography>
                </div>
              }
              extra={
                <DatePicker
                  className="w-24"
                  size="middle"
                  format="MM/YYYY"
                  picker="year"
                  defaultValue={currentDate}
                />
              }
            >
              {/* Biểu đồ tùy thuộc vào loại chart */}
              {data.chartType === "line" ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={newStudentsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" label={{ value: "Tháng", position: "bottom", offset: -5 }} />
                    <YAxis label={{ value: "Số lượng học viên", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="currentYear"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Học viên mới năm nay"
                    />
                    <Line
                      type="monotone"
                      dataKey="previousYear"
                      stroke="#82ca9d"
                      name="Học viên mới năm ngoái"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.id === "3" ? sourceData : ageDistributionData}>
                    <BarXAxis dataKey={data.id === "3" ? "source" : "ageGroup"} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Học viên" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default Students;
