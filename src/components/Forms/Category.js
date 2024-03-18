"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Title from "../Title";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from "sonner";
import axios from "axios";
import Image from "next/image";
import useLocalStorage from "@/hooks/useLocalStorage";
import { isObject } from "@/utils/object";
import { AiOutlineDelete } from "react-icons/ai";
import { Switch } from "@/components/ui/switch";

export function CategoryForm({
  type,
  handleCreate,
  handleUpdate,
  handleDelete,
  categoryId,
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
      is_featured: data.is_featured,
      image: pictures,
    };

    if (type === "create") {
      handleCreate(payload);
    } else if (type === "edit") {
      handleUpdate(payload);
    } else if (type === "delete") {
      handleDelete(categoryId);
    }
  };
  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values
    const fetchData = async () => {
      try {
        const data = await http().get(
          `${endpoints.categories.getAll}/getById/${categoryId}`
        );

        data && setValue("name", data?.name);
        data && setValue("is_featured", data?.is_featured);
        data && setPictures(data?.image);
      } catch (error) {
        console.error(error);
      }
    };
    if (
      categoryId &&
      (type === "edit" || type === "view" || type === "delete")
    ) {
      fetchData();
    }
  }, [categoryId, type]);

  const handleFileChange = async (event) => {
    try {
      const selectedFiles = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFiles);
      console.log("formData=>", formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoints.files.upload}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log({ response });

      setPictures(response.data.path[0]);

      console.log("Upload successful:", response.data.path[0]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
    }
  };

  const deleteFile = async (filePath) => {
    try {
      const resp = await http().delete(
        `${endpoints.files.getFiles}?file_path=${filePath}`
      );
      toast.success(resp?.message);

      setPictures("");
    } catch (error) {
      console.log(error);
      if (isObject(error)) {
        return toast.error(error?.message);
      } else {
        toast.error("error deleting image");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl">
      <div className="space-y-4 p-2">
        <Title
          text={
            type === "create"
              ? "Create category"
              : type === "view"
                ? "Category details"
                : type === "edit"
                  ? "Edit category"
                  : "Are you sure you want to delete"
          }
        />
        <div>
          <Input
            type="text"
            disabled={type === "view" || type === "delete"}
            // className="w-full px-4 py-3 h-[44px] border outline-none rounded-md bg-[#F7F7FC] font-mulish text-xl font-semibold"
            placeholder="Category Name"
            {...register("name", {
              required: "Category is required",
            })}
          />
          {errors.name && (
            <span className="text-red-600">{errors.name.message}</span>
          )}
        </div>

        {pictures ? (
          <div className="relative w-full h-32">
            {type === "edit" || type === "create" ? (
              <button
                type="button"
                className="absolute -top-2 -right-2 rounded-md p-1 bg-red-500 text-white z-10"
                onClick={() => deleteFile(pictures)}
              >
                <AiOutlineDelete />
              </button>
            ) : (
              <></>
            )}
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${pictures}`}
              fill
              objectFit="cover"
              objectPosition="center"
              className="rounded-lg"
              alt="category image"
            />
          </div>
        ) : (
          <div>
            <Label htmlFor="picture">Picture</Label>
            <Input
              {...register("picture", {
                required: "Please select pictures",
              })}
              type="file"
              id="picture"
              multiple
              onChange={handleFileChange}
            />
            {errors.picture && (
              <span className="text-red-600">{errors.picture.message}</span>
            )}
          </div>
        )}

        <div className="flex justify-center gap-1 flex-col mt-4">
          <Label htmlFor="is_featured">Is featured?</Label>
          <Controller
            control={control}
            name="is_featured"
            render={({ field: { onChange, value } }) => (
              <Switch
                onCheckedChange={onChange}
                checked={value}
                disabled={type === "view" || type === "delete"}
              />
            )}
          />
          {errors.is_featured && (
            <span className="text-red-600">{errors.is_featured.message}</span>
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
