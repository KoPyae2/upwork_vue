import { moneyManagement } from "./moneyManagement";
import { configurationManagement } from "./configurationManagement";
import { businessManagement } from "./businessManagement";
import { gameManagement } from "./gameManagement";
import { userManagement } from "./userManagement";
import { reportManagement } from "./reportManagement";
import { roleManagement } from "./roleManagement";
import { commentManagement } from "./commentManagement";
import { paymentManagement } from "./paymentManagement";
import { orderManagement } from "./orderManagement";
import { feedbackManagement } from "./feedbackManagement";
import { systemManagement } from "./systemManagement";

export const routes = [
  {
    name: "login",
    path: "/login",
    component: () => import("@/pages/login/index.vue"),
    meta: {
      title: "login",
      auth: false,
    },
  },

  {
    name: "register",
    path: "/register",
    component: () => import("@/pages/register/index.vue"),
    meta: {
      title: "register",
      auth: false,
    },
  },
  {
    name: "Home",
    redirect: "/home",
    path: "/",
    meta: {
      title: "Home",
      auth: true,
      layout: "admin",
      tagsView: false,
    },
  },
  {
    name: "后台首页",
    path: "/home",
    component: () => import("@/pages/home/index.vue"),
    meta: {
      title: "dashboard",
      auth: false,
      layout: "admin",
      tagsView: true,
    },
  },
  ...moneyManagement,
  ...configurationManagement,
  ...businessManagement,
  ...gameManagement,
  ...userManagement,
  ...reportManagement,
  ...roleManagement,
  ...paymentManagement,
  ...orderManagement,
  ...commentManagement,
  ...feedbackManagement,
  ...systemManagement,
];
