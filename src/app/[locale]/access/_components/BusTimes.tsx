import React from 'react'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export type BusTimesProps = { title: React.ReactNode; times: readonly string[] }

export function BusTimes({ title, times }: BusTimesProps) {
  return (
    <div className="space-y-2">
      <h6 className="text-foreground text-sm font-medium">{title}</h6>
      <div className="rounded-md border">
        <Table className="w-full">
          <TableBody className="divide-border divide-y">
            {times.map((time) => (
              <TableRow key={time}>
                <TableCell className="text-center font-medium">{time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

