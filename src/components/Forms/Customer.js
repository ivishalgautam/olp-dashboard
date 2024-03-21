"use client";
import React, { useEffect, useState } from "react";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { Controller, useForm } from "react-hook-form";
import Title from "../Title";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FaRegEye } from "react-icons/fa";
import { Checkbox } from "../ui/checkbox";
import ReactSelect from "react-select";

import "react-phone-number-input/style.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { countries } from "../../data/countryCodes";

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

  const [showPasswords, setShowPasswords] = useState({
    password: false,
    cpassword: false,
  });

  console.log(watch());

  const onSubmit = (data) => {
    if (type === "delete") {
      return handleDelete({ id: customerId });
    }

    const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      mobile_number: data.mobile_number,
      country_code: data.country_code.value,
      email: data.email,
      username: data.username,
      password: data.password,
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
        data && setValue("first_name", data?.first_name);
        data && setValue("last_name", data?.last_name);
        data && setValue("mobile_number", data?.mobile_number);
        data && setValue("email", data?.email);
        data && setValue("username", data?.username);
      } catch (error) {
        console.error(error);
      }
    };

    if (customerId && (type === "edit" || type === "view")) {
      fetchData();
    }
  }, [customerId, type]);

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
              <div className="grid grid-cols-2 gap-2">
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

                {/* mobile number */}
                <div>
                  <Label htmlFor="mobile_number">Mobile number</Label>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Controller
                        control={control}
                        rules={{ required: true }}
                        name="country_code"
                        render={({ field }) => (
                          <ReactSelect
                            onChange={field.onChange}
                            value={field.value}
                            options={countries.map(({ code: value, name }) => ({
                              value,
                              label: `${value} ${name}`,
                            }))}
                            placeholder="Country"
                          />
                        )}
                      />
                    </div>
                    <div className="flex-3">
                      <Input
                        {...register("mobile_number", {
                          required: "required",
                        })}
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>
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
                  <div className="col-span-2 grid grid-cols-2 gap-2">
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
                                return "Your passwords do not match";
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
