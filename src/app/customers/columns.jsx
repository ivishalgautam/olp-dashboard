"use client";
import { Button } from "../../components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Small } from "@/components/ui/typography";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import moment from "moment";

export const columns = (
  setType,
  openModal,
  setCustomerId,
  handleCustomerStatus
) => [
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="capitalize">{row.getValue("first_name")}</div>;
    },
  },
  {
    accessorKey: "mobile_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <Button variant="ghost">Email</Button>;
    },
  },
  {
    accessorKey: "blocked",
    header: ({ column }) => {
      return <Button variant="ghost">Status</Button>;
    },
    cell: ({ row }) => {
      const is_active = row.original.is_active;
      console.log({ is_active });
      const id = row.original.id;
      return (
        <div className="flex items-center justify-start gap-2">
          <Switch
            checked={is_active}
            onCheckedChange={() => handleCustomerStatus(id, !is_active)}
          />
          <Small className={is_active ? "text-green-500" : "text-red-500"}>
            {is_active ? "active" : "inactive"}
          </Small>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <Button variant="ghost">Registered On</Button>;
    },
    cell: ({ row }) => {
      return (
        <div>{moment(row.getValue("created_at")).format("DD/MM/YYYY")}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
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
              <Link href={`/customers/${id}/view`}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/customers/${id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setCustomerId(id);
                setType("delete");
                openModal();
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
