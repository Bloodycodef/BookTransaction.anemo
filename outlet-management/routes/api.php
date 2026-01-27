<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderSummaryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| All routes here are prefixed with /api
| Make sure client sends: Accept: application/json
*/

// API ROOT (handle /api dan /api/)
Route::get('/', function () {
    return response()->json([
        'message' => 'Outlet Management API',
        'version' => '1.0',
        'endpoints' => [
            'POST /api/login'    => 'Login to get token',
            'GET  /api/me'       => 'Get current user (protected)',
            'POST /api/logout'   => 'Logout (protected)',
            'GET  /api/products' => 'Get products (HO only)',
            'POST /api/orders'   => 'Create order (Outlet only)',
            'GET  /api/my-orders' => 'Get outlet orders',
        ],
    ]);
});

// =======================
// PUBLIC ROUTES
// =======================
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
    Route::get('/my-orders', [OrderController::class, 'myOrders']);

    // HO & Outlet bisa lihat summary masing-masing
    Route::get('/order-summary', [OrderSummaryController::class, 'summary']);
});
