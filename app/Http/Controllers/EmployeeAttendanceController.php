<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Employee;
use App\Notifications\AttendanceNotification;
use Illuminate\Http\Request;

class EmployeeAttendanceController extends Controller
{
    public function clock_in(Request $request)
    {
        // Validating the request
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'clock_in_time' => 'required|date_format:Y-m-d H:i:s',
        ]);

        // Checking if the employee is already clocked in

        $employee = Employee::find($request->employee_id);

        if ($employee->is_clocked_in) {
            return response()->json(['message' => 'Employee is already clocked in'], 400);
        }
        // Checking if the clock-in time is within the allowed range
        $current_time = now();
        $clock_in_time = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $request->clock_in_time);

        if ($clock_in_time->isFuture()) {
            return response()->json(['message' => 'Clock-in time cannot be in the future'], 400);
        }
        
        if ($clock_in_time->diffInMinutes($current_time) > 10) {
            return response()->json(['message' => 'Clock-in time cannot be more than 15 minutes in the past'], 400);
        }

        // Checking if the employee has already clocked in today
        $today = now()->format('Y-m-d');
        $attendance = Attendance::where('employee_id', $request->employee_id)
            ->whereDate('clock_in_time', $today)
            ->first();

        if ($attendance) {
            return response()->json(['message' => 'Employee has already clocked in today'], 400);
        }

        // Create a new attendance record
        $attendance = new Attendance();
        $attendance->employee_id = $request->employee_id;
        $attendance->clock_in_time = $clock_in_time;
        $attendance->save();

        // Update the employee's clock-in status
        $employee->is_clocked_in = true;
        $employee->save();

       $employee->notify(new AttendanceNotification($attendance, 'clock_in'));
       $employee->manager->notify(new AttendanceNotification($attendance, 'clock_in'));

       // Log the clock-in event
        \Illuminate\Support\Facades\Log::info('Employee clocked in', [
            'employee_id' => $request->employee_id,
            'clock_in_time' => $attendance->clock_in_time,
        ]);
      
        // Handle employee clock-in 
        return response()->json(['message' => 'Clocked in successfully']);
    }

    
public function clock_out(Request $request)
{
    // Validate
    $request->validate([
        'employee_id' => 'required|exists:employees,id',
        'clock_out_time' => 'required|date_format:Y-m-d H:i:s',
    ]);

    $employee = Employee::find($request->employee_id);

    // Check if employee is clocked in
    if (!$employee->is_clocked_in) {
        return response()->json(['message' => 'Employee is not clocked in'], 400);
    }

    // Validate clock-out time
    $clock_out_time = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $request->clock_out_time);
    if ($clock_out_time->isFuture()) {
        return response()->json(['message' => 'Clock-out time cannot be in the future'], 400);
    }

    // Find today's attendance record
    $attendance = Attendance::where('employee_id', $request->employee_id)
        ->whereDate('clock_in_time', now()->format('Y-m-d'))
        ->first();

    if (!$attendance) {
        return response()->json(['message' => 'No clock-in record found today'], 400);
    }

    // Update attendance
    $attendance->clock_out_time = $clock_out_time;
    $attendance->save();

    // Update employee status
    $employee->is_clocked_in = false;
    $employee->save();

    // Notify employee and manager
    $employee->notify(new AttendanceNotification($attendance, 'clock_out'));
    $employee->manager->notify(new AttendanceNotification($attendance, 'clock_out'));

    // Log
    \Illuminate\Support\Facades\Log::info('Employee clocked out', [
        'employee_id' => $request->employee_id,
        'clock_out_time' => $attendance->clock_out_time,
    ]);

    return response()->json(['message' => 'Clocked out successfully']);
}

}

