"use client"

import LoginForm from "@/components/LoginForm";
import useRoleRedirect from "@/hooks/useRoleRedirect";


export default function Home() {
    useRoleRedirect();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="!w-96 shadow-xl rounded-lg">
          <LoginForm />
      </div>
    </div>
  );
}
