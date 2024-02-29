import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

async function fetchBrands() {
  return http().get(endpoints.brands.getAll);
}

export default function useFetchBrands() {
  return useQuery({
    queryFn: fetchBrands,
    queryKey: ["brands"],
  });
}
