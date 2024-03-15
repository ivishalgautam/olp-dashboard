"use client";
import Title from "@/components/Title";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import QueryForm from "@/components/Forms/Query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "../../utils/endpoints.js";
import Spinner from "@/components/Spinner";
import { isObject } from "@/utils/object";
import { toast } from "sonner";

async function deleteQuery({ id }) {
  return http().delete(`${endpoints.queries.getAll}/${id}`);
}

async function fetchQueries() {
  return http().get(endpoints.queries.getAll);
}

export default function Queries() {
  const [isModal, setIsModal] = useState(false);
  const [queryId, setQueryId] = useState(null);
  const queryClient = useQueryClient();

  function openModal() {
    setIsModal(true);
  }
  function closeModal() {
    setIsModal(false);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchQueries,
    queryKey: ["queries"],
  });

  const deleteMutation = useMutation(deleteQuery, {
    onSuccess: () => {
      toast.success("Query deleted.");
      queryClient.invalidateQueries({ queryKey: ["queries"] });
      closeModal();
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const handleDelete = async (id) => {
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
        <Title text={"Queries"} />
      </div>
      <div>
        <DataTable columns={columns(openModal, setQueryId)} data={data?.data} />
      </div>

      {isModal && (
        <Modal isOpen={isModal} onClose={closeModal}>
          <QueryForm handleDelete={handleDelete} queryId={queryId} />
        </Modal>
      )}
    </div>
  );
}
