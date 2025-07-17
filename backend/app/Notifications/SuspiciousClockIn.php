<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Attendance;

class SuspiciousClockIn extends Notification implements ShouldQueue
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
        return ['mail']; // Can be expanded to include dashboard alerts
    }

    /**
     * Get the mail representation of the notification.
     *
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail(object $notifiable): MailMessage
    {
        $employeeName = $this->attendance->employee->user->name;
        $clockInTime = $this->attendance->clock_in_time->format('H:i T');

        // In the app, location names would be resolved via a Geocoding API.
        $location = "Lat: {$this->attendance->clock_in_latitude}, Lon: {$this->attendance->clock_in_longitude}";

        $reviewUrl = url('/manager/suspicious-activity'); // TODO: Replace with frontend URL

        return (new MailMessage)
                    ->subject('⚠️ Unusual Activity Alert')
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line("An unusual clock-in has been flagged for your review.")
                    ->line("**Employee:** {$employeeName}")
                    ->line("**Clock-In Time:** {$clockInTime}")
                    ->line("**Location:** {$location}")
                    ->line('This location is significantly different from the employee\'s last known location. Please verify this activity.')
                    ->action('Review Activity', $reviewUrl);
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
            'message' => 'Suspicious clock-in detected for ' . $this->attendance->employee->user->name,
        ];
    }
}
