"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/groups",
  "/wallets",
  "/transactions",
  "/profile",
  "/reports",
];

const AUTH_ROUTES = ["/login", "/register"];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get("access_token");
    const isWaiting2FA = Cookies.get("temp_2fa_valid");

    // 1. Kiểm tra xem route hiện tại có nằm trong danh sách bảo vệ không
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );
    const isAuthRoute = AUTH_ROUTES.includes(pathname);

    if (token) {
      // Đã có token mà còn cố vào trang login/register thì đá vào dashboard
      if (isAuthRoute) {
        router.replace("/dashboard");
      }
    } else {
      // Chưa có token
      if (isWaiting2FA) {
        // Nếu đang chờ 2FA mà vào trang bảo vệ thì bắt quay lại login
        if (isProtectedRoute) {
          router.replace("/login");
        }
      } else if (isProtectedRoute) {
        // Chưa login mà vào trang bảo vệ thì đá về login
        router.replace("/login");
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
}
