import { lusitana } from '@/app/ui/fonts';
import CardWrapper, { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { fetchLatestInvoices, fetchCardData } from '../../lib/data';
import { Suspense } from 'react';
import {
  CardSkeleton,
  InvoiceSkeleton,
  RevenueChartSkeleton,
} from '@/app/ui/skeletons';
import RevenueCard from '@/app/ui/dashboard/revenue-card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Page() {
  console.log('dashboard page!');
  /*   const {
    numberOfInvoices,
    totalPaidInvoices,
    totalPendingInvoices,
    numberOfCustomers,
  } = await fetchCardData();

  console.log('totalPendingInvoices', totalPendingInvoices); */

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardSkeleton />}>
          <CardWrapper />
        </Suspense>
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueCard />
        </Suspense>
        <Suspense fallback={<InvoiceSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
