export const endpoints = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    refresh: "/auth/refresh",
    username: "/auth/username",
  },

  profile: "/users/me",
  users: { getAll: "/users" },
  products: {
    getAll: "/products",
    admin: "/products/admin/getAll",
    attribute: {
      getAll: "/product-attributes",
      term: "/product-attribute-terms",
    },
  },
  categories: {
    getAll: "/categories",
  },
  banners: {
    getAll: "/banners",
  },
  brands: {
    getAll: "/brands",
  },
  files: {
    upload: "/upload/files",
    getFiles: "/upload",
  },
  cart: {
    getAll: "/carts",
    temp: "/carts/temp-cart",
  },
  orders: {
    getAll: "/orders",
  },
  enquiries: {
    getAll: "/enquiries",
  },
};
