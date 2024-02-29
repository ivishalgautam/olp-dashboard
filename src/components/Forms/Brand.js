"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Title from "../Title";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useLocalStorage from "@/hooks/useLocalStorage";

export function BrandForm({
  type,
  handleCreate,
  handleUpdate,
  handleDelete,
  closeModal,
  brandId,
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [token] = useLocalStorage("token");
  const [pictures, setPictures] = useState("");

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
      handleDelete(brandId);
    }
    closeModal();
  };

  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values
    const fetchData = async () => {
      try {
        const data = await http().get(
          `${endpoints.brands.getAll}/getById/${brandId}`
        );

        data && setValue("name", data?.name);
      } catch (error) {
        console.error(error);
      }
    };
    if (brandId && (type === "edit" || type === "view" || type === "delete")) {
      fetchData();
    }
  }, [brandId, type]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl">
      <div className="space-y-4 p-2">
        <Title
          text={
            type === "create"
              ? "Add brand"
              : type === "view"
              ? "Brand details"
              : type === "edit"
              ? "Edit brand"
              : "Are you sure you want to delete"
          }
        />
        <div>
          <Input
            type="text"
            disabled={type === "view" || type === "delete"}
            placeholder="Brand Name"
            {...register("name", {
              required: "Brand is required",
            })}
          />
          {errors.name && (
            <span className="text-red-600">{errors.name.message}</span>
          )}
        </div>

        <div className="text-right">
          {type !== "view" && (
            <Button variant={type === "delete" ? "destructive" : "default"}>
              {type === "create"
                ? "Create"
                : type === "edit"
                ? "Update"
                : "Delete"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
