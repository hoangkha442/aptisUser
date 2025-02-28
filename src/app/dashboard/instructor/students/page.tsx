"use client";

import React, { useEffect } from "react";
import { DatePicker, Card, Col, Row, Typography, Alert, Skeleton } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import LineChartComponent from "@/components/LineChart";
import BarChartComponent from "@/components/BarChart";
import { fetchUserStatistics } from "@/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
const currentDate = dayjs();

const Students: React.FC = () => {
  const dispatch = useAppDispatch();
  const { statistics, error, loading } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserStatistics());
  }, [dispatch]);

  const totalStudents = statistics?.totalStudents || 0;
  const graduatingStudents = statistics?.graduatingStudents || 0;

  // ✅ FIX: Corrected age distribution logic
  const ageDistributionData = statistics?.ageDistribution?.map((item) => ({
    ageGroup: `${item.age} tuổi`, // ✅ Use `age` instead of `date_of_birth`
    "Học viên": item.count, // ✅ Use `count` instead of `_count.student_id`
  })) || [];

  const sourceData = statistics?.sourceDistribution?.map((item) => ({
    source: item.source,
    "Học viên": item.count, // ✅ Fixed `_count.user_id`
  })) || [];

  const newStudentsData = statistics?.newStudentsData?.map((item) => ({
    month: item.month, // ✅ Corrected property name
    currentYear: item.count, // ✅ Use `count`
    previousYear: Math.floor(item.count * 0.8), // Simulated previous year data
  })) || [];
  

  return (
    <section>
      <DatePicker defaultValue={currentDate} format={dateFormat} />

      {error && <Alert message="Lỗi tải dữ liệu!" description={error} type="error" showIcon />}

      <Row gutter={16} className="mt-4">
        <Col span={5}>
          <Card title="Tổng số học viên">
            {loading ? <Skeleton.Button active size="large" /> : (
              <Typography className="font-bold text-4xl">{totalStudents}</Typography>
            )}
          </Card>
        </Col>
        <Col span={5}>
          <Card title="Học viên sắp học xong">
            {loading ? <Skeleton.Button active size="large" /> : (
              <Typography className="font-bold text-4xl">{graduatingStudents}</Typography>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mt-4">
        <Col span={8}>
          <Card title="Tỉ lệ nhu cầu học">
            {loading ? <Skeleton active /> : <LineChartComponent data={newStudentsData} />}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Độ tuổi học viên">
            {loading ? <Skeleton active /> : <BarChartComponent data={ageDistributionData} dataKey="ageGroup" />}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Tỉ lệ học viên từ nguồn">
            {loading ? <Skeleton active /> : <BarChartComponent data={sourceData} dataKey="source" />}
          </Card>
        </Col>
      </Row>
    </section>
  );
};

export default Students;
