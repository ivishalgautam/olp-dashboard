"use client";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "../../utils/endpoints.js";
import { toast } from "sonner";
import { isObject } from "@/utils/object";

async function deleteOrder({ id }) {
  return http().delete(`${endpoints.orders.getAll}/${id}`);
}

async function fetchOrders() {
  return http().get(`${endpoints.orders.getAll}`);
}

export default function Products() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchOrders,
    queryKey: ["orders"],
  });

  console.log({ data });

  const deleteMutation = useMutation(deleteOrder, {
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const handleDelete = async ({ id }) => {
    deleteMutation.mutate({ id });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return JSON.stringify(error);
  }

  return (
    <div className="container mx-auto bg-white p-8 rounded-lg border-input">
      <div className="flex items-center justify-between">
        <Title text={"Orders"} />
        <Button asChild>
          <Link href={"/orders/create"}>Create</Link>
        </Button>
      </div>

      <div>
        <DataTable columns={columns(handleDelete)} data={data?.data} />
      </div>
    </div>
  );
}
