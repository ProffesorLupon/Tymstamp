<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Trip;

class TripStatusUpdate extends Notification implements ShouldQueue
{
    use Queueable;

    protected $trip;

    /**
     * Create a new notification instance.
     */
    public function __construct(Trip $trip)
    {
        $this->trip = $trip;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail(object $notifiable): MailMessage
    {
        $employeeName = $this->trip->employee->user->name;
        $viewUrl = url('/manager/team-trips'); 

        if ($this->trip->status === 'started') {
            return (new MailMessage)
                ->subject("🚗 Trip Started: {$employeeName}")
                ->greeting('Hello ' . $notifiable->name . ',')
                ->line("Employee **{$employeeName}** has started a new trip.")
                ->line("**Purpose:** {$this->trip->purpose}")
                ->line("**From:** {$this->trip->start_location}")
                ->action('View Team Activity', $viewUrl);
        }

        // Assumes status is 'completed'
        $duration = $this->trip->start_time->diffForHumans($this->trip->end_time, true);
        return (new MailMessage)
                ->subject("📊 Trip Completed: {$employeeName}")
                ->greeting('Hello ' . $notifiable->name . ',')
                ->line("Employee **{$employeeName}** has completed a trip.")
                ->line("**Route:** {$this->trip->start_location} → {$this->trip->end_location}")
                ->line("**Distance:** " . round($this->trip->distance, 2) . " km")
                ->line("**Duration:** {$duration}")
                ->action('View Trip Details', $viewUrl);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'trip_id' => $this->trip->id,
            'status' => $this->trip->status,
            'message' => 'Trip status updated for ' . $this->trip->employee->user->name,
        ];
    }
}
