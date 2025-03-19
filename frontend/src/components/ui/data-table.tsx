"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  showHeader?: boolean
  showBorders?: boolean
  alternativeHeaders?: boolean // Whether to show alternative headers
}

export function DataTable<TData, TValue>({
  columns,
  data,
  showHeader = true,
  showBorders = true,
  alternativeHeaders = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Get columns with alternative headers
  const alternativeHeaderColumns = columns.filter(
    column => (column as any).showInHeader === false && (column as any).alternativeHeader
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Alternative headers section */}
      {alternativeHeaders && alternativeHeaderColumns.length > 0 && (
        <div className="flex items-center justify-end space-x-2 py-1">
          {alternativeHeaderColumns.map((column, index) => (
            <div key={index}>
              {typeof (column as any).alternativeHeader === 'function'
                ? (column as any).alternativeHeader(table)
                : (column as any).alternativeHeader}
            </div>
          ))}
        </div>
      )}
      
      <div className={showBorders ? "rounded-md border" : ""}>
        <Table>
          {showHeader && (
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className={!showBorders ? "border-b-0" : undefined}>
                  {headerGroup.headers.map((header) => {
                    // Only render headers for columns that have showInHeader set to true
                    const showInHeader = (header.column.columnDef as any).showInHeader !== false;
                    
                    return (
                      <TableHead key={header.id} className={!showInHeader ? "hidden" : undefined}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
          )}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={!showBorders ? "border-b-0" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className={!showBorders ? "border-b-0" : undefined}>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
