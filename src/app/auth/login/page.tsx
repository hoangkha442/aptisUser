import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="!w-96 shadow-xl rounded-lg">
        <LoginForm />
      </div>
    </div>
  );
}
