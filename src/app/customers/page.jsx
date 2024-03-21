"use client";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useFetchCustomers } from "../../hooks/useFetchCustomers";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import Modal from "@/components/Modal";
import { ProductForm } from "@/components/Forms/product/Product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "../../utils/endpoints.js";
import { toast } from "sonner";
import { isObject } from "@/utils/object";
import { CustomerForm } from "../../components/Forms/Customer.js";
async function deleteCustomer(data) {
  return http().delete(`${endpoints.users.getAll}/${data.id}`);
}

export default function Customers() {
  const [type, setType] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useFetchCustomers();
  function openModal() {
    setIsModal(true);
  }

  function closeModal() {
    setIsModal(false);
  }

  const deleteMutation = useMutation(deleteCustomer, {
    onSuccess: () => {
      toast.success("Customer deleted.");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
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

  const handleDelete = async (data) => {
    deleteMutation.mutate(data);
  };

  async function handleCustomerStatus(customerId, status) {
    try {
      const response = await http().put(
        `${endpoints.users.getAll}/status/${customerId}`,
        { is_active: status }
      );
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    } catch (error) {
      console.log(error);
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return JSON.stringify(error);
  }

  return (
    <div className="container mx-auto bg-white p-8 rounded-lg border-input">
      <div className="flex items-center justify-between">
        <Title text={"Customers"} />
        <Button asChild>
          <Link href={"/customers/create"}>Create</Link>
        </Button>
      </div>

      <div>
        <DataTable
          columns={columns(
            setType,
            openModal,
            setCustomerId,
            handleCustomerStatus
          )}
          data={data}
        />
      </div>

      {isModal && (
        <Modal onClose={closeModal} isOpen={isModal}>
          <CustomerForm
            type={type}
            handleDelete={handleDelete}
            closeModal={closeModal}
            customerId={customerId}
          />
        </Modal>
      )}
    </div>
  );
}
