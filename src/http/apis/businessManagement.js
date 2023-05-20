import http from "../axios";

//Note Tag
export const getNoteTagList = (data) =>
  http({
    url: "/api/notes/tags",
    method: "GET",
    params: data,
  });

export const getNoteTagType = (data) =>
  http({
    url: "/api/notes/tags/types",
    method: "GET",
    params: data,
  });

export const createNoteTagList = (data) =>
  http({
    url: "/api/notes/tags/create",
    method: "POST",
    data,
  });

export const updateNoteTagList = (data) =>
  http({
    url: "/api/notes/tags/update",
    method: "POST",
    data,
  });

//Note Image
export const getNoteImageList = (data) =>
  http({
    url: "/api/notes",
    method: "GET",
    params: data,
  });

export const deleteNoteList = (data) =>
  http({
    url: "/api/notes/delete",
    method: "POST",
    data,
  });

export const createNoteList = (data) =>
  http({
    url: "/api/notes/create",
    method: "POST",
    data,
  });

export const updateNoteList = (data) =>
  http({
    url: "/api/notes/update",
    method: "POST",
    data,
  });

export const getAuditList = (data) =>
  http({
    url: "/api/notes/audit/reasons",
    method: "GET",
    params: data,
  });

export const updateAuditList = (data) =>
  http({
    url: "/api/notes/audit/update",
    method: "POST",
    data,
  });

//Note Video
export const getNoteVideoList = (data) =>
  http({
    url: "/api/notes",
    method: "GET",
    params: data,
  });

//Note Topic
export const getNoteTopicList = (data) =>
  http({
    url: "/api/notes/topics",
    method: "GET",
    params: data,
  });

export const updateNoteTopicList = (data) =>
  http({
    url: "/api/notes/topics/update",
    method: "POST",
    data,
  });

export const createNoteTopicList = (data) =>
  http({
    url: "/api/notes/topics/create",
    method: "POST",
    data,
  });

//Note Long Video
export const getNoteLongVideoList = (data) =>
  http({
    url: "/api/notes",
    method: "GET",
    params: data,
  });

//Note Long Video Topic
export const getNoteLongVideoTopic = (data) =>
  http({
    url: "/api/vod/topics",
    method: "GET",
    params: data,
  });

export const createNoteLongVideoTopic = (data) =>
  http({
    url: "/api/vod/topics/create",
    method: "POST",
    data,
  });

export const updateNoteLongVideoTopic = (data) =>
  http({
    url: "/api/vod/topics/update",
    method: "POST",
    data,
  });

export const updateNoteLongVideoDivide = (data) =>
  http({
    url: "/api/vod/divide",
    method: "POST",
    data,
  });

//Note Long Video Type
export const getNoteLongVideoType = (data) =>
  http({
    url: "/api/vod/types",
    method: "GET",
    params: data,
  });

export const createNoteLongVideoType = (data) =>
  http({
    url: "/api/vod/types/create",
    method: "POST",
    data,
  });

export const updateNoteLongVideoType = (data) =>
  http({
    url: "/api/vod/types/update",
    method: "POST",
    data,
  });

//Note Long Video Star
export const getNoteLongVideoStar = (data) =>
  http({
    url: "/api/vod/star",
    method: "GET",
    params: data,
  });

export const createNoteLongVideoStar = (data) =>
  http({
    url: "/api/vod/star/create",
    method: "POST",
    data,
  });

export const updateNoteLongVideoStar = (data) =>
  http({
    url: "/api/vod/star/update",
    method: "POST",
    data,
  });

export const updateNoteLongVideoStarStatus = (data) =>
  http({
    url: "/api/vod/star/status",
    method: "POST",
    data,
  });

export const deleteNoteLongVideoStar = (data) =>
  http({
    url: "/api/vod/star/delete",
    method: "POST",
    data,
  });
//Live Video
// export const getLiveVideoComment = (data) =>
//   http({ url: "/api/notes/comment", method: "GET", params: data });

export const getLiveVideoList = (data) =>
  http({
    url: "/api/note-live/list",
    method: "GET",
    params: data,
  });

export const createLiveVideo = (data) =>
  http({
    url: "/api/note-live/create",
    method: "POST",
    data,
  });

export const updateLiveVideo = (data) =>
  http({
    url: "/api/note-live/edit",
    method: "POST",
    data,
  });

export const deleteLiveVideo = (data) =>
  http({
    url: "/api/note-live/delete",
    method: "POST",
    data,
  });

// Live Video Comment List
export const getLiveVideoCommentList = (data) =>
  http({ url: "/api/note-live/comment/list", method: "GET", params: data });

export const deleteLiveVideoComment = (data) =>
  http({
    url: "/api/note-live/comment/delete",
    method: "POST",
    data,
  });

// Live Video Audience List
export const getLiveVideoAudienceList = (data) =>
  http({ url: "/api/note-live/audience/list", method: "GET", params: data });

/////
export const getNoteTopicTypeList = (data) =>
  http({
    url: "/api/notes/topic-type",
    method: "GET",
    params: data,
  });

////Note Tag Type
export const createNoteTagType = (data) =>
  http({
    url: "/api/notes/tags/types/create",
    method: "POST",
    data,
  });

export const updateNoteTagType = (data) =>
  http({
    url: "/api/notes/tags/types/update",
    method: "POST",
    data,
  });

////Note Topic Type
export const getNoteTypeTopicList = (data) =>
  http({
    url: "/api/notes/topics/types",
    method: "GET",
    params: data,
  });

export const createNoteTopicType = (data) =>
  http({
    url: "/api/notes/topics/types/create",
    method: "POST",
    data,
  });

export const updateNoteTopicType = (data) =>
  http({
    url: "/api/notes/topics/types/update",
    method: "POST",
    data,
  });

export const updateImPush = (data) =>
  http({
    url: "/api/notes/im-push",
    method: "POST",
    data,
  });
