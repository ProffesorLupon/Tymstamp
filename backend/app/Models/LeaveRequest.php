<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Represents a leave request made by an employee.
 *
 * This model was renamed from 'Leave' to 'LeaveRequest' to avoid
 * conflicts with the PHP reserved keyword 'leave'.
 */
class LeaveRequest extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'leave_requests';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'leave_type', // e.g., 'sick', 'casual', 'paid'
        'start_date',
        'end_date',
        'reason',
        'status', // e.g., 'pending', 'approved', 'rejected'
        'approved_by', // manager's employee_id
        'rejection_reason', // Added to store the reason for rejection
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get the employee that this leave request belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the manager who approved or rejected the leave request.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function approver()
    {
        return $this->belongsTo(Employee::class, 'approved_by');
    }
}
