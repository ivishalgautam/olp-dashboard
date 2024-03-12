"use client";
import React, { useEffect, useState } from "react";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Controller, useForm } from "react-hook-form";
import useLocalStorage from "@/hooks/useLocalStorage.js";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
import { isObject } from "@/utils/object";
import { AiOutlineDelete } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import Title from "../Title";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import moment from "moment";
import { FaRegEye } from "react-icons/fa";
import { Checkbox } from "../ui/checkbox";

export function CustomerForm({
  type,
  handleCreate,
  handleUpdate,
  handleDelete,
  customerId,
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
  } = useForm();
  const [text, setText] = useState("");
  console.log(text);
  const [profile, setProfile] = useState("");
  const [birthDate, setBirthDate] = React.useState();
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    cpassword: false,
  });
  const [token] = useLocalStorage("token");
  const router = useRouter();

  const onSubmit = (data) => {
    if (type === "delete") {
      return handleDelete({ id: customerId });
    }

    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      mobile_number: data.mobile_number,
      email: data.email,
      username: data.username,
      password: data.password,
      image_url: profile,
      birth_date: moment(birthDate).format("YYYY-MM-DD"),
    };

    if (type === "create") {
      handleCreate(payload);
    } else if (type === "edit") {
      handleUpdate(payload);
    }

    reset();
  };

  useEffect(() => {
    // Fetch data from API and populate the form with prefilled values
    const fetchData = async () => {
      try {
        const data = await http().get(
          `${endpoints.users.getAll}/${customerId}`
        );
        console.log({ data });
        data && setValue("first_name", data?.first_name);
        data && setValue("last_name", data?.last_name);
        data && setValue("mobile_number", data?.mobile_number);
        data && setValue("email", data?.email);
        data && setValue("username", data?.username);
        data && setProfile(data?.image_url);
        data && setBirthDate(new Date(data?.birth_date));
      } catch (error) {
        console.error(error);
      }
    };

    if (customerId && (type === "edit" || type === "view")) {
      fetchData();
    }
  }, [customerId, type]);

  console.log({ birthDate });

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

      setProfile(response.data.path[0]);
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
      toast.success(resp.message);

      setProfile("");
    } catch (error) {
      console.log(error);
      if (isObject(error)) {
        return toast.error(error.message);
      } else {
        toast.error("error deleting image");
      }
    }
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
                    ? "Create customer"
                    : type === "view"
                      ? "Customer details"
                      : type === "edit"
                        ? "Edit customer"
                        : "Are you sure you want to delete"
                }
              />
            </div>

            {/* product info */}
            <div
              id="product-information"
              className="bg-white p-8 rounded-lg border-input shadow-lg space-y-4"
            >
              <div className="grid grid-cols-3 gap-2">
                {/* first name */}
                <div>
                  <Label htmlFor="first_name">Firstname</Label>
                  <Input
                    type="text"
                    disabled={type === "view" || type === "delete"}
                    placeholder="FirstName"
                    {...register("first_name", {
                      required: "required",
                    })}
                  />
                  {errors.first_name && (
                    <span className="text-red-600">
                      {errors.first_name.message}
                    </span>
                  )}
                </div>

                {/* last name */}
                <div>
                  <Label htmlFor="last_name">Lastname</Label>
                  <Input
                    type="text"
                    disabled={type === "view" || type === "delete"}
                    placeholder="Lastname"
                    {...register("last_name")}
                  />
                </div>

                {/* profile image */}
                <div>
                  {profile ? (
                    <div key={profile} className="relative w-48 h-32">
                      <Button
                        type="button"
                        className="absolute -top-2 -right-2 rounded-md bg-red-500 text-white z-10"
                        onClick={() => deleteFile(profile)}
                        disabled={type === "view"}
                      >
                        <AiOutlineDelete size={20} />
                      </Button>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${profile}`}
                        fill
                        objectFit="cover"
                        objectPosition="center"
                        alt="image"
                        className="rounded-xl"
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="profile">Profile</Label>
                      <Input
                        {...register("profile", {
                          required: "required",
                        })}
                        type="file"
                        id="profile"
                        multiple
                        onChange={(e) => handleFileChange(e)}
                      />
                      {errors.profile && (
                        <span className="text-red-600">
                          {errors.profile.message}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* mobile number */}
                <div>
                  <Label htmlFor="mobile_number">Mobile number</Label>
                  <Input
                    type="text"
                    disabled={type === "view" || type === "delete"}
                    placeholder="Mobile number"
                    {...register("mobile_number", {
                      required: "required",
                    })}
                  />
                  {errors.mobile_number && (
                    <span className="text-red-600">
                      {errors.mobile_number.message}
                    </span>
                  )}
                </div>

                {/* email */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="text"
                    disabled={type === "view" || type === "delete"}
                    placeholder="Email"
                    {...register("email", {
                      required: "required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Entered value does not match email format",
                      },
                    })}
                  />
                  {errors.email && (
                    <span className="text-red-600">{errors.email.message}</span>
                  )}
                </div>

                {/* birth date */}
                <div className="w-full">
                  <Label htmlFor="birth_date">Birthdate</Label>
                  <div>
                    <Controller
                      name="birth_date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          disabled={type === "view"}
                          onSelect={field.onChange}
                          setBirthDate={setBirthDate}
                          birthDate={birthDate}
                        />
                      )}
                    />
                  </div>
                  {errors.birth_date && (
                    <span className="text-red-600">
                      {errors.birth_date.message}
                    </span>
                  )}
                </div>

                {/* username */}
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    type="text"
                    disabled={type === "view" || type === "delete"}
                    placeholder="Username"
                    {...register("username", {
                      required: "required",
                    })}
                  />
                  {errors.username && (
                    <span className="text-red-600">
                      {errors.username.message}
                    </span>
                  )}
                </div>

                {type === "edit" && (
                  <div className="col-span-3 flex items-center justify-start mt-4 gap-2">
                    <Label htmlFor="change_password">Change password</Label>
                    <Controller
                      name="change_password"
                      control={control}
                      render={({ field }) => (
                        <Checkbox onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>
                )}

                {/* passwords */}
                {(type === "create" || watch("change_password")) && (
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          type={showPasswords.password ? "text" : "password"}
                          disabled={type === "view" || type === "delete"}
                          placeholder="Password"
                          {...register("password", {
                            required: "required",
                          })}
                        />
                        <div
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              password: !prev.password,
                            }))
                          }
                        >
                          <FaRegEye />
                        </div>
                      </div>
                      {errors.password && (
                        <span className="text-red-600">
                          {errors.password.message}
                        </span>
                      )}
                    </div>

                    {/* confirm password */}
                    <div className="relative">
                      <Label htmlFor="confirm_password">Confirm password</Label>
                      <div className="relative">
                        <Input
                          type={showPasswords.cpassword ? "text" : "password"}
                          disabled={type === "view" || type === "delete"}
                          placeholder="Confirm password"
                          {...register("confirm_password", {
                            required: "required",
                            validate: (val) => {
                              if (watch("password") != val) {
                                return "Your passwords do no match";
                              }
                            },
                          })}
                        />
                        <div
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              cpassword: !showPasswords.cpassword,
                            }))
                          }
                        >
                          <FaRegEye />
                        </div>
                      </div>
                      {errors.confirm_password && (
                        <span className="text-red-600">
                          {errors.confirm_password.message}
                        </span>
                      )}
                    </div>
                  </div>
                )}
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
