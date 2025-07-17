<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\LeaveRequest;
use App\Models\User;

class LeaveRequestSubmitted extends Notification implements ShouldQueue
{
    use Queueable;

    protected $leaveRequest;
    protected $manager;

    /**
     * Create a new notification instance.
     *
     * @param \App\Models\LeaveRequest $leaveRequest The leave request instance.
     * @param \App\Models\User $manager The manager who will receive the notification.
     */
    public function __construct(LeaveRequest $leaveRequest, User $manager)
    {
        $this->leaveRequest = $leaveRequest;
        $this->manager = $manager;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable): array
    {
        // This can be expanded to include 'database' or push notifications (e.g., 'fcm').
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * This builds the email that the manager will receive, based on the
     * requirements in the "TymStamp Scenarios.docx" document.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable): MailMessage
    {
        $employeeName = $this->leaveRequest->employee->user->name;
        $leaveType = ucfirst($this->leaveRequest->leave_type);
        $startDate = $this->leaveRequest->start_date->format('M d, Y');
        $endDate = $this->leaveRequest->end_date->format('M d, Y');
        $reason = $this->leaveRequest->reason;

        // TODO: Replace with actual frontend URLs
        $approveUrl = url('/manager/leave/approve/' . $this->leaveRequest->id);
        $rejectUrl = url('/manager/leave/reject/' . $this->leaveRequest->id);

        return (new MailMessage)
                    ->subject('📢 New Leave Request from ' . $employeeName)
                    ->greeting('Hello ' . $this->manager->name . ',')
                    ->line("A new leave request has been submitted for your review.")
                    ->line("**Employee:** {$employeeName}")
                    ->line("**Leave Type:** {$leaveType}")
                    ->line("**Dates:** {$startDate} to {$endDate}")
                    ->line("**Reason:** \"{$reason}\"")
                    ->action('Approve Request', $approveUrl)
                    ->action('Reject Request', $rejectUrl)
                    ->line('Please review and take action on this request in the Tymstamp portal.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable): array
    {
        return [
            'leave_request_id' => $this->leaveRequest->id,
            'employee_name' => $this->leaveRequest->employee->user->name,
            'message' => 'A new leave request requires your approval.',
        ];
    }
}
