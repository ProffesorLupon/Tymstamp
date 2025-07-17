<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\LeaveRequest;

class LeaveRequestReminder extends Notification implements ShouldQueue
{
    use Queueable;

    protected $leaveRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct(LeaveRequest $leaveRequest)
    {
        $this->leaveRequest = $leaveRequest;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'broadcast']; 
    }

    /**
     * Get the mail representation of the notification.
     *
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail(object $notifiable): MailMessage
    {
        $employeeName = $this->leaveRequest->employee->user->name;
        $reviewUrl = url('/manager/leave/pending'); // TODO: Replace with frontend URL

        return (new MailMessage)
                    ->subject('Reminder: Pending Leave Request')
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line("This is a reminder that a leave request from **{$employeeName}** has been pending for over 24 hours.")
                    ->line('Please review the request at your earliest convenience.')
                    ->action('Review Pending Requests', $reviewUrl);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'leave_request_id' => $this->leaveRequest->id,
            'employee_name' => $this->leaveRequest->employee->user->name,
            'message' => 'A pending leave request from ' . $this->leaveRequest->employee->user->name . ' needs your attention.',
        ];
    }
}
