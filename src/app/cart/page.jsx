"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import http from "../../utils/http.js";
import { endpoints } from "../../utils/endpoints.js";
import CartForm from "../../components/Forms/Cart.js";

const createOrder = (data) => {
  return http().post(endpoints.orders.getAll, data);
};

const fetchTempCart = async () => {
  return await http().get(endpoints.cart.temp);
};

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data } = useQuery({
    queryFn: fetchTempCart,
    queryKey: ["cart"],
  });

  const createMutation = useMutation(createOrder, {
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries("cart");
      router.push("/");
    },
    onError: (error) => {
      console.log({ error });
      toast.error(error.message);
    },
  });

  const handleCreate = (data) => {
    createMutation.mutate(data);
  };

  return (
    <section className="rounded-md">
      <div className="container">
        <CartForm data={data?.data} handleCreate={handleCreate} />
      </div>
    </section>
  );
}
