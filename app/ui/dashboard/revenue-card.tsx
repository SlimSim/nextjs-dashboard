import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { Revenue } from '@/app/lib/definitions';
import { fetchRevenue } from '@/app/lib/data';
import { Suspense } from 'react';
import RevenueChart from './revenue-chart';

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function RevenueCard({} //  revenue,
: {
  //  revenue: Revenue[];
}) {
  const chartHeight = 350;
  // NOTE: comment in this code when you get to this point in the course

  //  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>
      {/* NOTE: comment in this code when you get to this point in the course */}

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 sm:grid-cols-13 md:gap-4">
          <Suspense>
            <RevenueChart />
          </Suspense>
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
