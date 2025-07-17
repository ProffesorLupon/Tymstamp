<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\LeaveRequest;
use App\Services\LeaveBalanceService;

class LeaveRequestActioned extends Notification implements ShouldQueue
{
    use Queueable;

    protected $leaveRequest;
    protected $rejectionReason;

    /**
     * Create a new notification instance.
     */
    public function __construct(LeaveRequest $leaveRequest, ?string $rejectionReason = null)
    {
        $this->leaveRequest = $leaveRequest;
        $this->rejectionReason = $rejectionReason;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        $startDate = $this->leaveRequest->start_date->format('M d, Y');
        $endDate = $this->leaveRequest->end_date->format('M d, Y');
        
        $mail = (new MailMessage)
                    ->greeting('Hello ' . $notifiable->name . ',');

        if ($this->leaveRequest->status === 'approved') {
            $leaveBalanceService = app(LeaveBalanceService::class);
            $remainingBalance = $leaveBalanceService->getRemainingBalance($this->leaveRequest->employee, $this->leaveRequest->leave_type);

            return $mail
                ->subject('✅ Leave Request Approved')
                ->line("Your leave request for **{$startDate} to {$endDate}** has been approved.")
                ->line("Your remaining balance for this type is now **{$remainingBalance} days**.")
                ->action('View Leave History', url('/leave/history'));
        } else { // 'rejected'
            return $mail
                ->subject('❌ Leave Request Rejected')
                ->line("Unfortunately, your leave request for **{$startDate} to {$endDate}** has been rejected.")
                ->lineIf($this->rejectionReason, "**Manager's Comment:** \"{$this->rejectionReason}\"")
                ->line('Please contact your manager if you have any questions.')
                ->action('Submit a New Request', url('/leave/request'));
        }
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable): array
    {
        return [
            'leave_request_id' => $this->leaveRequest->id,
            'status' => $this->leaveRequest->status,
            'message' => 'Your leave request for ' . $this->leaveRequest->start_date->format('M d') . ' has been ' . $this->leaveRequest->status . '.',
        ];
    }
}
