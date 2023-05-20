export const paymentManagement = [
  {
    name: "defaultPaymentGateway",
    path: "/paymentManagement/defaultPaymentGateway",
    component: () =>
      import("@/pages/paymentManagement/defaultPaymentGateway/index.vue"),
    meta: {
      title: "default_payment_gateway",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "paymentMethod",
    path: "/paymentManagement/paymentMethod",
    component: () =>
      import("@/pages/paymentManagement/paymentMethod/index.vue"),
    meta: {
      title: "payment_method",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "vipPackage",
    path: "/paymentManagement/vipPackage",
    component: () => import("@/pages/paymentManagement/vipPackage/index.vue"),
    meta: {
      title: "vip_package",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
  {
    name: "coinPackage",
    path: "/paymentManagement/coinPackage",
    component: () => import("@/pages/paymentManagement/coinPackage/index.vue"),
    meta: {
      title: "coin_package",
      auth: true,
      layout: "admin",
      tagsView: true,
    },
  },
];
