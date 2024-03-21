"use client";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { DataTable } from "./data-table.jsx";
import { columns } from "./columns.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "../../utils/endpoints.js";
import { toast } from "sonner";
import { isObject } from "@/utils/object";

async function deleteEnquiry({ id }) {
  return http().delete(`${endpoints.enquiries.getAll}/${id}`);
}

async function fetchEnquiries() {
  const { data } = await http().get(`${endpoints.enquiries.getAll}`);
  return data;
}

export default function Products() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchEnquiries,
    queryKey: ["enquiries"],
  });

  const deleteMutation = useMutation(deleteEnquiry, {
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
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
        <Title text={"Enquiries"} />
      </div>

      <div>
        <DataTable columns={columns(handleDelete)} data={data} />
      </div>
    </div>
  );
}
