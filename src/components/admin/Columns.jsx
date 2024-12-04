import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "reporter_username",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="flex items-center space-x-2"
      >
        <span>Reporting User</span>
        <ArrowUpDown className="h-4 w-4 text-gray-500" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("reporter_username")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "reported_username",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="flex items-center space-x-2"
      >
        <span>Reported User</span>
        <ArrowUpDown className="h-4 w-4 text-gray-500" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("reported_username")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "reason",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="flex items-center space-x-2"
      >
        <span>Reason</span>
        <ArrowUpDown className="h-4 w-4 text-gray-500" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("reason")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="flex items-center space-x-2"
      >
        <span>Description</span>
        <ArrowUpDown className="h-4 w-4 text-gray-500" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
        className="flex items-center space-x-2"
      >
        <span>Created At</span>
        <ArrowUpDown className="h-4 w-4 text-gray-500" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("created_at")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
];