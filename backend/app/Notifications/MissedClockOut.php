<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Attendance;

class MissedClockOut extends Notification implements ShouldQueue
{
    use Queueable;

    protected $attendance;

    /**
     * Create a new notification instance.
     */
    public function __construct(Attendance $attendance)
    {
        $this->attendance = $attendance;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail' , 'broadcast']; // This can be expanded to include dashboard alerts
    }

    /**
     * Get the mail representation of the notification.
     *
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail(object $notifiable): MailMessage
    {
        $employeeName = $this->attendance->employee->user->name;
        $clockInTime = $this->attendance->clock_in_time->format('Y-m-d H:i');
        $viewTeamUrl = url('/manager/team-attendance'); // TODO: Replace with frontend URL

        return (new MailMessage)
                    ->subject('⚠️ Missing Clock-Out Alert')
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line("This is an alert that an employee, **{$employeeName}**, may have missed their clock-out.")
                    ->line("**Last Activity:** Clocked in at {$clockInTime}.")
                    ->line('The record has been active for over 12 hours. Please review and, if necessary, manually adjust the timesheet.')
                    ->action('View Team Attendance', $viewTeamUrl);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'attendance_id' => $this->attendance->id,
            'employee_name' => $this->attendance->employee->user->name,
            'message' => $this->attendance->employee->user->name . ' may have missed their clock-out.',
        ];
    }
}
