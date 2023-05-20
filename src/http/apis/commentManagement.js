import http from "../axios";

/**
 * @Comments
 */
export const getCommentList = (data) =>
  http({ url: "/api/notes/comment", method: "GET", params: data });

export const updateComment = (data) =>
  http({
    url: "/api/notes/comment/update",
    method: "POST",
    data,
  });

export const changeCommentStatus = (data) =>
  http({
    url: "/api/notes/comment/change-status",
    method: "POST",
    data,
  });

export const deleteComment = (data) =>
  http({
    url: "/api/notes/comment/delete-comment",
    method: "POST",
    data,
  });

export const commentSetting = (data) =>
  http({
    url: "/api/notes/comment/comment-setting",
    method: "POST",
    data,
  });

export const getCommentReply = (data) =>
  http({
    url: "/api/notes/comment/reply-volume",
    method: "POST",
    data,
  });
export const banComment = (data) =>
  http({
    url: "/api/notes/comment/ban",
    method: "POST",
    data,
  });
// export const getCommentReply = (data) =>
//   http({
//     url: "/api/notes/comment/reply-volume",
//     method: "GET",
//     params: data,
//   });

/**
 * @Comments_Reply
 */
export const getCommentReplyList = (data) =>
  http({ url: "/api/notes/comment-reply", method: "GET", params: data });

export const updateCommentReply = (data) =>
  http({
    url: "/api/notes/comment-reply/update",
    method: "POST",
    data,
  });

export const changeCommentReplyStatus = (data) =>
  http({
    url: "/api/notes/comment-reply/change-status",
    method: "POST",
    data,
  });

export const deleteCommentReply = (data) =>
  http({
    url: "/api/notes/comment-reply/delete",
    method: "POST",
    data,
  });

export const commentReplySetting = (data) =>
  http({
    url: "/api/notes/comment-reply/comment-setting",
    method: "POST",
    data,
  });
