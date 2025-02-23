import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const StudentLayout = ({ children }: LayoutProps) => {
  return (
    <div>
      <main className="p-4">{children}</main>
    </div>
  );
};

export default StudentLayout;
