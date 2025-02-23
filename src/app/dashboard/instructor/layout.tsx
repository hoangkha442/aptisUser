"use client";
import Sidebar from "@/components/Sidebar";
import { ReactNode, useEffect, useState } from "react";
import { Layout, ConfigProvider, Spin } from "antd";
import { userLocalStorage } from "@/services/LocalService";
import { authServices } from "@/services/authServices";
import CustomHeader from "@/components/CustomerHeader";

const { Content } = Layout;

interface LayoutProps {
  children: ReactNode;
}

interface User {
  username: string;
  fullName: string;
  avatar: string;
  role: string;
}

const TeacherLayout = ({ children }: LayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const token = userLocalStorage.get()?.token;
    if (token) {
      authServices
        .getUserInfo(token)
        .then((res) => {
          setUser({
            username: res.data.username,
            fullName: res.data.full_name,
            avatar: res.data.profile_image || "",
            role: res.data.role,
          });
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    }
  }, []);

  return (
    <div className="flex">
      <ConfigProvider componentSize="large">
        <Layout className="!h-screen">
          <Sidebar setLoading={setLoading} /> 
          <Layout>
            <CustomHeader user={user} />
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: 280,
                background: "#ffffff",
                borderRadius: 8,
                position: "relative",
              }}
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-50">
                  <Spin size="large" />
                </div>
              )}
              {children}
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </div>
  );
};

export default TeacherLayout;
