"use client";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchClassStatistics } from '@/store/slices/classSlice';
import { Card, Col, Row, Skeleton, Typography, Table, Input } from 'antd';
import React, { Key, useEffect } from 'react';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { ClassData } from '@/types/classType';

const { Search } = Input;

// Define TypeScript Interface for Class Data


export default function Classes() {
  const dispatch = useAppDispatch();
  const { classList, completedClasses, pagination, totalClasses, upcomingClosingClasses, loading } = useAppSelector((state) => state.class);

  useEffect(() => {
    dispatch(fetchClassStatistics({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Get today's date
  const today = dayjs();
  const sevenDaysFromNow = today.add(7, 'day');

  // Determine class status
  const getClassStatus = (endDate: string) => {
    const end = dayjs(endDate);
    if (end.isBefore(today)) return "completed";
    if (end.isAfter(today) && end.isBefore(sevenDaysFromNow)) return "expiring";
    return "active";
  };

  // Filter function for class status
  const filterClassStatus = (value: Key | boolean, record: ClassData): boolean => {
    return getClassStatus(record.end_date) === value;
  };

  // Sorting function for class status
  const sortClassStatus = (a: ClassData, b: ClassData) => {
    const order = { active: 1, expiring: 2, completed: 3 };
    return order[getClassStatus(a.end_date)] - order[getClassStatus(b.end_date)];
  };

  // Filter function for participation rate
  const filterParticipation = (value: Key | boolean, record: ClassData): boolean => {
    if (typeof value !== "string") return false;

    const rate = record.participation_rate;

    switch (value) {
      case "below-50":
        return rate < 50;
      case "50-80":
        return rate >= 50 && rate < 80;
      case "above-80":
        return rate >= 80;
      default:
        return false;
    }
  };

  // Define table columns with built-in filters
  const columns: ColumnsType<ClassData> = [
    {
      title: "ID",
      dataIndex: "class_id",
      key: "class_id",
      render: (id: number) => `Aptis-${id}`,
      fixed: "left",
    },
    {
      title: "Tên lớp",
      dataIndex: "class_name",
      key: "class_name",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Search
            placeholder="Tìm theo tên lớp"
            value={selectedKeys[0] as string}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onSearch={() => confirm()}
            enterButton
          />
          <button
            className="mt-2 text-blue-500"
            onClick={() => {
              clearFilters?.();
              confirm();
            }}
          >
            Xóa lọc
          </button>
        </div>
      ),
      onFilter: (value, record) => record.class_name.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: "Số học viên tối đa",
      dataIndex: "max_students",
      key: "max_students",
      sorter: (a, b) => a.max_students - b.max_students,
    },
    {
      title: "Số buổi đã hoàn thành",
      dataIndex: "completed_sessions",
      key: "completed_sessions",
      sorter: (a, b) => a.completed_sessions - b.completed_sessions,
    },
    {
      title: "Tỷ lệ tham gia (%)",
      dataIndex: "participation_rate",
      key: "participation_rate",
      sorter: (a, b) => a.participation_rate - b.participation_rate,
      filters: [
        { text: "Dưới 50%", value: "below-50" },
        { text: "Từ 50% - 80%", value: "50-80" },
        { text: "Trên 80%", value: "above-80" },
      ],
      onFilter: filterParticipation,
    },
    {
      title: "Tỷ lệ nộp bài (%)",
      dataIndex: "homework_submission_rate",
      key: "homework_submission_rate",
      sorter: (a, b) => a.homework_submission_rate - b.homework_submission_rate,
    },
    {
      title: "Trạng thái lớp",
      dataIndex: "end_date",
      key: "class_status",
      fixed: "right", 
      sorter: sortClassStatus,
      filters: [
        { text: "Đang hoạt động", value: "active" },
        { text: "Sắp kết thúc (≤7 ngày)", value: "expiring" },
        { text: "Đã kết thúc", value: "completed" },
      ],
      onFilter: filterClassStatus,
      render: (end_date: string) => {
        const status = getClassStatus(end_date);
        if (status === "completed") return <span className="text-red-500">Đã kết thúc</span>;
        if (status === "expiring") return <span className="text-orange-500">Sắp kết thúc</span>;
        return <span className="text-green-500">Đang hoạt động</span>;
      },
    },
  ];

  return (
    <section>
      {/* Cards Section */}
      <Row gutter={16} className="mt-4">
        <Col span={5}>
          <Card title="Tổng số lớp học">
            {loading ? <Skeleton.Button active size="large" /> : (
              <Typography className="font-bold text-4xl">{totalClasses}</Typography>
            )}
          </Card>
        </Col>
        <Col span={5}>
          <Card title="Các lớp sắp kết thúc">
            {loading ? <Skeleton.Button active size="large" /> : (
              <Typography className="font-bold text-4xl">{upcomingClosingClasses}</Typography>
            )}
          </Card>
        </Col>
        <Col span={5}>
          <Card title="Các lớp đã kết thúc">
            {loading ? <Skeleton.Button active size="large" /> : (
              <Typography className="font-bold text-4xl">{completedClasses}</Typography>
            )}
          </Card>
        </Col>
      </Row>

      {/* Table Section */}
      <Row className="mt-6">
        <Col span={24}>
          <Card title="Danh sách lớp học">
            <Table<ClassData>
              dataSource={classList}
              columns={columns}
              loading={loading}
              rowKey="class_id"
              pagination={{
                current: pagination?.currentPage || 1,
                total: pagination?.totalRecords || 0,
                pageSize: pagination?.pageSize || 10,
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </Col>
      </Row>
    </section>
  );
}
