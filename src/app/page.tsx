"use client"

import { authServices } from "@/services/authServices";
import { userLocalStorage } from "@/services/LocalService";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const storedUser = userLocalStorage.get();
    if (storedUser && storedUser.token) {
      if (storedUser.role === "student") {
        router.push("/dashboard/student");
      } else if (storedUser.role === "instructor") {
        router.push("/dashboard/instructor");
      }
    } else {
      router.push("/auth/login");
    }
  }, [router]);
  return (
    <section>

    </section>
  );
}
