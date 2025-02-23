"use client";

import { Layout, Breadcrumb, Avatar, Dropdown, MenuProps, Typography, Divider, Space, message } from "antd";
import { HomeOutlined, UserOutlined, LogoutOutlined, LockOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";

const { Header } = Layout;
const { Text } = Typography;

interface UserProps {
  user: {
    username: string;
    fullName: string;
    avatar: string | null;
    role: string;
  } | null;
}

export default function CustomHeader({ user }: UserProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname(); // ✅ Lấy URL hiện tại

  // ✅ Hàm xử lý Logout
  const handleLogout = () => {
    dispatch(logout());
    message.success("Đăng xuất thành công!");
    router.push("/auth/login");
  };

  // ✅ Định nghĩa Breadcrumb dựa vào URL & Role
  const generateBreadcrumbs = () => {
    const pathArray = pathname.split("/").filter((x) => x); // Bỏ dấu `/` thừa
    let breadcrumbs = [{ title: <HomeOutlined />, href: "/dashboard" }];

    pathArray.forEach((path, index) => {
      const href = `/${pathArray.slice(0, index + 1).join("/")}`;

      // ✅ Định nghĩa tiêu đề động dựa vào path
      const breadcrumbTitle: { [key: string]: string } = {
        dashboard: "Trang chủ",
        student: "Học viên",
        instructor: "Giảng viên",
        courses: "Khóa học",
        schedule: "Lịch học",
        profile: "Hồ sơ cá nhân",
        settings: "Cài đặt",
        students: "Quản lý học viên",
        classes: "Quản lý lớp học",
        exams: "Ngân hàng đề thi",
      };

      breadcrumbs.push({
        title: <span>{breadcrumbTitle[path] || path}</span>,
        href,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  const avatarSrc = user?.avatar && user.avatar !== "" ? user.avatar : null;

  const userMenuItems: MenuProps["items"] = [
    {
      key: "avatar",
      label: (
        <div className="w-44">
          <Space direction="horizontal" size="small" style={{ display: "flex" }}>
            <Avatar size={50} src={avatarSrc} icon={!avatarSrc ? <UserOutlined /> : undefined} />
            <div className="flex flex-col">
              <Text strong>{user?.fullName || "Người dùng"}</Text>
              <Text type="secondary">{user?.role || "Vai trò"}</Text>
            </div>
          </Space>
          <Divider style={{ margin: "10px 0" }} />
        </div>
      ),
    },
    { key: "profile", label: "Thông tin", icon: <InfoCircleOutlined /> },
    { key: "change-password", label: "Đổi mật khẩu", icon: <LockOutlined /> },
    { type: "divider" },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
    { type: "divider" },
    {
      key: "version",
      label: "Aptis - 2025",
      disabled: true,
      style: { textAlign: "center" },
    },
  ];

  return (
    <Header
      style={{
        padding: "0 20px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Breadcrumb items={breadcrumbItems} />

      <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight" arrow>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
        >
          <Avatar size="default" src={avatarSrc} icon={!avatarSrc ? <UserOutlined /> : undefined} />
        </div>
      </Dropdown>
    </Header>
  );
}
