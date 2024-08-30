import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
      <div className="rounded-xl bg-gray-100 p-4">
        <div className="mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-white p-4 sm:grid-cols-13 md:gap-4" />
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-gray-200" />
          <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-gray-100 py-4">
      <div className="flex items-center">
        <div className="mr-2 h-8 w-8 rounded-full bg-gray-200" />
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-md bg-gray-200" />
          <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
    </div>
  );
}

export function LatestInvoicesSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}
    >
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-100 p-4">
        <div className="bg-white px-6">
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <div className="flex items-center pb-2 pt-6">
            <div className="h-5 w-5 rounded-full bg-gray-200" />
            <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-gray-100`}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChartSkeleton />
        <LatestInvoicesSkeleton />
      </div>
    </>
  );
}

export function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="h-8 w-6 rounded bg-foreground/40"></div>
      </TableCell>
      <TableCell>
        <div className="h-6 w-32 rounded bg-foreground/40"></div>
      </TableCell>
      <TableCell>
        <div className="h-6 w-32 rounded bg-foreground/40"></div>
      </TableCell>
      <TableCell>
        <div className="h-6 w-32 rounded bg-foreground/40"></div>
      </TableCell>
      <TableCell>
        <div className="h-6 w-32 rounded flex justify-end gap-3">
          <div className="h-6 w-32 rounded bg-foreground/40"></div>
          <div className="h-6 w-32 rounded bg-foreground/40"></div>
          <div className="h-6 w-32 rounded bg-foreground/40"></div>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function MyDocsMobileSkeleton() {
  return (
    <div className="w-[80vw] my-2">
      <Card className="min-w-full">
        <CardHeader>
          <CardTitle>
            <div className="h-8 w-32 rounded bg-foreground/40"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-center w-full mb-2">
            <div className="aspect-[9/16] w-20 rounded bg-foreground/40"></div>
          </div>
          <div className="h-4 w-full rounded bg-foreground/40"></div>
          <div className="h-4 w-3/4 rounded bg-foreground/40"></div>
          <div className="h-4 w-2/3 rounded bg-foreground/40"></div>
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-evenly">
            <div className="h-10 w-1/3 rounded bg-foreground/40"></div>
            <div className="h-10 w-1/3 rounded bg-foreground/40"></div>
            <div className="h-10 w-1/4 rounded bg-foreground/40"></div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export function MyDocsTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="p-2 md:pt-0">

          {/* Mobile Skeleton */}
          <div className="md:hidden gap-2">
            <MyDocsMobileSkeleton />
            <MyDocsMobileSkeleton />
            <MyDocsMobileSkeleton />
            <MyDocsMobileSkeleton />
            <MyDocsMobileSkeleton />
            <MyDocsMobileSkeleton />
          </div>

          {/* Desktop Skeleton */}
          <Table className="hidden md:block">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <span className="sr-only">Document Cover</span>
                </TableHead>
                <TableHead>
                  Title
                </TableHead>
                <TableHead>
                  Description
                </TableHead>
                <TableHead>
                  Category
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
