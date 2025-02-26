import { useRouter } from 'next/compat/router';
import { useEffect } from 'react';
import { message } from 'antd'; // if you use antd
import { userLocalStorage } from '@/services/LocalService';
import { roleRedirectPaths } from '@/services/config';

const useRoleRedirect = () => {
  const router = useRouter();
  console.log('router: ', router);

  useEffect(() => {
    if (!router) return;

    const storedUser = userLocalStorage.get();
    console.log('storedUser: ', storedUser);

    if (storedUser && storedUser.token) {
      if (storedUser.role === "student") {
        router.push(roleRedirectPaths.student);
      } else if (storedUser.role === "instructor") {
        router.push(roleRedirectPaths.instructor);
      } else {
        message.error("Lỗi: Vai trò không hợp lệ!");
        router.push(roleRedirectPaths.error);
      }
    }
  }, [router]);
};

export default useRoleRedirect;
