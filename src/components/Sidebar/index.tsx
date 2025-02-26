"use client";

import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Layout, Menu, theme } from "antd";
import { userLocalStorage } from "@/services/LocalService";
import Image from "next/image";
import logo from "../../../public/logo-edutech.png";
import { useRouter, usePathname } from "next/navigation";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface SidebarProps {
  setLoading: (value: boolean) => void;
}

export default function Sidebar({ setLoading }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname(); // ✅ Lấy đường dẫn hiện tại
  const [selectedKey, setSelectedKey] = useState<string>(pathname); // ✅ Lưu trạng thái menu

  useEffect(() => {
    const user = userLocalStorage.get();
    if (user) {
      setRole(user.role);
    }
  }, []);

  const handleMenuClick = ({ key }: { key: string }) => {
    setLoading(true);
    setSelectedKey(key); // ✅ Cập nhật trạng thái menu được chọn

    setTimeout(() => {
      setLoading(false);
    }, 1000);

    router.push(key);
  };

  const studentMenu: MenuItem[] = [
    !collapsed ? { key: "group_student", label: "Khu vực học tập", type: "group" } : { type: "divider" },
    { key: "/dashboard/student", label: "Trang chủ", icon: <MailOutlined /> },
    { key: "/dashboard/student/courses", label: "Khóa học của tôi", icon: <SettingOutlined /> },
    { key: "/dashboard/student/schedule", label: "Lịch học", icon: <UserOutlined /> },
    { key: "/dashboard/student/profile", label: "Hồ sơ cá nhân", icon: <UserOutlined /> },
    { key: "/auth/logout", label: "Đăng xuất", icon: <LogoutOutlined /> },
  ];

  const teacherMenu: MenuItem[] = [
    !collapsed ? { label: "Trung tâm", type: "group" } : { type: "divider" },
    { key: "/dashboard/instructor", label: "Trang chủ", icon: <MailOutlined /> },
    {
      key: "sub1",
      label: "Thống kê",
      icon: <MailOutlined />,
      children: [
        { key: "/dashboard/instructor/students", label: "Học viên" },
        { key: "/dashboard/instructor/classes", label: "Lớp học" },
        { key: "/dashboard/instructor/exams", label: "Ngân hàng đề thi" },
      ],
    },
    !collapsed ? { label: "Học tập", type: "group" } : { type: "divider" },
    {
      key: "sub4",
      label: "Lớp học",
      icon: <SettingOutlined />,
      children: [
        { key: "/dashboard/instructor/class-list", label: "Danh sách lớp học" },
        { key: "/dashboard/instructor/schedule", label: "Lịch trống của giảng viên" },
      ],
    },
    {
      key: "sub5",
      label: "Học viên",
      icon: <UserOutlined />,
      children: [
        { key: "/dashboard/instructor/student-list", label: "Danh sách học viên" },
        { key: "/dashboard/instructor/exercises", label: "Bài tập và bài kiểm tra" },
        { key: "/dashboard/instructor/progress", label: "Tiến độ học tập" },
        { key: "/dashboard/instructor/calendar", label: "Lịch học" },
      ],
    },
    !collapsed ? { label: "Hệ thống", type: "group" } : { type: "divider" },
    {
      key: "sub6",
      label: "Tài khoản",
      icon: <UserOutlined />,
      children: [
        { key: "/dashboard/instructor/profile", label: "Thông tin cá nhân" },
        { key: "/dashboard/instructor/settings", label: "Cài đặt bảo mật" },
      ],
    },
    { key: "/auth/logout", label: "Đăng xuất", icon: <LogoutOutlined /> },
  ];

  const items = role === "student" ? studentMenu : teacherMenu;

  const {
    token: { colorBgBase, colorTextBase },
  } = theme.useToken();

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{ background: colorBgBase }}
    >
      <div className="relative px-4">
        <div className="h-16">
          {!collapsed ? (
            <div className="flex items-center text-center w-full h-full">
              <Image src={logo} alt="Logo" width={200} height={600} />
            </div>
          ) : (
            ""
          )}
        </div>
        <Button
          className="absolute -right-4 top-3"
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            color: colorTextBase,
            background: colorBgBase,
          }}
        />
      </div>
      <div style={{ maxHeight: "calc(100vh - 64px)", overflowY: "auto" }}>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ background: colorBgBase, color: colorTextBase }}
          items={items}
          onClick={handleMenuClick}
        />
      </div>
    </Sider>
  );
}
