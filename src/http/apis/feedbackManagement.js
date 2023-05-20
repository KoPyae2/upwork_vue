import http from "../axios";

export const getPlayBackFeedback = (data) =>
  http({
    url: "/api/feedback",
    method: "GET",
    params: data,
  });

export const gethelpFeedback = (data) =>
  http({
    url: "/api/feedback/app-help",
    method: "GET",
    params: data,
  });

export const getFeedbackReason = (data) =>
  http({
    url: "/api/feedback-reason/list",
    method: "GET",
    params: data,
  });

export const createFeedbackReason = (data) =>
  http({
    url: "/api/feedback-reason/create",
    method: "POST",
    data,
  });

export const deleteFeedbackReason = (data) =>
  http({
    url: "/api/feedback-reason/delete",
    method: "POST",
    data,
  });
export const updateFeedbackReason = (data) =>
  http({
    url: "/api/feedback-reason/update",
    method: "POST",
    data,
  });

export const getDislikeItem = (data) =>
  http({
    url: "api/dislike/item/list",
    method: "GET",
    params: data,
  });

export const createDislikeItem = (data) =>
  http({
    url: "api/dislike/item/create",
    method: "POST",
    data,
  });

export const updateDislikeItem = (data) =>
  http({
    url: "api/dislike/item/update",
    method: "POST",
    data,
  });

export const deleteDislikeItem = (data) =>
  http({
    url: "api/dislike/item/delete",
    method: "POST",
    data,
  });

export const createDislikeReason = (data) =>
  http({
    url: "api/dislike/reason/create ",
    method: "POST",
    data,
  });

export const updateDislikeReason = (data) =>
  http({
    url: "api/dislike/reason/update ",
    method: "POST",
    data,
  });

export const deleteDislikeReason = (data) =>
  http({
    url: "api/dislike/reason/delete",
    method: "POST",
    data,
  });

//help reason
export const gethelpReason = (data) =>
  http({
    url: "/api/help-reason/list",
    method: "GET",
    params: data,
  });

export const createHelpReason = (data) =>
  http({
    url: "/api/help-reason/create ",
    method: "POST",
    data,
  });
export const updateHelpReason = (data) =>
  http({
    url: "/api/help-reason/update",
    method: "POST",
    data,
  });
export const deleteHelpReason = (data) =>
  http({
    url: "/api/help-reason/delete",
    method: "POST",
    data,
  });
