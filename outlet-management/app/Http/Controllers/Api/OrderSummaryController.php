<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderSummaryController extends Controller
{
    public function summary(Request $request)
    {
        $user = $request->user();

        $query = Order::query();

        // Jika outlet → hanya order miliknya
        if ($user->isOutlet()) {
            $query->where('outlet_id', $user->id);
        }

        $orders = $query->with('items')->get();

        $totalOrders = $orders->count();
        $totalRevenue = $orders->sum('total_price');
        $totalItems = $orders->sum(fn($order) => $order->items->count());
        $totalQuantity = $orders->sum(fn($order) => $order->items->sum('quantity'));

        $statusSummary = $orders->groupBy('status')->map->count();

        return response()->json([
            'total_orders'   => $totalOrders,
            'total_items'    => $totalItems,
            'total_quantity' => $totalQuantity,
            'total_revenue'  => $totalRevenue,
            'status_summary' => $statusSummary,
        ]);
    }
}
