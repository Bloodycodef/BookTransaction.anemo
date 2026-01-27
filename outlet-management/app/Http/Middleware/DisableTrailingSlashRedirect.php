<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DisableTrailingSlashRedirect
{
    public function handle(Request $request, Closure $next): Response
    {
        // Untuk route API, jangan redirect jika tidak ada trailing slash
        if ($request->is('api') && $request->getRequestUri() === '/api') {
            // Tetap proses request tanpa redirect
            return $next($request);
        }

        return $next($request);
    }
}
