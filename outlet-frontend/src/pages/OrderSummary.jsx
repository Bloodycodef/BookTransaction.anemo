import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OrderSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/order-summary")
      .then((res) => setSummary(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500 animate-pulse">Loading summary...</div>
    );
  }

  if (!summary) {
    return <div className="p-6 text-red-500">Failed to load summary</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Order Summary</h1>
        <p className="text-gray-500">Overview of orders & revenue</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL ORDERS */}
        <div className="bg-white rounded-xl shadow p-5 border-t-4 border-blue-600">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold text-blue-600">
            {summary.total_orders}
          </p>
        </div>

        {/* TOTAL ITEMS */}
        <div className="bg-white rounded-xl shadow p-5 border-t-4 border-purple-600">
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="text-3xl font-bold text-purple-600">
            {summary.total_items}
          </p>
        </div>

        {/* TOTAL QUANTITY */}
        <div className="bg-white rounded-xl shadow p-5 border-t-4 border-yellow-500">
          <p className="text-sm text-gray-500">Total Quantity</p>
          <p className="text-3xl font-bold text-yellow-600">
            {summary.total_quantity}
          </p>
        </div>

        {/* TOTAL REVENUE */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow p-5">
          <p className="text-sm opacity-90">Total Revenue</p>
          <p className="text-3xl font-bold">
            Rp {Number(summary.total_revenue).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
