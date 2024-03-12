"use client";
import { Button } from "../../components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import moment from "moment";
import { cn } from "@/lib/utils";
import { Small } from "@/components/ui/typography";

export const columns = (handleDelete) => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <Button variant="ghost">Order Id</Button>;
    },
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <Small className={"bg-primary text-white rounded-full p-1 px-2"}>
          <Link href={`/orders/${id}`}>{id}</Link>
        </Small>
      );
    },
  },
  {
    accessorKey: "customer_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className={`capitalize`}>{row.original.customer_name}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <Button variant="ghost">Status</Button>;
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div>
          <Button
            className={cn("capitalize", {
              "bg-emerald-500 hover:bg-emerald-500/80": status === "completed",
              "bg-orange-500 hover:bg-orange-500/80": status === "pending",
              "bg-rose-500 hover:bg-rose-500/80": status === "cancelled",
              "bg-blue-500 hover:bg-blue-500/80":
                status === "partially_dispatched" || status === "dispatched",
            })}
          >
            {status.split("_").join(" ")}
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <Button variant="ghost">Created At</Button>;
    },
    cell: ({ row }) => {
      return (
        <div>{moment(row.getValue("updated_at")).format("DD/MM/YYYY")}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.getValue("id");
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href={`/orders/${id}`}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete({ id })}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
