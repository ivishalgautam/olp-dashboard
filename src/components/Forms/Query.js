"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import Title from "../Title";
import { useEffect } from "react";
import { Label } from "../ui/label";
import { FaRegTrashCan } from "react-icons/fa6";

export default function QueryForm({ handleDelete, queryId }) {
  const { register, setValue } = useForm();

  const fetchQueryById = async () => {
    return await http().get(`${endpoints.queries.getAll}/${queryId}`);
  };

  const { data } = useQuery({
    queryFn: fetchQueryById,
    queryKey: [`query-${queryId}`],
    enabled: !!queryId,
  });

  useEffect(() => {
    data && setValue("name", data?.data?.name);
    data && setValue("email", data?.data?.email);
    data && setValue("address", data?.data?.address);
    data && setValue("phone", data?.data?.phone);
    data && setValue("subject", data?.data?.subject);
    data && setValue("message", data?.data?.message);
  }, [data]);

  return (
    <div className="space-y-4">
      <Title text={"Query"} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* name */}
        <div>
          <Label>Name</Label>
          <Input
            disabled
            type="text"
            placeholder="Name"
            {...register("name", {
              required: "required",
            })}
          />
        </div>

        {/* email */}
        <div>
          <Label>Email</Label>
          <Input
            disabled
            type="text"
            placeholder="Email"
            {...register("email", {
              required: "required",
            })}
          />
        </div>

        {/* address */}
        <div>
          <Label>Address</Label>
          <Input
            disabled
            type="text"
            placeholder="Address"
            {...register("address", {
              required: "required",
            })}
          />
        </div>

        {/* phone */}
        <div>
          <Label>Mobile</Label>
          <Input
            disabled
            type="number"
            placeholder="Phone"
            {...register("phone", {
              required: "required",
              valueAsNumber: true,
            })}
          />
        </div>

        {/* subject */}
        <div className="md:col-span-2">
          <Label>Subject</Label>
          <Input
            disabled
            type="text"
            placeholder="Subject"
            {...register("subject", {
              required: "required",
            })}
          />
        </div>

        {/* message */}
        <div className="md:col-span-2">
          <Label>Message</Label>
          <Textarea
            disabled
            placeholder="Message"
            {...register("message", {
              required: "required",
            })}
          />
        </div>
      </div>

      <div>
        <Button
          variant="destructive"
          size="icon"
          type="button"
          onClick={() => handleDelete(queryId)}
        >
          <FaRegTrashCan />
        </Button>
      </div>
    </div>
  );
}
