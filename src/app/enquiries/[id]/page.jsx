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

  useEffect(() => {
    const fetchData = async (id) => {
      const { data } = await http().get(
        `${endpoints.enquiries.getAll}/getByEnquiryId/${id}`
      );
      console.log({ data });
      data && setValue("status", data.status);
      data && setValue("enquiry_status", data.enquiry_status);
      data && setValue("order_type", data.order_type);
      data &&
        data?.items?.map((ord) =>
          append({
            _id: ord.id,
            image: ord.pictures[0],
            title: ord.title,
            quantity: ord.quantity,
            dispatched_quantity: ord.dispatched_quantity,
            enquiry_status: ord.enquiry_status,
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
      enquiry_status: data.enquiry_status,
      order_type: data.order_type,
      items: data.items.map((item) => {
        if (item.enquiry_status !== "partially_available") {
          return { ...item, available_quantity: null };
        }
        if (data.order_type === "order") {
          return { ...item, comment: "" };
        }
        return item;
      }),
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
          <TableCaption>
            {fields?.length > 0 ? "All orders" : "Empty"}
          </TableCaption>
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
                    name={`items.${key}.enquiry_status`}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        required
                        defaultValue={field.value}
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
                    )}
                  />
                  {errors?.items?.[key] && (
                    <Small className={"text-red-500"}>
                      {errors.items[key]?.["status"]?.message}
                    </Small>
                  )}
                </TableCell>

                {/* dispatched quantity */}
                {watch(`items.${key}.enquiry_status`) ===
                  "partially_available" && (
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

        <div className="grid grid-cols-2 gap-4 my-6">
          <div>
            <Label>Enquiry status</Label>

            <Controller
              control={control}
              name={`enquiry_status`}
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

          <div>
            <Label>Convert to order</Label>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select onValueChange={onChange} required value={value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Convert" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Order</SelectItem>
                    <SelectItem value="enquiry">Enquiry</SelectItem>
                  </SelectContent>
                </Select>
              )}
              name="order_type"
            />
            {errors?.status && (
              <Small className={"text-red-500"}>{errors.status.message}</Small>
            )}
          </div>
        </div>

        {fields?.length > 0 && (
          <div className="text-end">
            <Button type="submit" variant="primary">
              Submit query
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
