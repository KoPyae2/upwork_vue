import http from "../axios";

//Bank
export const getBankList = (data) =>
  http({
    url: "/api/admin/payment/list",
    method: "GET",
    params: data,
  });

export const createBankList = (data) =>
  http({
    url: "/api/admin/payment/create",
    method: "POST",
    data,
  });

export const updateBankList = (data) =>
  http({
    url: `/api/admin/payment/update`,
    method: "POST",
    data,
  });

export const updateBankStatus = (data) =>
  http({
    url: `/api/admin/payment/status`,
    method: "POST",
    data,
  });

export const deleteBankList = (data) =>
  http({
    url: `/api/admin/payment/delete`,
    method: "POST",
    data,
  });

// User Bank
export const getUserBankList = (data) =>
  http({
    url: "/api/admin/user/bank/list",
    method: "GET",
    params: data,
  });

export const updateUserBankList = (id, data) =>
  http({
    url: `/api/admin/user/bank/update`,
    method: "POST",
    data,
  });

export const deleteUserBankList = (data) =>
  http({
    url: `/api/admin/user/bank/delete`,
    method: "POST",
    data,
  });

//Withdraw
export const getWithdraw = (data) =>
  http({
    url: "/api/withdraw/list",
    method: "GET",
    params: data,
  });

export const updateWithdrawStatus = (data) =>
  http({
    url: `/api/withdraw/update-withdraw`,
    method: "POST",
    data,
  });

//Withdraw Config
export const getWithdrawConfig = (data) =>
  http({
    url: "/api/admin/withdraw-config/get",
    method: "GET",
    params: data,
  });

export const updateWithdrawConfig = (data) =>
  http({
    url: `/api/admin/withdraw-config/set`,
    method: "POST",
    data,
  });

//Recharge
export const getRechargeList = (data) =>
  http({
    url: "/api/user/recharge-list",
    method: "GET",
    params: data,
  });

//Withdraw
export const getWithdrawList = (data) =>
  http({
    url: "/api/withdraw/list",
    method: "GET",
    params: data,
  });

export const updateWithdrawList = (data) =>
  http({
    url: `/api/withdraw/update-withdraw`,
    method: "POST",
    data,
  });

//Purchase
export const getPurchaseReport = (data) =>
  http({
    url: "/api/report/user-purchase",
    method: "GET",
    params: data,
  });

export const getTeaCoinReport = (data) =>
  http({
    url: "/api/report/tea-coin-record",
    method: "GET",
    params: data,
  });

export const getGoldCoinReport = (data) =>
  http({
    url: "/api/report/gold-coin-record",
    method: "GET",
    params: data,
  });
