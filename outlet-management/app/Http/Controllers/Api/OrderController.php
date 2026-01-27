<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index()
    {
        $user = request()->user();

        if ($user->isHeadOffice()) {
            $orders = Order::with(['outlet', 'items.product'])->get();
        } else {
            $orders = Order::with(['items.product'])
                ->where('outlet_id', $user->id)
                ->get();
        }

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user->isOutlet()) {
            return response()->json(['message' => 'Only outlets can create orders'], 403);
        }

        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Calculate total price and validate stock
        $totalPrice = 0;
        $items = [];

        foreach ($request->items as $item) {
            $product = Product::findOrFail($item['product_id']);

            if ($product->stock < $item['quantity']) {
                return response()->json([
                    'message' => "Insufficient stock for product: {$product->name}"
                ], 400);
            }

            $subtotal = $product->price * $item['quantity'];
            $totalPrice += $subtotal;

            $items[] = [
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price,
                'subtotal' => $subtotal,
            ];
        }

        // Create order
        $order = Order::create([
            'outlet_id' => $user->id,
            'total_price' => $totalPrice,
            'status' => 'pending',
        ]);

        // Create order items and update product stock
        foreach ($items as $item) {
            $order->items()->create([
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);

            // Update product stock
            $product = Product::find($item['product_id']);
            $product->stock -= $item['quantity'];
            $product->save();
        }

        return response()->json($order->load('items.product'), 201);
    }

    public function show($id)
    {
        $user = request()->user();

        $query = Order::with(['outlet', 'items.product'])
            ->where('id', $id);

        // Jika outlet → hanya boleh ambil order miliknya
        if ($user->isOutlet()) {
            $query->where('outlet_id', $user->id);
        }

        $order = $query->first();

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json($order);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();

        if (!$user->isHeadOffice()) {
            return response()->json(['message' => 'Only head office can update orders'], 403);
        }

        $order = Order::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,paid,shipped',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order->update(['status' => $request->status]);

        return response()->json($order->load('items.product'));
    }

    public function myOrders(Request $request)
    {
        $orders = Order::with(['items.product'])
            ->where('outlet_id', $request->user()->id)
            ->get();

        return response()->json($orders);
    }
}
