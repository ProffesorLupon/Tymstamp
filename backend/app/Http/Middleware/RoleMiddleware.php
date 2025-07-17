<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Middleware to check if a user has a specific role.
 */
class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * This middleware checks if the authenticated user has one of the required roles.
     * Roles are passed as a pipe-separated string from the route definition.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $roles A pipe-separated string of roles (e.g., 'admin|manager').
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $roles)
    {
        // This check is technically redundant if 'auth:sanctum' is used before this middleware,
        // but it provides an extra layer of security.
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        /** @var \App\Models\User $user The authenticated user instance. */
        $user = Auth::user();
        $allowedRoles = explode('|', $roles);

        foreach ($allowedRoles as $role) {
            // The hasRole() method is defined in the User model.
            if ($user->hasRole($role)) {
                return $next($request);
            }
        }

        return response()->json(['message' => 'Forbidden: You do not have the required role to perform this action.'], 403);
    }
}
