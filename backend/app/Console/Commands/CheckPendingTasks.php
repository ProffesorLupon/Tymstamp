<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Trip;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Notifications\LongTripReminder;
use App\Notifications\MissedClockOut;
use App\Notifications\LeaveRequestReminder;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;

class CheckPendingTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-pending-tasks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for long-running trips, missed clock-outs, and pending leave requests, and send notifications.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for pending tasks...');

        $this->checkLongTrips();
        $this->checkMissedClockOuts();
        $this->checkPendingLeaveRequests();

        $this->info('All pending tasks checked.');
        return 0;
    }

    /**
     * Find trips that have been active for more than 8 hours and notify the employee.
     */
    private function checkLongTrips()
    {
        $this->line('Checking for long-running trips...');
        $longTrips = Trip::where('status', 'started')
            ->where('start_time', '<=', Carbon::now()->subHours(8))
            ->get();

        if ($longTrips->isEmpty()) {
            $this->info('No long-running trips found.');
            return;
        }

        foreach ($longTrips as $trip) {
            Notification::send($trip->employee->user, new LongTripReminder($trip));
            $this->info("Sent long trip reminder to user ID: {$trip->employee->user->id}");
        }
    }

    /**
     * Find attendance records that have not been clocked out after 12 hours and notify the manager.
     */
    private function checkMissedClockOuts()
    {
        $this->line('Checking for missed clock-outs...');
        $missedClockOuts = Attendance::whereNull('clock_out_time')
            ->where('clock_in_time', '<=', Carbon::now()->subHours(12))
            ->with('employee.manager.user') // Eager load relationships
            ->get();

        if ($missedClockOuts->isEmpty()) {
            $this->info('No missed clock-outs found.');
            return;
        }

        foreach ($missedClockOuts as $attendance) {
            $manager = $attendance->employee->manager;
            if ($manager && $manager->user) {
                Notification::send($manager->user, new MissedClockOut($attendance));
                $this->info("Sent missed clock-out notification to manager ID: {$manager->user->id} for employee ID: {$attendance->employee->id}");
            }
        }
    }

    /**
     * Find leave requests that have been pending for over 24 hours and notify the manager.
     */
    private function checkPendingLeaveRequests()
    {
        $this->line('Checking for pending leave requests...');
        $pendingRequests = LeaveRequest::where('status', 'pending')
            ->where('created_at', '<=', Carbon::now()->subHours(24))
            ->with('employee.manager.user')
            ->get();

        if ($pendingRequests->isEmpty()) {
            $this->info('No overdue pending leave requests found.');
            return;
        }

        foreach ($pendingRequests as $request) {
            $manager = $request->employee->manager;
            if ($manager && $manager->user) {
                Notification::send($manager->user, new LeaveRequestReminder($request));
                $this->info("Sent leave request reminder to manager ID: {$manager->user->id}");
            }
        }
    }
}
