import http from "../axios";

export const getOrderTracking = (data) =>
  http({
    url: "/api/order/list",
    method: "POST",
    data,
  });

export const approveOrder = (data) =>
  http({
    url: "/api/order/approve-order",
    method: "POST",
    data,
  });
