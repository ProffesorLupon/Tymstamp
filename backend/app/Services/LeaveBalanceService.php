<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\LeaveRequest;

class LeaveBalanceService
{
    /**
     * Define the company's default leave allowances per year.
     * These values can be moved to a configuration file or a database table for more flexibility.
     */
    private const LEAVE_ALLOWANCES = [
        'sick' => 10,
        'casual' => 5,
        'paid' => 15,
    ];

    /**
     * Get the total leave balance for an employee.
     *
     * @param Employee $employee
     * @return array
     */
    public function getLeaveBalances(Employee $employee): array
    {
        $balances = [];
        foreach (self::LEAVE_ALLOWANCES as $type => $allowance) {
            $balances[$type . '_leave'] = $this->getRemainingBalance($employee, $type);
        }
        return $balances;
    }

    /**
     * Calculate the remaining leave balance for a specific leave type.
     *
     * @param Employee $employee
     * @param string $leaveType
     * @return int
     */
    public function getRemainingBalance(Employee $employee, string $leaveType): int
    {
        $totalAllowance = self::LEAVE_ALLOWANCES[$leaveType] ?? 0;

        $approvedLeaveDays = LeaveRequest::where('employee_id', $employee->id)
            ->where('status', 'approved')
            ->where('leave_type', $leaveType)
            ->get()
            ->sum(function ($request) {
                // Calculate the number of days for the leave request.
                // The +1 includes the start date in the count.
                return $request->start_date->diffInDays($request->end_date) + 1;
            });

        return $totalAllowance - $approvedLeaveDays;
    }
}
