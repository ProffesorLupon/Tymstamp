<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\CheckPendingTasks::class,
    ];

    /**
     * Define the application's command schedule.
     * This method is called by the framework to schedule tasks.
     * 
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();

        // Schedule the command to run hourly. This can be adjusted as needed.
        // For example, use ->everyFifteenMinutes() for more frequent checks.
        $schedule->command('app:check-pending-tasks')->hourly();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
