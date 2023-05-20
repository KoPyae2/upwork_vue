import http from "../axios";

export const login = (data) =>
  http({
    url: "/api/admin/login",
    method: "POST",
    data,
  });

export const logout = (data) =>
  http({
    url: "/api/admin/logout",
    method: "POST",
    data,
  });

export const getHomeInfo = (data) =>
  http({
    url: "/api/admin/home_info",
    method: "GET",
    params: data,
  });

export const getUserInfo = (data) =>
  http({
    url: "/api/admin/check-authen",
    method: "GET",
    params: data,
  });

export const bindOtp = (data) =>
  http({
    url: "/api/admin/bind",
    method: "POST",
    data,
  });
// export const register = (data) =>
// 	http({
// 		url: '/register',
// 		method: 'POST',
// 		data
// 	});
