import {useState, useEffect} from "react"
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast";

import { columns } from "./Columns";
import api from "../../utils/axios";

export function ReportedUser() {
  const [sorting, setSorting] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [reports, setReports] = useState([])

  useEffect(() => {
      const fetchReports = async () => {
        try {
          const response = await api.get("/report");
          const reports = await response.data.data;
          setReports(
            reports.map((report) => ({
              report_id: report.report_id,
              reporter_id: report.reporter_id,
              reported_id: report.reported_id,
              reason: report.reason,
              description: report.description,
              created_at: report.created_at,
              reporter_username: report.Reporter?.username || "Unknown",
              reported_username: report.Reported?.username || "Unknown",
            }))
          );
        } catch (error) {
          toast.error(error.response.data.message || "Something went wrong");
        }
      };

      fetchReports();
    }, []);

  const table = useReactTable({
    data: reports.length > 0 ? reports : [],
    columns,
    state: { sorting, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const handleDeleteSelected = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedReportedIds = selectedRows.map(row => row.original.reported_id);
    console.log("Selected reported_ids:", selectedReportedIds);

    try {
      await Promise.all(
        selectedReportedIds.map(async (reportedId) => {
          await api.delete(`/account/delete-account/${reportedId}`);
        })
      );
      
      toast.success("Selected reports deleted successfully.");
      
      setReports((prevReports) =>
        prevReports.filter((report) => !selectedReportedIds.includes(report.reported_id))
      );
      setRowSelection({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete reports.");
    }
  };
  

  return (
    <div className="w-full">
      <div className="flex items-center py-4 space-x-4">
        <Input placeholder="Reporting User..."  value={(table.getColumn("reporter_username")?.getFilterValue()) ?? ""} 
          className="max-w-sm ml-12 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(event) => table.getColumn("reporter_username")?.setFilterValue(event.target.value)}
        />   
        <Input placeholder="Reported User..." value={(table.getColumn("reported_username")?.getFilterValue()) ?? ""} 
          className="max-w-sm ml-12 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(event) => table.getColumn("reported_username")?.setFilterValue(event.target.value)}
        />   
        <Input placeholder="Reason..." value={(table.getColumn("reason")?.getFilterValue()) ?? ""} 
          className="max-w-sm ml-12 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(event) => table.getColumn("reason")?.setFilterValue(event.target.value)}
        />   
        <Input placeholder="Description..." value={(table.getColumn("description")?.getFilterValue()) ?? ""} 
          className="max-w-sm ml-12 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
        />   
        <Input placeholder="Reported At..." value={(table.getColumn("created_at")?.getFilterValue()) ?? ""} 
          className="max-w-sm ml-12 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(event) => table.getColumn("created_at")?.setFilterValue(event.target.value)}
        />  
        <Button variant="destructive" className="flex items-center"
          onClick={handleDeleteSelected}
          disabled={Object.keys(rowSelection).filter((id) => rowSelection[id]).length === 0}
        >
          Delete account<Trash className="mr-2 h-4 w-4" />
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="border border-gray-300 text-left">
                      { header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext()) }
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id} className={`text-left border border-gray-300 ${cell.column.columnDef.header === "Description" ? "w-1/2" : "w-1/9"}`}>
                        {cell.column.columnDef.accessorKey === "created_at" ? (
                          new Date(cell.getValue())
                              .toLocaleString("en-GB", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",})
                              .replace(',', '')
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
