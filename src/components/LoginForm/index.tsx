"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/slices/authSlice";
import { Button, Input, message, Spin, Form, Card, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { userLocalStorage } from "@/services/LocalService";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const { error, loading } = useAppSelector((state) => state.auth);

  const [form] = Form.useForm()

  
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const userData = await dispatch(loginUser(values)).unwrap();
      userLocalStorage.set(userData);
    } catch (err) {
      message.error(error || "Login failed")
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
          rules={[{ required: true, message: "Email không được bỏ trống!" }, { type: "email", message: "Email không đúng định dạng!" }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Mật khẩu không được bỏ trống" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading} size="large">
            {loading ? <Spin /> : "Login"}
          </Button>
        </Form.Item>
      </Form>

      {error && <Typography.Text type="danger">{error}</Typography.Text>}
    </Card>
  );
}
