<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Attendance extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'clock_in_time',
        'clock_out_time',
        'clock_in_latitude',
        'clock_in_longitude',
        'clock_out_latitude',
        'clock_out_longitude',
        'status', // e.g., 'present', 'late', 'absent'
        'notes',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'clock_in_time' => 'datetime',
        'clock_out_time' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['worked_hours'];

    /**
     * Get the employee that this attendance record belongs to.
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Accessor to calculate the total worked hours for an attendance record.
     *
     * This directly addresses the "Worked Hours Calc" gap.
     * It returns a formatted string showing hours and minutes.
     * Returns null if the employee has not clocked out yet.
     *
     * @return string|null
     */
    public function getWorkedHoursAttribute(): ?string
    {
        if ($this->clock_out_time && $this->clock_in_time) {
            $duration = $this->clock_in_time->diff($this->clock_out_time);
            return $duration->format('%h hours, %i minutes');
        }

        return null;
    }
}
