import http from "../axios";

export const getVipPackage = (data) =>
  http({
    url: "/api/admin/vip-package",
    method: "GET",
    params: data,
  });

export const createVipPackage = (data) =>
  http({
    url: "/api/admin/vip-package/create",
    method: "POST",
    data,
  });

export const updateVipPackage = (data) =>
  http({
    url: "/api/admin/vip-package/update",
    method: "POST",
    data,
  });

export const deleteVipPackage = (data) =>
  http({
    url: "/api/admin/vip-package/delete",
    method: "POST",
    data,
  });

export const getCoinPackage = (data) =>
  http({
    url: "/api/admin/vip-point-package",
    method: "GET",
    params: data,
  });

export const createCoinPackage = (data) =>
  http({
    url: "/api/admin/vip-point-package/create",
    method: "POST",
    data,
  });

export const updateCoinPackage = (data) =>
  http({
    url: "/api/admin/vip-point-package/update",
    method: "POST",
    data,
  });

export const deleteCoinPackage = (data) =>
  http({
    url: "/api/admin/vip-point-package/delete",
    method: "POST",
    data,
  });

export const getPaymentMethod = (data) =>
  http({
    url: "/api/admin/payment/list",
    method: "GET",
    params: data,
  });

export const createPaymentMethod = (data) =>
  http({
    url: "/api/admin/payment/create",
    method: "POST",
    data,
  });

export const updatePaymentMethod = (data) =>
  http({
    url: "/api/admin/payment/update",
    method: "POST",
    data,
  });

export const deletePaymentMethod = (data) =>
  http({
    url: "/api/admin/payment/status",
    method: "POST",
    data,
  });

export const getPaymentGateway = (data) =>
  http({
    url: "/api/admin/gateway/list",
    method: "GET",
    params: data,
  });

export const createPaymentGateway = (data) =>
  http({
    url: "/api/admin/gateway/create",
    method: "POST",
    data,
  });

export const updatePaymentGateway = (data) =>
  http({
    url: "/api/admin/gateway/update",
    method: "POST",
    data,
  });

export const deletePaymentGateway = (data) =>
  http({
    url: "/api/admin/gateway/status",
    method: "POST",
    data,
  });

export const getPaymentChannel = (data) =>
  http({
    url: "/api/admin/payment-channel/list",
    method: "GET",
    params: data,
  });

export const createPaymentChannel = (data) =>
  http({
    url: "/api/admin/payment-channel/create",
    method: "POST",
    data,
  });

export const updatePaymentChannel = (data) =>
  http({
    url: "/api/admin/payment-channel/update",
    method: "POST",
    data,
  });

export const updatePaymentChannelStatus = (data) =>
  http({
    url: "/api/admin/payment-channel/status",
    method: "POST",
    data,
  });
