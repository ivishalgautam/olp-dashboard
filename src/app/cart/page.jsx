"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Small } from "@/components/ui/typography";
import { MdDelete } from "react-icons/md";

const createOrder = (data) => {
  return http().post(endpoints.orders.getAll, { items: data });
};

const fetchTempCart = () => {
  return http().get(endpoints.cart.temp);
};

const deleteCartItem = ({ id }) => {
  return http().delete(`${endpoints.cart.temp}/${id}`);
};

export default function Page() {
  const {
    control,
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { errors },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const queryClient = useQueryClient();

  const { data, isFetching } = useQuery({
    queryFn: fetchTempCart,
    queryKey: ["cart"],
  });

  const createMutation = useMutation(createOrder, {
    onSuccess: (data) => {
      toast.success(data.message);
      remove();
    },
    onError: (error) => {
      console.log({ error });
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation(deleteCartItem, {
    onSuccess: (data) => {
      const index = fields.findIndex((so) => so._id === data.data.id);
      remove(index);
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log({ error });
    },
  });

  const handleDelete = ({ id }) => {
    deleteMutation.mutate({ id });
  };

  useEffect(() => {
    data?.map((prd) =>
      append({
        _id: prd.id,
        product_id: prd.product_id,
        title: prd.title,
        image: prd.pictures[0],
        quantity: "",
      })
    );
  }, [data]);

  const onSubmit = (data) => {
    handleCreate(data.items);
  };

  async function handleCreate(data) {
    createMutation.mutate(data);
  }

  return (
    <div className="bg-white rounded-md p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Table>
          <TableCaption>{fields?.length === 0 && "Empty"}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields?.map((field, key) => (
              <TableRow key={field.id}>
                <TableCell>
                  <div className="relative size-14 rounded-md overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${field.image}`}
                      fill
                      alt={field.title}
                    />
                  </div>
                </TableCell>
                <TableCell>{field.title}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    {...register(`items.${key}.quantity`, {
                      required: "required",
                      valueAsNumber: true,
                    })}
                    placeholder="Enter quantity"
                    className="w-auto"
                  />
                  {errors?.items?.[key] && (
                    <Small className={"text-red-500"}>
                      {errors.items[key]?.["quantity"].message}
                    </Small>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete({ id: field._id })}
                  >
                    <MdDelete size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {fields?.length > 0 && (
          <div className="text-end">
            <Button type="submit" variant="primary">
              Submit query
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
