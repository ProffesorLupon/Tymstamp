<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Trip;

class LongTripReminder extends Notification implements ShouldQueue
{
    use Queueable;

    protected $trip;

    /**
     * Create a new notification instance.
     *
     * @param \App\Models\Trip $trip The long-running trip.
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
        return ['mail']; // Could also include 'sms' or 'fcm'
    }

    /**
     * Get the mail representation of the notification.
     *
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail(object $notifiable): MailMessage
    {
        $tripDuration = $this->trip->start_time->diffForHumans(null, true);
        $endTripUrl = url('/trip/end/' . $this->trip->id); // TODO: Replace with frontend URL

        return (new MailMessage)
                    ->subject('⏳ Trip Active for ' . $tripDuration)
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('This is a reminder that your trip is still active.')
                    ->line("**Purpose:** {$this->trip->purpose}")
                    ->line("**Started:** {$tripDuration} ago.")
                    ->line('Please don\'t forget to end your trip to ensure accurate logging.')
                    ->action('End Trip Now', $endTripUrl);
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
            'message' => 'Your trip has been active for over 8 hours. Please remember to end it.',
        ];
    }
}
