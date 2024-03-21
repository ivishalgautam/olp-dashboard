"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
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
import { useRouter } from "next/navigation";

const createOrder = (data) => {
  return http().put(`${endpoints.orders.getAll}/${data.order_id}`, data);
};

const deleteOrderItem = ({ id }) => {
  return http().delete(`${endpoints.orders.getAll}/order-items/${id}`);
};

export default function Page({ params: { id } }) {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    register,
    watch,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: { status: "", items: [] } });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const queryClient = useQueryClient();

  const fetchOrderById = async () => {
    return await http().get(`${endpoints.orders.getAll}/${id}`);
  };

  const { data } = useQuery({
    queryFn: fetchOrderById,
    queryKey: [`order-${id}`],
    enabled: !!id,
  });

  const createMutation = useMutation(createOrder, {
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(["orders"]);
      router.push("/orders");
    },
    onError: (error) => {
      console.log({ error });
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation(deleteOrderItem, {
    onSuccess: (data) => {
      console.log({ data });
      const index = fields.findIndex((so) => so._id === data.data.id);
      remove(index);
      toast.success(data.message);
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
      const { data } = await http().get(`${endpoints.orders.getAll}/${id}`);
      data && setValue("status", data.status);
      data &&
        data?.items?.map((ord) =>
          append({
            _id: ord.id,
            image: ord.pictures[0],
            title: ord.title,
            quantity: ord.quantity,
            dispatched_quantity: ord.dispatched_quantity,
            status: ord.status,
            comment: ord.comment,
          })
        );
    };
    fetchData(id);
  }, [, id]);

  const onSubmit = (data) => {
    const payload = {
      status: data.status,
      items: data.items,
    };
    handleCreate(payload);
  };

  async function handleCreate(data) {
    createMutation.mutate({ ...data, order_id: id });
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
                          <SelectItem value="partially_dispatched">
                            Partially dispatched
                          </SelectItem>
                          <SelectItem value="dispatched">Dispatched</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
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
                {watch(`items.${key}.status`) === "partially_dispatched" && (
                  <TableCell>
                    <Input
                      type="number"
                      {...register(`items.${key}.dispatched_quantity`, {
                        required: "required",
                        valueAsNumber: true,
                      })}
                      placeholder="Enter dispatched quantity"
                      className="w-auto"
                    />
                    {errors?.items?.[key] && (
                      <Small className={"text-red-500"}>
                        {errors.items[key]?.["dispatched_quantity"]?.message}
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

        <div className="flex items-center justify-center">
          <div className="my-8">
            <Label>Order status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field: { value, onChange } }) => (
                <Select onValueChange={onChange} required value={value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partially_dispatched">
                      Partially dispatched
                    </SelectItem>
                    <SelectItem value="dispatched">Dispatched</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              )}
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
