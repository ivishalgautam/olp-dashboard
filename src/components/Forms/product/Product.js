"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useFetchCategories } from "../../../hooks/useFetchCategories";
import useLocalStorage from "@/hooks/useLocalStorage.js";
import useFetchBrands from "@/hooks/useFetchBrands";
import { useFetchProducts } from "@/hooks/useFetchProducts";

import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { isObject } from "@/utils/object";
import Select from "react-select";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";
import { Editor } from "primereact/editor";

import Title from "../../Title";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { debounce } from "lodash";

export function ProductForm({
  type,
  handleCreate,
  handleUpdate,
  handleDelete,
  productId,
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { descriptions: [{ key: "", value: "" }] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "descriptions",
  });

  const [text, setText] = useState("");
  const debouncedSetText = debounce(setText, 1000);
  // console.log(watch());
  const [tags, setTags] = useState([]);
  const [pictures, setPictures] = useState([]);
  const { data: categories } = useFetchCategories();
  const [token] = useLocalStorage("token");
  const router = useRouter();
  const editorRef = useRef(null);

  const { data: brands } = useFetchBrands();
  const { data: products } = useFetchProducts();

  const productTypes = [
    { value: "genuine", label: "Genuine" },
    { value: "aftermarket", label: "Aftermarket" },
    { value: "oem", label: "OEM" },
  ];

  const productStatus = [
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
  ];

  const formattedCategories = categories?.data?.map(
    ({ id: value, name: label }) => ({
      value,
      label,
    })
  );

  const formattedBrands = brands?.data?.map(({ id: value, name: label }) => ({
    value,
    label,
  }));

  const formattedProducts = products?.map(({ id: value, title: label }) => ({
    value,
    label,
  }));

  const onSubmit = (data) => {
    if (type === "delete") {
      return handleDelete({ id: productId });
    }

    const payload = {
      title: data.name,
      description: text,
      custom_description: data.descriptions,
      pictures: pictures,
      tags: tags,
      type: data?.product_type.value,
      sku: data?.sku,
      brand_id: data?.brand.value,
      category_id: data?.category?.value,
      status: data?.status?.value,
      is_featured: data?.is_featured,
      related_products: data?.related_products?.map((so) => so.value),
      meta_title: data?.meta_title,
      meta_description: data?.meta_description,
    };

    if (type === "create") {
      handleCreate(payload);
    } else if (type === "edit") {
      handleUpdate(payload);
    }

    reset();
    router.replace("/products");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await http().get(
          `${endpoints.products.getAll}/getById/${productId}`
        );
        data && setValue("name", data?.title);
        data &&
          setValue(
            "category",
            formattedCategories?.find((so) => so.value === data?.category_id)
          );
        data &&
          setValue(
            "product_type",
            productTypes?.find((so) => so.value === data?.type)
          );
        data &&
          setValue(
            "status",
            productStatus?.find((so) => so.value === data?.status)
          );
        data &&
          setValue(
            "brand",
            formattedBrands?.find((so) => so.value === data?.brand_id)
          );
        data &&
          data.custom_description &&
          data?.custom_description?.map(({ key, value }) => {
            remove();
            append({ key, value });
          });
        data && setPictures(data?.pictures);
        data && setTags(data?.tags);
        if (!editorRef.current) {
          data && setText(data?.description);
          editorRef.current = true;
        }
        // data && setValue("description", data?.description);
        data && setValue("is_featured", data?.is_featured);
        data && setValue("sku", data?.sku);
        data && setValue("meta_title", data?.meta_title);
        data && setValue("meta_description", data?.meta_description);
        data?.related_products &&
          setValue(
            "related_products",
            formattedProducts?.filter((so) =>
              data?.related_products?.includes(so.value)
            )
          );
        data && setPictures(data?.pictures);
      } catch (error) {
        console.error(error);
      }
    };

    if (productId && (type === "edit" || type === "view")) {
      fetchData();
    }
  }, [
    productId,
    type,
    formattedCategories?.length,
    formattedBrands?.length,
    formattedProducts?.length,
  ]);

  const handleFileChange = async (event, inputName) => {
    try {
      const selectedFiles = Array.from(event.target.files);
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("file", file);
      });
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

      if (!inputName) {
        setPictures([...pictures, ...response.data.path]);
      }

      setValue(inputName, response.data.path[0]);

      console.log("Upload successful:", response.data.path[0]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
    }
  };

  const deleteFile = async (filePath, inputPath) => {
    try {
      const resp = await http().delete(
        `${endpoints.files.getFiles}?file_path=${filePath}`
      );
      toast.success(resp.message);

      if (!inputPath) {
        return setPictures((prev) => prev.filter((so) => so !== filePath));
      }

      setValue(inputPath, "");
    } catch (error) {
      console.log(error);
      if (isObject(error)) {
        return toast.error(error.message);
      } else {
        toast.error("error deleting image");
      }
    }
  };

  const addTag = () => {
    if (getValues("tag") === "") {
      return toast.warning("Please enter tag name");
    }

    const updatedTags = new Set([...tags, getValues("tag")]);

    updatedTags.add(getValues("tag").trim());
    setTags([...Array.from(updatedTags)]);
    setValue("tag", "");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl">
      <div className="space-y-4">
        {type !== "delete" ? (
          <div className="space-y-4">
            {/* title */}
            <div className="">
              <Title
                text={
                  type === "create"
                    ? "Create product"
                    : type === "view"
                      ? "Product details"
                      : type === "edit"
                        ? "Edit product"
                        : "Are you sure you want to delete"
                }
              />
            </div>

            {/* product info */}
            <div
              id="product-information"
              className="bg-white p-8 rounded-lg border-input shadow-lg space-y-4"
            >
              <Title text={"Product Information"} />
              <div className="grid grid-cols-3 gap-2">
                {/* product name */}
                <div>
                  <Label htmlFor="name">Product name</Label>
                  <Input
                    type="text"
                    disabled={type === "view" || type === "delete"}
                    placeholder="Product Name"
                    {...register("name", {
                      required: "Product name is required",
                    })}
                  />
                  {errors.name && (
                    <span className="text-red-600">{errors.name.message}</span>
                  )}
                </div>

                {/* category */}
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Controller
                    control={control}
                    name="category"
                    maxMenuHeight={230}
                    rules={{ required: "Please select category" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={formattedCategories}
                        placeholder="Select category"
                        isDisabled={type === "view"}
                        className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-sm"
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={
                          typeof document !== "undefined" && document.body
                        }
                        menuPosition="absolute"
                      />
                    )}
                  />

                  {errors.category && (
                    <span className="text-red-600">
                      {errors.category.message}
                    </span>
                  )}
                </div>

                {/* product type */}
                <div>
                  <Label htmlFor="product_type">Product type</Label>
                  <Controller
                    control={control}
                    name="product_type"
                    maxMenuHeight={230}
                    rules={{ required: "Please select category" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={productTypes}
                        placeholder="Select type"
                        isDisabled={type === "view"}
                        className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-sm"
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={
                          typeof document !== "undefined" && document.body
                        }
                        menuPosition="absolute"
                      />
                    )}
                  />

                  {errors.product_type && (
                    <span className="text-red-600">
                      {errors.product_type.message}
                    </span>
                  )}
                </div>

                {/* product status */}
                <div>
                  <Label htmlFor="status">Product Status</Label>
                  <Controller
                    control={control}
                    name="status"
                    maxMenuHeight={230}
                    rules={{ required: "Please select status" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={productStatus}
                        placeholder="Select status"
                        isDisabled={type === "view"}
                        className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-sm"
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={
                          typeof document !== "undefined" && document.body
                        }
                        menuPosition="absolute"
                      />
                    )}
                  />

                  {errors.status && (
                    <span className="text-red-600">
                      {errors.status.message}
                    </span>
                  )}
                </div>

                {/* product brand */}
                <div>
                  <Label htmlFor="brand">Product Brand</Label>
                  <Controller
                    control={control}
                    name="brand"
                    maxMenuHeight={230}
                    rules={{ required: "Please select brand" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={formattedBrands}
                        placeholder="Select brand"
                        isDisabled={type === "view"}
                        className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-sm"
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={
                          typeof document !== "undefined" && document.body
                        }
                        menuPosition="absolute"
                      />
                    )}
                  />

                  {errors.brand && (
                    <span className="text-red-600">{errors.brand.message}</span>
                  )}
                </div>

                {/* sku */}
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    type="text"
                    disabled={type === "view" || type === "delete"}
                    placeholder="SKU"
                    {...register("sku", {
                      required: "SKU is required",
                    })}
                  />
                  {errors.sku && (
                    <span className="text-red-600">{errors.sku.message}</span>
                  )}
                </div>

                {/* tags */}
                <div className="col-span-3">
                  <Label htmlFor="quantity">Tags</Label>
                  <div className="grid grid-cols-12 gap-2 border p-0.5 rounded">
                    <div className="flex flex-wrap items-center col-span-10 gap-2 px-1">
                      {tags?.map((tag, key) => (
                        <span
                          key={key}
                          className="bg-primary rounded-lg p-1 px-2 text-white cursor-pointer"
                          onClick={() => {
                            if (type === "view") return;
                            const updatedTags = tags?.filter(
                              (item) => item !== tag
                            );
                            setTags(updatedTags);
                          }}
                        >
                          {type === "view" ? tag : `${tag} x`}
                        </span>
                      ))}

                      {type !== "view" && (
                        <Input
                          {...register("tag")}
                          type="tag"
                          disabled={type === "view" || type === "delete"}
                          placeholder="Enter tag name"
                          className="w-auto"
                        />
                      )}
                    </div>

                    {type !== "view" && (
                      <div className="col-span-2">
                        <Button
                          type="button"
                          className="w-full"
                          disabled={type === "view"}
                          onClick={addTag}
                        >
                          Add tag
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* related products */}
                <div className="col-span-3">
                  <Label htmlFor="related_products">Related products</Label>
                  <Controller
                    control={control}
                    name="related_products"
                    maxMenuHeight={230}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={formattedProducts}
                        placeholder="Select related products"
                        isDisabled={type === "view"}
                        className="w-full h-[42px] outline-none rounded-md bg-[#F7F7FC] font-mulish text-sm"
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        menuPortalTarget={
                          typeof document !== "undefined" && document.body
                        }
                        menuPosition="absolute"
                      />
                    )}
                  />

                  {errors.status && (
                    <span className="text-red-600">
                      {errors.status.message}
                    </span>
                  )}
                </div>

                {/* description */}
                <div className="col-span-3">
                  <Label htmlFor="description">Description</Label>
                  <Editor
                    focus={editorRef.current}
                    readOnly={type === "view"}
                    name="blog"
                    value={text}
                    onTextChange={(e) => debouncedSetText(e.htmlValue)}
                    style={{ height: "320px" }}
                  />
                </div>

                {/* is featured */}
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
                    <span className="text-red-600">
                      {errors.is_featured.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* custom description */}
            <div className="col-span-3 bg-white p-8 rounded-lg border-input shadow-lg space-y-2">
              <Title text={"Custom descriptions"} />

              <div>
                {fields.map((field, key) => (
                  <div
                    key={key}
                    className="flex items-end justify-center gap-2"
                  >
                    <div className="flex-1">
                      <Label>Name</Label>
                      <Input
                        {...register(`descriptions.${key}.key`, {
                          required: "required",
                        })}
                        placeholder="Custom key"
                        disabled={type === "view"}
                      />
                      {errors.descriptions && (
                        <span className="text-red-600">
                          {errors.descriptions?.[key]?.key?.message}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Label>Value</Label>
                      <Input
                        {...register(`descriptions.${key}.value`, {
                          required: "required",
                        })}
                        placeholder="Custom value"
                        disabled={type === "view"}
                      />
                      {errors.descriptions && (
                        <span className="text-red-600">
                          {errors.descriptions?.[key]?.value?.message}
                        </span>
                      )}
                    </div>
                    {type !== "view" && (
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => remove(key)}
                      >
                        <AiOutlineDelete size={20} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {type !== "view" && (
                <Button type="button" onClick={() => append()}>
                  Add
                </Button>
              )}
            </div>

            {/* product media */}
            <div
              id="product-media"
              className="bg-white p-8 rounded-lg border-input shadow-lg space-y-2"
            >
              <div className="space-y-1">
                <Title text={"Product Media"} />
                <p className="text-gray-400 text-sm">
                  Upload captivating images and videos to make your product
                  stand out.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 gap-y-4">
                {pictures?.length > 0 ? (
                  pictures?.map((picture) => (
                    <div key={picture} className="relative w-48 h-32">
                      <Button
                        type="button"
                        className="absolute -top-2 -right-2 rounded-md bg-red-500 text-white z-10"
                        onClick={() => deleteFile(picture)}
                        disabled={type === "view"}
                      >
                        <AiOutlineDelete size={20} />
                      </Button>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${picture}`}
                        fill
                        objectFit="cover"
                        objectPosition="center"
                        alt="image"
                        className="rounded-xl"
                      />
                    </div>
                  ))
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
                      onChange={(e) => handleFileChange(e, null)}
                    />
                    {errors.picture && (
                      <span className="text-red-600">
                        {errors.picture.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {/* <p className="text-gray-400 text-sm">
                Recommended size (1000px*1248px)
              </p> */}
            </div>

            {/* product seo */}
            <div className="bg-white p-8 rounded-lg border-input shadow-lg space-y-2">
              <Title text={"Product SEO"} />
              <div className="grid grid-cols-1 gap-2">
                {/* meta title */}
                <div>
                  <Label htmlFor={"meta_title"}>Title Tag</Label>
                  <Input
                    type="text"
                    placeholder="Enter title tag"
                    {...register("meta_title", {
                      required: "Please enter title tag.",
                    })}
                    disabled={type === "view"}
                  />
                  {errors.meta_title && (
                    <span className="text-red-600">
                      {errors.meta_title.message}
                    </span>
                  )}
                </div>

                {/* meta descrition */}
                <div>
                  <Label htmlFor={"meta_description"}>
                    Meta Description Tag
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter meta description tag"
                    {...register("meta_description", {
                      required: "Please enter meta description tag.",
                    })}
                    disabled={type === "view"}
                  />
                  {errors.meta_description && (
                    <span className="text-red-600">
                      {errors.meta_description.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Are you sure you want to delete!</p>
        )}

        {/* submit */}
        <div className="text-right">
          {type !== "view" && (
            <Button variant={type === "delete" ? "destructive" : "primary"}>
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
