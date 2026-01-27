<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * Global HTTP middleware stack
     */
    protected $middleware = [
        \App\Http\Middleware\TrustProxies::class,
        \Illuminate\Http\Middleware\HandleCors::class,
        \App\Http\Middleware\PreventRequestsDuringMaintenance::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \App\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    ];

    /**
     * Middleware groups
     */
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        'api' => [
            // 🔥 WAJIB untuk Sanctum token API
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,

            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    /**
     * Route middleware
     */
    protected $routeMiddleware = [
        // Auth
        'auth' => \App\Http\Middleware\Authenticate::class,
        'auth:sanctum' => \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,

        // Authorization
        'can' => \Illuminate\Auth\Middleware\Authorize::class,

        // Guest
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,

        // Throttle
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,

        // Bindings
        'bindings' => \Illuminate\Routing\Middleware\SubstituteBindings::class,

        // ✅ OPTIONAL (kalau nanti mau pakai di route)
        'role' => \App\Http\Middleware\CheckRole::class,
    ];
}
