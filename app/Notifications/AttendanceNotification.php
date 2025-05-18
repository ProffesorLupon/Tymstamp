<?php
namespace App\Notifications;

use App\Models\Attendance;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class AttendanceNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Attendance $attendance,
        public string $type 
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(ucfirst($this->type) . ' Confirmation')
            ->line("Employee {$this->attendance->employee->name} {$this->type} at {$this->getTime()}");
    }

    public function toArray(object $notifiable): array
    {
        return [
            'employee_id' => $this->attendance->employee_id,
            'time' => $this->getTime(),
            'type' => $this->type,
            'message' => "Employee " . str_replace('_', ' ', $this->type) . "."
        ];
    }

    private function getTime()
    {
        return $this->type === 'clock_in' 
            ? $this->attendance->clock_in_time 
            : $this->attendance->clock_out_time;
    }
}