import { useQuery } from "@tanstack/react-query";
import { endpoints } from "../utils/endpoints.js";
import http from "../utils/http.js";

const fetchCustomers = async () => {
  return await http().get(endpoints.users.getAll);
};

export function useFetchCustomers() {
  return useQuery(["customers"], () => fetchCustomers());
}
