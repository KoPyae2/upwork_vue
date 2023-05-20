import http from "../axios";

// Auth User
// export const getAuthUser = (data) =>
//   http({
//     url: "/api/user/list",
//     method: "GET",
//     params: data,
//   });

export const createUser = (data) =>
  http({
    url: "/api/user/create-user",
    method: "POST",
    data,
  });

export const updateUser = (data) =>
  http({
    url: "/api/user/user-update",
    method: "POST",
    data,
  });

export const updateUserState = (data) =>
  http({
    url: "/api/user/user-state",
    method: "POST",
    data,
  });

export const updateSuperUser = (data) =>
  http({
    url: "/api/user/change-super-status",
    method: "POST",
    data,
  });

export const updateUserRemark = (data) =>
  http({
    url: "/api/user/user-remark",
    method: "POST",
    data,
  });

export const updateUserDetail = (data) =>
  http({
    url: "/api/user/account-type",
    method: "POST",
    data,
  });

export const addSpinChance = (data) =>
  http({
    url: "/api/user/add-spin-count",
    method: "POST",
    data,
  });
// export const updateUserFreeze = (data) =>
//   http({
//     url: "/api/user/user-freeze",
//     method: "POST",
//     data,
//   });

// export const updateUserUnfreeze = (data) =>
//   http({
//     url: "/api/user/user-unfreeze",
//     method: "POST",
//     data,
//   });

//Normal User
export const getNormalUser = (data) =>
  http({
    url: "/api/user/list",
    method: "GET",
    params: data,
  });

export const createNormalBankUser = (data) =>
  http({
    url: "/api/admin/user/bank/create",
    method: "POST",
    data,
  });

export const updateNormalBankUser = (data) =>
  http({
    url: "/api/admin/user/bank/update",
    method: "POST",
    data,
  });

export const rechargeUser = (data) =>
  http({
    url: "/api/admin/pay",
    method: "POST",
    data,
  });

export const updateUserWatchTime = (data) =>
  http({
    url: "/api/user/user-watch-time",
    method: "POST",
    data,
  });

//User Level
export const getUserLevel = (data) =>
  http({
    url: "/api/users/levels",
    method: "GET",
    params: data,
  });

export const createUserLevel = (data) =>
  http({
    url: "/api/users/levels/create",
    method: "POST",
    data,
  });

export const updateUserLevel = (data) =>
  http({
    url: "/api/users/levels/update",
    method: "POST",
    data,
  });

//FanGroup
export const getFanGroup = (data) =>
  http({
    url: "/api/user/fan_group",
    method: "GET",
    params: data,
  });
export const createFanGroup = (data) =>
  http({
    url: "/api/user/fan_group/create",
    method: "POST",
    data,
  });
