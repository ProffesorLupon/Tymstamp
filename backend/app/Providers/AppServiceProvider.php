<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\AttendanceService;
use App\Services\LeaveBalanceService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * We register our custom services as singletons, meaning the same instance
     * will be used throughout the entire request lifecycle. This is efficient
     * for stateless services like these.
     */
    public function register(): void
    {
        $this->app->singleton(AttendanceService::class, function ($app) {
            return new AttendanceService();
        });

        $this->app->singleton(LeaveBalanceService::class, function ($app) {
            return new LeaveBalanceService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
