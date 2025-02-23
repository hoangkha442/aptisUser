"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/slices/authSlice";
import { Button, Input, message, Spin, Form, Card, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { userLocalStorage } from "@/services/LocalService";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const { error, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    const storedUser = userLocalStorage.get();
    console.log('storedUser: ', storedUser);

    if (storedUser && storedUser.token) {
      if (storedUser.role === "student") {
        router.push("/dashboard/student");
      } else if (storedUser.role === "instructor") {
        router.push("/dashboard/instructor");
      } else {
        message.error("Lỗi: Vai trò không hợp lệ!");
      }
    }
  }, [router]);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const userData = await dispatch(loginUser(values)).unwrap();
      userLocalStorage.set(userData);
      if (userData.role === "student") {
        router.push("/dashboard/student");
      } else if (userData.role === "instructor") {
        router.push("/dashboard/instructor");
      } else {
        console.error("Lỗi: Vai trò không hợp lệ", userData.role);
      }
    } catch (err: any) {
      console.error("Lỗi từ server:", err);
    }
  };

  return (
    <Card>
      <Typography.Title level={2} className="text-center mb-4">
        Đăng nhập
      </Typography.Title>

      <Form form={form} layout="vertical" onFinish={handleLogin}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email không được bỏ trống!" },
            { type: "email", message: "Email không đúng định dạng!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Mật khẩu không được bỏ trống" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading} size="large">
            {loading ? <Spin /> : "Đăng nhập"}
          </Button>
        </Form.Item>
      </Form>

      {error && <Typography.Text type="danger">{error}</Typography.Text>}
    </Card>
  );
}
