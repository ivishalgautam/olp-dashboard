"use client";

import http from "@/utils/http";
import { ProductForm } from "../../../components/Forms/product/Product.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { isObject } from "@/utils/object";
import Title from "@/components/Title";
import { useEffect, useState } from "react";

async function createProduct(data) {
  return http().post(endpoints.products.getAll, data);
}

export default function Create() {
  const queryClient = useQueryClient();

  const createMutation = useMutation(createProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("products");
      toast.success("Product created.");
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
      <ProductForm type="create" handleCreate={handleCreate} />
    </div>
  );
}
