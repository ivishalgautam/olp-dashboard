"use client";

import http from "@/utils/http";
import { CustomerForm } from "../../../components/Forms/Customer.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { isObject } from "@/utils/object";

async function createCustomer(data) {
  return http().post(endpoints.users.getAll, data);
}

export default function Create() {
  const queryClient = useQueryClient();

  const createMutation = useMutation(createCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer created.");
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        console.error(error);
      }
    },
  });

  const handleCreate = async (data) => {
    createMutation.mutate(data);
  };

  return (
    <div className="container mx-auto space-y-4 overflow-y-auto pb-10">
      <CustomerForm type="create" handleCreate={handleCreate} />
    </div>
  );
}
