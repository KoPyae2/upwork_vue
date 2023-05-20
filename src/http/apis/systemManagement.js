import http from "../axios";

//Banner
export const getBannerList = (data) =>
  http({
    url: "/api/admin/banners",
    method: "GET",
    params: data,
  });

export const createBannerList = (data) =>
  http({
    url: "/api/admin/banners/create",
    method: "POST",
    data,
  });

export const updateBannerList = (data) =>
  http({
    url: "/api/admin/banners/update",
    method: "POST",
    data,
  });

export const updateBannerStatus = (data) =>
  http({
    url: "/api/admin/banner/status",
    method: "POST",
    data,
  });
export const deleteBannerList = (data) =>
  http({
    url: "/api/admin/banners/delete",
    method: "POST",
    data,
  });
//Notice
export const getNoticeList = (data) =>
  http({
    url: "/api/admin/notices",
    method: "GET",
    params: data,
  });

export const createNoticeList = (data) =>
  http({
    url: "/api/admin/notices/create",
    method: "POST",
    data,
  });

export const updateNoticeList = (data) =>
  http({
    url: "/api/admin/notices/update",
    method: "POST",
    data,
  });

export const updateNoticeStatus = (data) =>
  http({
    url: "/api/admin/notice/status",
    method: "POST",
    data,
  });

export const deleteNoticeList = (data) =>
  http({
    url: "/api/admin/notice/delete",
    method: "POST",
    data,
  });

//City
export const getCityList = (data) =>
  http({
    url: "/api/admin/city/list",
    method: "GET",
    params: data,
  });

export const createCityList = (data) =>
  http({
    url: "/api/admin/city/create",
    method: "POST",
    data,
  });

export const updateCityList = (data) =>
  http({
    url: "/api/admin/city/update",
    method: "POST",
    data,
  });

export const deleteCityList = (data) =>
  http({
    url: "/api/admin/city/delete",
    method: "POST",
    data,
  });
//Province
export const getProvinceList = (data) =>
  http({
    url: "/api/admin/province/list",
    method: "GET",
    params: data,
  });

export const createProvinceList = (data) =>
  http({
    url: "/api/admin/province/create",
    method: "POST",
    data,
  });

export const updateProvinceList = (data) =>
  http({
    url: "/api/admin/province/update",
    method: "POST",
    data,
  });

export const deleteProvinceList = (data) =>
  http({
    url: "/api/admin/province/delete",
    method: "POST",
    data,
  });

//Default City
export const getDefaultLocation = (data) =>
  http({
    url: "/api/admin/location/get",
    method: "GET",
    params: data,
  });

export const getDefaultLocationList = (data) =>
  http({
    url: "/api/admin/location/list",
    method: "GET",
    params: data,
  });

export const updateDefaultLocation = (data) =>
  http({
    url: "/api/admin/location/set",
    method: "POST",
    data,
  });

//System Data
export const getSystemData = (data) =>
  http({
    url: "/api/admin/system_data",
    method: "GET",
    params: data,
  });

export const updateSystemData = (data) =>
  http({
    url: "/api/admin/system_data/update",
    method: "POST",
    data,
  });

//Default Avatar
export const getDefaultAvatar = (data) =>
  http({
    url: "/api/admin/avatar/list?status=3",
    method: "GET",
    params: data,
  });

export const createDefaultAvatar = (data) =>
  http({
    url: "/api/admin/avatar/create",
    method: "POST",
    data,
  });

export const updateDefaultAvatar = (data) =>
  http({
    url: "/api/admin/avatar/update",
    method: "POST",
    data,
  });

//Hot Keywords
export const getHotKeywords = (data) =>
  http({
    url: "/api/admin/system_hot_words",
    method: "GET",
    params: data,
  });

export const updateHotKeywords = (data) =>
  http({
    url: "/api/admin/system_hot_words",
    method: "POST",
    data,
  });

//----------------------------------Image and Video Upload ---------------------
export const appUpload = (data, progress) =>
  http({
    url: "/v2/app-upload/simple-upload",
    method: "POST",
    data,
    onUploadProgress: progress,
  });

//Game List
export const getGameList = (data) =>
  http({
    url: "api/admin/game/list",
    method: "GET",
    params: data,
  });

export const createGameList = (data) =>
  http({
    url: "api/admin/game/create",
    method: "POST",
    params: data,
  });

export const updateGameList = (data) =>
  http({ url: "api/admin/game/update", method: "POST", params: data });

export const deleteGameList = (data) =>
  http({ url: "api/admin/game/delete", method: "POST", params: data });

// AD List
export const creatAD = (data) =>
  http({
    url: "/api/admin/ads/create",
    method: "POST",
    data,
  });
export const getAD = (data) =>
  http({ url: "api/admin/ads/list", method: "GET", params: data });
export const updateAd = (data) =>
  http({
    url: "/api/admin/ads/update",
    method: "POST",
    data,
  });
export const deleteAd = (data) =>
  http({ url: "/api/admin/ads/delete", method: "POST", params: data });

//AD Category List
export const getAdList = (data) =>
  http({ url: "api/admin/ads/type/list", method: "GET", params: data });

export const creatADSlot = (data) =>
  http({
    url: "/api/admin/ads/type/create",
    method: "POST",
    data,
  });

export const updateAdSlot = (data) =>
  http({
    url: "/api/admin/ads/type/update",
    method: "POST",
    data,
  });
export const deleteAdSlot = (data) =>
  http({ url: "/api/admin/ads/type/delete", method: "POST", params: data });

//Banned Keywords
export const getIllegal = (data) =>
  http({
    url: "/api/admin/illegal/list",
    method: "POST",
    params: data,
  });

export const updateIllegal = (data) =>
  http({
    url: "/api/admin/illegal/update",
    method: "POST",
    data,
  });

export const deleteIllegal = (data) =>
  http({
    url: "/api/admin/illegal/delete",
    method: "POST",
    data,
  });

export const createIllegal = (data) =>
  http({
    url: "/api/admin/illegal/create",
    method: "POST",
    data,
  });

//Coin Configuration

export const getCoinConfiguration = () =>
  http({
    url: "/api/coin-config/list",
    method: "POST",
  });

export const updateCoinConfiguration = (data) =>
  http({
    url: "/api/coin-config/update",
    method: "POST",
    data,
  });

export const updateCoinConfigurationStatus = (data) =>
  http({
    url: "/api/coin-config/change-status",
    method: "POST",
    data,
  });

//Version Management

export const getVersion = (data) =>
  http({
    url: "/api/app-package",
    method: "GET",
    params: data,
  });

export const updateVersionStatus = (data) =>
  http({
    url: "/api/app-package/status",
    method: "POST",
    data,
  });

export const updateVersion = (data) =>
  http({
    url: "/api/app-package/update",
    method: "POST",
    data,
  });

export const createVersion = (data) =>
  http({
    url: "api/app-package/create",
    method: "POST",
    data,
  });

//channel management
export const getChannelManagement = (data) =>
  http({
    url: "/api/channel/list",
    method: "GET",
    params: data,
  });

export const createChannelManagement = (data) =>
  http({
    url: "/api/channel/create",
    method: "POST",
    data,
  });

export const updateChannelManagement = (data) =>
  http({
    url: "/api/channel/update",
    method: "POST",
    data,
  });

export const updateChannelManagementStatus = (data) =>
  http({
    url: "/api/channel/status",
    method: "POST",
    data,
  });

//Game redirect
export const getGameRedirect = (data) =>
  http({
    url: "/api/admin/redirect/list",
    method: "GET",
    data,
  });

export const createGameRedirect = (data) =>
  http({
    url: "/api/admin/redirect/create",
    method: "POST",
    data,
  });

export const saveGameRedirect = (data) =>
  http({
    url: "/api/admin/redirect/save",
    method: "POST",
    data,
  });

//System language
export const getSystemLanguags = (data) =>
  http({
    url: "/api/admin/available_lang",
    method: "GET",
    params: data,
  });

export const createSystemLanguage = (data) =>
  http({
    url: "/api/admin/available_lang/create",
    method: "POST",
    data,
  });

export const updateSystemLanguage = (data) =>
  http({
    url: "/api/admin/available_lang/update",
    method: "POST",
    data,
  });

export const deleteSystemLanguage = (data) =>
  http({
    url: "/api/admin/available_lang/delete",
    method: "POST",
    data,
  });

///System Localization
export const getLocalization = (data) =>
  http({
    url: "/api/admin/localzation/get-file",
    method: "GET",
    params: data,
  });
export const updateLocalization = (data) =>
  http({
    url: "/api/admin/localzation/update-file",
    method: "POST",
    data,
  });
export const reloadLocalization = (data) =>
  http({
    url: "/api/admin/localzation/reload",
    method: "POST",
    data,
  });
