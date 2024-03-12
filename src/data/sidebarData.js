import { IoStatsChartOutline } from "react-icons/io5";
import { AiOutlineShop } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { GoTag } from "react-icons/go";
import { MdWeb } from "react-icons/md";
import { PiUsersFour } from "react-icons/pi";

// Define the roles for each user type
const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const AllRoutes = [
  {
    label: "Dashboard",
    link: "/",
    icon: IoStatsChartOutline,
    roles: [ROLES.ADMIN, ROLES.USER],
  },
  {
    label: "Products",
    link: "/products",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Products",
    link: "/products/create",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Products",
    link: "/products/[id]/edit",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Products",
    link: "/products/[id]/view",
    icon: AiOutlineShop,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Categories",
    link: "/categories",
    icon: BiCategoryAlt,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Brands",
    link: "/brands",
    icon: GoTag,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Customers",
    link: "/customers",
    icon: PiUsersFour,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Customers",
    link: "/customers/create",
    icon: PiUsersFour,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Customers",
    link: "/customers/[id]/edit",
    icon: PiUsersFour,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Customers",
    link: "/customers/[id]/view",
    icon: PiUsersFour,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Enquiries",
    link: "/enquiries",
    icon: PiUsersFour,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Enquiries",
    link: "/enquiries/create",
    icon: PiUsersFour,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Enquiries",
    link: "/enquiries/[id]",
    icon: PiUsersFour,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Orders",
    link: "/orders",
    icon: PiUsersFour,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Orders",
    link: "/orders/create",
    icon: PiUsersFour,
    roles: [ROLES.ADMIN],
  },
  {
    label: "Orders",
    link: "/orders/[id]",
    icon: PiUsersFour,
    roles: [ROLES.ADMIN],
  },
  {
    label: "All",
    link: "/all",
    icon: PiUsersFour,
    roles: [ROLES.USER],
  },
  {
    label: "Cart",
    link: "/cart",
    icon: PiUsersFour,
    roles: [ROLES.USER],
  },
];
