"use client";

import http from "@/utils/http";
import { ProductForm } from "../../../../components/Forms/product/Product.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { isObject } from "@/utils/object";

async function updateProduct(data) {
  return http().put(`${endpoints.products.getAll}/${data.id}`, data);
}

export default function Page({ params: { id, type } }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation(updateProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated.");
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
      <ProductForm type={type} productId={id} handleUpdate={handleUpdate} />
    </div>
  );
}
