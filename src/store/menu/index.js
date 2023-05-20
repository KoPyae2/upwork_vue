import { userManagement } from "./modules/userManagement";
import { businessManagement } from "./modules/businessManagement";
import { moneyManagement } from "./modules/moneyManagement";
import { configurationManagement } from "./modules/configurationManagement";
import { reportManagement } from "./modules/reportManagement";
import { roleManagement } from "./modules/roleManagement";
import { commentManagement } from "./modules/commentManagement";
import { paymentManagement } from "./modules/paymentManagement";
import { orderManagement } from "./modules/orderManagement";
import { feedbackManagement } from "./modules/feedbackManagement";
import { gameManagement } from "./modules/gameManagement";
import { systemManagement } from "./modules/systemManagement";

export const sidebarItem = [
  {
    id: "100",
    name: "dashboard",
    icon: "fa-solid fa-chart-simple",
    type: "page",
    permission: true,
    url: "/home",
    children: null,
    path: [],
    tagsViewAffix: true,
  },
  ...userManagement,
  ...commentManagement,
  ...businessManagement,
  ...gameManagement,
  ...moneyManagement,
  ...orderManagement,
  ...reportManagement,
  ...feedbackManagement,
  ...configurationManagement,
  ...systemManagement,
  ...paymentManagement,
  ...roleManagement,
];
