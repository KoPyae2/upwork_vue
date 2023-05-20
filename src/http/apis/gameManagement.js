import http from "../axios";

//lottery
export const getLotteryList = (data) =>
  http({
    url: "/api/game/lottery/list",
    method: "GET",
    params: data,
  });

// export const getNoteTagType = (data) =>
//   http({ url: "/api/notes/tags/types", method: "GET", params: data });

export const generateNumber = (data) =>
  http({
    url: "/api/game/lottery/random",
    method: "POST",
    data,
  });

export const cancleLottery = (data) =>
  http({
    url: "/api/game/lottery/cancel",
    method: "POST",
    data,
  });

export const saveNumber = (data) =>
  http({
    url: "/api/game/lottery/save",
    method: "POST",
    data,
  });

//Game
export const getDiscoveryList = (data) =>
  http({
    url: "/api/admin/discovery/list",
    method: "GET",
    params: data,
  });
  export const createDiscoveryList = (data) =>
  http({
    url: "/api/admin/discovery/create",
    method: "POST",
    data,
  });
  export const updateDiscoveryList = (data) =>
  http({
    url: "/api/admin/discovery/update",
    method: "POST",
    data,
  });
  export const deleteDiscoveryList = (data) =>
  http({
    url: "/api/admin/discovery/delete",
    method: "POST",
    data,
  });
export const updateGameRoomList = (data) =>
  http({
    url: "/api/game/room/update",
    method: "POST",
    data,
  });

export const singleGameUpdate = (data) =>
  http({
    url: "/api/game/room/item/update",
    method: "POST",
    data,
  });

export const gameHistory = (data) =>
  http({
    url: "/api/report/game-history",
    method: "GET",
    params: data,
  });

//gift
export const getGiftList = (data) =>
  http({
    url: "/api/admin/gift/list",
    method: "GET",
    params: data,
  });

export const createGiftList = (data) =>
  http({
    url: "/api/admin/gift/create",
    method: "POST",
    data,
  });

export const updateGiftList = (data) =>
  http({
    url: "/api/admin/gift/update",
    method: "POST",
    data,
  });

export const deleteGiftList = (data) =>
  http({
    url: "/api/admin/gift/delete",
    method: "POST",
    data,
  });

//gift history
export const getGiftHistoryList = (data) =>
  http({
    url: "/api/admin/gift/history",
    method: "GET",
    params: data,
  });
