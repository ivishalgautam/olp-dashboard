"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Small } from "@/components/ui/typography";
import { MdDelete } from "react-icons/md";
import { endpoints } from "../../../utils/endpoints";
import { useRouter } from "next/navigation";

const updateEnquiry = (data) => {
  return http().put(`${endpoints.enquiries.getAll}/${data.order_id}`, data);
};

const convertToOrder = ({ id }) => {
  return http().post(`${endpoints.enquiries.getAll}/convertToOrder/${id}`);
};

const deleteOrderItem = ({ id }) => {
  return http().delete(`${endpoints.enquiries.getAll}/order-items/${id}`);
};

export default function Page({ params: { id } }) {
  const {
    control,
    handleSubmit,
    setValue,
    register,
    watch,
    getValues,
    formState: { errors },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateMutation = useMutation(updateEnquiry, {
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries("enquiries");
      router.push("/enquiries");
    },
    onError: (error) => {
      console.log({ error });
      toast.error(error.message);
    },
  });

  const convertToOrderMutation = useMutation(convertToOrder, {
    onSuccess: (data) => {
      toast.success(data?.message ?? "Coverted to order.");
      queryClient.invalidateQueries("enquiries");
      router.push("/enquiries");
    },
    onError: (error) => {
      console.log({ error });
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation(deleteOrderItem, {
    onSuccess: (data) => {
      const index = fields.findIndex((so) => so._id === data.data.id);
      remove(index);
      toast.success("enquiry deleted");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log({ error });
    },
  });

  const handleDelete = ({ id }) => {
    deleteMutation.mutate({ id });
  };

  const handleConvertToOrder = ({ id }) => {
    convertToOrderMutation.mutate({ id });
  };

  useEffect(() => {
    const fetchData = async (id) => {
      const { data } = await http().get(`${endpoints.enquiries.getAll}/${id}`);
      console.log({ data });
      data && setValue("status", data.status);
      data && setValue("user_id", data.user_id);
      data &&
        data?.items?.map((ord) =>
          append({
            _id: ord.id,
            image: ord.pictures[0],
            title: ord.title,
            quantity: ord.quantity,
            status: ord.status,
            available_quantity: ord.available_quantity,
            comment: ord.comment,
          })
        );
    };

    fetchData(id);
  }, [id]);

  const onSubmit = (data) => {
    const payload = {
      status: data.status,
      user_id: data.user_id,
      items: data.items,
    };
    handleCreate(payload);
  };

  async function handleCreate(data) {
    updateMutation.mutate({ ...data, order_id: id });
  }

  return (
    <div className="bg-white rounded-md p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Table>
          {fields?.length === 0 && <TableCaption>Empty</TableCaption>}
          <TableBody>
            {fields?.map((field, key) => (
              <TableRow key={field.id}>
                {/* image */}
                <TableCell>
                  <div className="relative size-14 rounded-md overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${field.image}`}
                      fill
                      alt={field.title}
                    />
                  </div>
                </TableCell>

                {/* name */}
                <TableCell>{field.title}</TableCell>

                {/* quantity */}
                <TableCell>
                  <Input
                    disabled
                    type="number"
                    {...register(`items.${key}.quantity`, {
                      required: "required",
                      valueAsNumber: true,
                    })}
                    placeholder="Enter quantity"
                    className="w-auto"
                  />
                  {errors?.items?.[key] && (
                    <Small className={"text-red-500"}>
                      {errors.items[key]?.["quantity"]?.message}
                    </Small>
                  )}
                </TableCell>

                {/* status */}
                <TableCell>
                  <Controller
                    control={control}
                    name={`items.${key}.status`}
                    render={({ field }) => {
                      return (
                        <Select
                          onValueChange={field.onChange}
                          required
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="partially_available">
                              Partially available
                            </SelectItem>
                            <SelectItem value="not_available">
                              Not available
                            </SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                  {errors?.items?.[key] && (
                    <Small className={"text-red-500"}>
                      {errors.items[key]?.["status"]?.message}
                    </Small>
                  )}
                </TableCell>

                {/* dispatched quantity */}
                {watch(`items.${key}.status`) === "partially_available" && (
                  <TableCell>
                    <Input
                      type="number"
                      {...register(`items.${key}.available_quantity`, {
                        required: "required",
                        valueAsNumber: true,
                      })}
                      placeholder="Enter available quantity"
                      className="w-auto"
                    />
                    {errors?.items?.[key] && (
                      <Small className={"text-red-500"}>
                        {errors.items[key]?.["available_quantity"]?.message}
                      </Small>
                    )}
                  </TableCell>
                )}

                {/* comment */}
                <TableCell>
                  <Input
                    {...register(`items.${key}.comment`)}
                    placeholder="Write comment"
                  />
                  {errors?.items?.[key] && (
                    <Small className={"text-red-500"}>
                      {errors.items[key]?.["comment"]?.message}
                    </Small>
                  )}
                </TableCell>

                {/* action */}
                <TableCell>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete({ id: field._id })}
                  >
                    <MdDelete size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="grid grid-cols-1 my-6">
          <div>
            <Label>Enquiry status</Label>
            <Controller
              control={control}
              name={`status`}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  required
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partially_available">
                      Partially available
                    </SelectItem>
                    <SelectItem value="not_available">Not available</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors?.items?.[key] && (
              <Small className={"text-red-500"}>
                {errors.items[key]?.["enquiry_status"]?.message}
              </Small>
            )}
          </div>
        </div>

        {fields?.length > 0 && (
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="default"
              onClick={() => handleConvertToOrder({ id })}
            >
              Convert to order
            </Button>
            <Button type="submit" variant="primary">
              Submit query
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
