import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../utils/endpoints.js";
import http from "../utils/http.js";

const fetchProducts = async () => {
  const { data } = await http().get(endpoints.products.getAll);
  return data;
};

export function useFetchProducts() {
  return useQuery(["products"], () => fetchProducts());
}
