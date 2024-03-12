"use client";

import http from "@/utils/http";
import { CustomerForm } from "../../../../components/Forms/Customer.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { isObject } from "@/utils/object";
import { useRouter } from "next/navigation.js";

async function updateCustomer(data) {
  return http().put(`${endpoints.users.getAll}/${data.id}`, data);
}

export default function Page({ params: { id, type } }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateMutation = useMutation(updateCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer updated.");
      router.replace("/customers");
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        console.error(error);
      }
    },
  });

  const handleUpdate = async (data) => {
    updateMutation.mutate({ ...data, id: id });
  };

  return (
    <div className="container mx-auto space-y-4 overflow-y-auto pb-10">
      <CustomerForm type={type} handleUpdate={handleUpdate} customerId={id} />
    </div>
  );
}
