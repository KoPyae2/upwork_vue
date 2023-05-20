import http from "../axios";

export const getSystemUserList = (data) =>
  http({
    url: "/api/system-user/user-list",
    method: "GET",
    params: data,
  });

export const createSystemUser = (data) =>
  http({
    url: "/api/system-user/create-user",
    method: "POST",
    data,
  });

export const updateSystemUser = (data) =>
  http({
    url: "/api/system-user/update-user",
    method: "POST",
    data,
  });

export const changeStatusSystemUser = (data) =>
  http({
    url: "/api/system-user/user-change-status",
    method: "POST",
    data,
  });

export const deleteSystemUser = (data) =>
  http({
    url: "/api/system-user/user-delete",
    method: "POST",
    data,
  });

export const getRoleList = (data) =>
  http({
    url: "/api/system-user/role-list",
    method: "GET",
    params: data,
  });

export const createRoleList = (data) =>
  http({
    url: "/api/system-user/create-role",
    method: "POST",
    data,
  });

export const updateRoleList = (data) =>
  http({
    url: "/api/system-user/update-role",
    method: "POST",
    data,
  });
