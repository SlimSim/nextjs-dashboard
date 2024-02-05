import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { Revenue } from '@/app/lib/definitions';
import { fetchRevenue } from '@/app/lib/data';

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function RevenueChart({} //  revenue,
: {
  //  revenue: Revenue[];
}) {
  const chartHeight = 350;
  // NOTE: comment in this code when you get to this point in the course

  const revenue = await fetchRevenue();

  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <>
      <div
        className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
        style={{ height: `${chartHeight}px` }}
      >
        {yAxisLabels.map((label) => (
          <p key={label}>{label}</p>
        ))}
      </div>
      {revenue.map((month) => (
        <div key={month.month} className="flex flex-col items-center gap-2">
          <div
            className="w-full rounded-md bg-blue-300"
            style={{
              height: `${(chartHeight / topLabel) * month.revenue}px`,
            }}
          ></div>
          <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
            {month.month}
          </p>
        </div>
      ))}
    </>
  );
}
