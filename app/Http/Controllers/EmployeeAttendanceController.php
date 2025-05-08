<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EmployeeAttendanceController extends Controller
{
    public function clock_in(Request $request)
    {
        // Validate the request
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'clock_in_time' => 'required|date_format:Y-m-d H:i:s',
        ]);

        // Check if the employee is already clocked in

        $employee = Employee::find($request->employee_id);

        if ($employee->is_clocked_in) {
            return response()->json(['message' => 'Employee is already clocked in'], 400);
        }
        // Check if the clock-in time is within the allowed range
        $current_time = now();
        $clock_in_time = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $request->clock_in_time);

        if ($clock_in_time->isFuture()) {
            return response()->json(['message' => 'Clock-in time cannot be in the future'], 400);
        }
        
        if ($clock_in_time->diffInMinutes($current_time) > 10) {
            return response()->json(['message' => 'Clock-in time cannot be more than 15 minutes in the past'], 400);
        }

        // Check if the employee has already clocked in today
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

        // Send a notification to the employee
        Notification::send($employee, new ClockInNotification($attendance));

        // Send a notification to the manager
        Notification::send($employee->manager, new ClockInNotification($attendance));

       // Log the clock-in event
        \Log::info('Employee clocked in', [
            'employee_id' => $request->employee_id,
            'clock_in_time' => $attendance->clock_in_time,
        ]);
      
        // Handle employee clock-in 
        return response()->json(['message' => 'Clocked in successfully']);
    }
}
