"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "../../../components/ui/select";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useFetchCustomers } from "@/hooks/useFetchCustomers";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { useFetchProducts } from "@/hooks/useFetchProducts";
import ProductCard from "@/components/cards/Product";
import { toast } from "sonner";

const addToCart = (data) => {
  return http().post(`${endpoints.orders.getAll}`, data);
};

export default function Create() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [token] = useLocalStorage("token");
  const { data } = useFetchCustomers();
  const { data: products } = useFetchProducts();

  const createMutation = useMutation(addToCart, {
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log({ error });
    },
  });

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      image: pictures,
    };

    if (type === "create") {
      handleCreate(payload);
    } else if (type === "edit") {
      handleUpdate(payload);
    } else if (type === "delete") {
      handleDelete(categoryId);
    }
    closeModal();
  };

  const handleAddToCart = async (id) => {
    if (!watch("user_id")) return toast.warning("Please select customer");
    createMutation.mutate({ product_id: id, user_id: watch("user_id") });
  };

  return (
    <div className="container mx-auto bg-white p-8 rounded-lg border-input">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl">
        <div className="space-y-4 p-2">
          <Title text={"Products"} />
          <div>
            <Controller
              name={`user_id`}
              control={control}
              render={({ field: { onChange } }) => (
                <Select onValueChange={onChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.map((cstmr) => (
                      <SelectItem
                        key={cstmr.id}
                        value={cstmr.id}
                      >{`${cstmr.first_name} ${cstmr.last_name}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.name && (
              <span className="text-red-600">{errors.name.message}</span>
            )}
          </div>
        </div>
      </form>

      {watch("user_id") && (
        <div>
          <div className="grid grid-cols-4 gap-2">
            {products?.map((prd) => (
              <ProductCard
                key={prd.id}
                {...prd}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
