import http from "../axios";

export const getBusinessReport = (data) =>
  http({
    url: "/api/report/business-statistics",
    method: "GET",
    params: data,
  });

export const getUserReport = (data) =>
  http({
    url: "/api/report/user-statistics",
    method: "GET",
    params: data,
  });
export const getPaidReport = (data) =>
  http({
    url: "/api/report/pay-rpt",
    method: "GET",
    params: data,
  });
export const getNoteReport = (data) =>
  http({
    url: "/api/report/note-statistics",
    method: "GET",
    params: data,
  });

export const getGameReport = (data) =>
  http({
    url: "/api/report/game-rpt",
    method: "GET",
    params: data,
  });

export const getDailyReport = (data) =>
  http({
    url: "/api/report/daily-rpt",
    method: "GET",
    params: data,
  });

export const getAgentReport = (data) =>
  http({
    url: "/api/report/agent-rpt",
    method: "GET",
    params: data,
  });

export const getAuditTrail = (data) =>
  http({
    url: "/api/report/audit-trail",
    method: "GET",
    params: data,
  });
export const getOperationStatistics = (data) =>
  http({
    url: "/api/report/operation-statistics",
    method: "GET",
    params: data,
  });
