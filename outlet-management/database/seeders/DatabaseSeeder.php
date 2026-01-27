<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Head Office Admin',
            'email' => 'ho@example.com',
            'password' => Hash::make('password'),
            'role' => 'ho',
        ]);

        User::create([
            'name' => 'Outlet 1',
            'email' => 'outlet@example.com',
            'password' => Hash::make('password'),
            'role' => 'outlet',
        ]);

        Product::create([
            'name' => 'Product A',
            'price' => 100000,
            'stock' => 50,
        ]);

        Product::create([
            'name' => 'Product B',
            'price' => 150000,
            'stock' => 30,
        ]);

        Product::create([
            'name' => 'Product C',
            'price' => 200000,
            'stock' => 20,
        ]);
    }
}
