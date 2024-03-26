"use client";
import Title from "@/components/Title";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BrandForm } from "@/components/Forms/Brand";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "../../utils/endpoints.js";
import Spinner from "@/components/Spinner";
import { isObject } from "@/utils/object";
import { toast } from "sonner";

async function postBrand(data) {
  return http().post(endpoints.brands.getAll, data);
}

async function updateBrand(data) {
  return http().put(`${endpoints.brands.getAll}/${data.id}`, data);
}

async function deleteBrand(data) {
  return http().delete(`${endpoints.brands.getAll}/${data.id}`);
}

async function fetchBrands() {
  return http().get(endpoints.brands.getAll);
}

export default function Brands() {
  const [isModal, setIsModal] = useState(false);
  const [type, setType] = useState("");
  const [brandId, setBrandId] = useState(null);
  const queryClient = useQueryClient();

  function openModal() {
    setIsModal(true);
  }
  function closeModal() {
    setIsModal(false);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchBrands,
    queryKey: ["brands"],
  });

  const createMutation = useMutation(postBrand, {
    onSuccess: () => {
      toast.success("New brand added.");
      queryClient.invalidateQueries("brands");
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const updateMutation = useMutation(updateBrand, {
    onSuccess: () => {
      toast.success("Brand updated.");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (error) => {
      if (isObject(error)) {
        toast(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const deleteMutation = useMutation(deleteBrand, {
    onSuccess: () => {
      toast.success("Category deleted.");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (error) => {
      if (isObject(error)) {
        toast.error(error.message);
      } else {
        toast.error(error);
      }
    },
  });

  const handleCreate = async (data) => {
    createMutation.mutate(data);
  };

  const handleUpdate = async (data) => {
    updateMutation.mutate({ ...data, id: brandId });
  };

  const handleDelete = async (id) => {
    deleteMutation.mutate({ id: id });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return error.message;
  }

  return (
    <div className="container mx-auto bg-white p-8 rounded-lg border-input">
      <div className="flex items-center justify-between">
        <Title text={"Brands"} />

        <Button
          onClick={() => {
            setType("create");
            openModal();
          }}
        >
          Create
        </Button>
      </div>
      <div>
        <DataTable
          columns={columns(setType, openModal, setBrandId)}
          data={data?.data?.map(({ id, name }) => ({ id, name }))}
        />
      </div>

      {isModal && (
        <Modal isOpen={isModal} onClose={closeModal}>
          <BrandForm
            type={type}
            handleCreate={handleCreate}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            closeModal={closeModal}
            brandId={brandId}
          />
        </Modal>
      )}
    </div>
  );
}
