"use client";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useFetchProducts } from "@/hooks/useFetchProducts";
import ProductCard from "@/components/cards/Product";
import { toast } from "sonner";

const addToCart = (data) => {
  return http().post(`${endpoints.cart.getAll}/temp-cart`, data);
};

export default function Page() {
  const [token] = useLocalStorage("token");
  const { data: products } = useFetchProducts();
  console.log({ products });

  const createMutation = useMutation(addToCart, {
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log({ error });
    },
  });

  const handleAddTocart = async (id) => {
    createMutation.mutate({ product_id: id });
  };

  return (
    <div className="container mx-auto bg-white p-8 rounded-lg border-input">
      <div className="grid grid-cols-4">
        {products?.map((prd) => (
          <ProductCard
            key={prd.id}
            title={prd.title}
            picture={prd.pictures[0]}
            id={prd.id}
            handleAddTocart={handleAddTocart}
          />
        ))}
      </div>
    </div>
  );
}
