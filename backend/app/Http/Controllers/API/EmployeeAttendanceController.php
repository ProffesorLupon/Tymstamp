<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Services\AttendanceService;
use App\Services\FacialRecognitionService;
use App\Notifications\SuspiciousClockIn;
use Illuminate\Support\Facades\Notification;

class EmployeeAttendanceController extends Controller
{
    protected $attendanceService;
    protected $facialRecognitionService;

    public function __construct(AttendanceService $attendanceService, FacialRecognitionService $facialRecognitionService)
    {
        $this->attendanceService = $attendanceService;
        $this->facialRecognitionService = $facialRecognitionService;
    }

    /**
     * Clock in an employee with facial verification and punctuality check.
     */
    public function clockIn(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'face_image' => 'required|string',
        ]);

        $employee = Auth::user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Employee profile not found.'], 404);
        }

        // 1. Check for existing clock-in records to prevent duplicates.
        $existingAttendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('clock_in_time', Carbon::today())
            ->whereNull('clock_out_time')
            ->first();

        if ($existingAttendance) {
            return response()->json(['message' => 'You have already clocked in today.'], 400);
        }
        
        // 2. Check if the employee has a reference photo uploaded.
        if (!$employee->face_image_path) {
            return response()->json(['message' => 'No reference photo found. Please contact HR to upload one.'], 400);
        }

        // 3. Perform facial verification before proceeding.
        $isVerified = $this->facialRecognitionService->verifyFaces(
            $employee->face_image_path,
            $request->face_image
        );

        if (!$isVerified) {
            return response()->json(['message' => 'Facial verification failed. Please try again.'], 403);
        }

        // 4. Determine the status ('present' or 'late') based on the clock-in time.
        $clockInTime = Carbon::now();
        $shiftStartTime = Carbon::today()->setTime(8, 0, 0); // Standard shift start time: 8:00:00 AM
        
        $status = $clockInTime->isAfter($shiftStartTime) ? 'late' : 'present';

        // 5. Create the final attendance record now that all checks have passed.
        $attendance = Attendance::create([
            'employee_id' => $employee->id,
            'clock_in_time' => $clockInTime,
            'clock_in_latitude' => $request->latitude,
            'clock_in_longitude' => $request->longitude,
            'status' => $status,
        ]);

        // 6. Check for suspicious activity based on location.
        if ($this->attendanceService->isSuspicious($attendance)) {
            $manager = $employee->manager;
            if ($manager && $manager->user) {
                Notification::send($manager->user, new SuspiciousClockIn($attendance));
            }
        }

        return response()->json(['message' => 'Clocked in successfully.', 'attendance' => $attendance], 201);
    }

    /**
     * Clock out an employee.
     */
    public function clockOut(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $employee = Auth::user()->employee;
        $attendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('clock_in_time', Carbon::today())
            ->whereNull('clock_out_time')
            ->first();

        if (!$attendance) {
            return response()->json(['message' => 'No active clock-in record found for today.'], 404);
        }

        $attendance->update([
            'clock_out_time' => Carbon::now(),
            'clock_out_latitude' => $request->latitude,
            'clock_out_longitude' => $request->longitude,
        ]);

        return response()->json(['message' => 'Clocked out successfully.', 'attendance' => $attendance->refresh()]);
    }

    /**
     * Get the current day's attendance for the authenticated user.
     */
    public function getTodaysAttendance()
    {
        $attendance = Attendance::where('employee_id', Auth::user()->employee->id)
            ->whereDate('clock_in_time', Carbon::today())
            ->first();
        return response()->json($attendance);
    }

    /**
     * Get the attendance history for the authenticated user.
     */
    public function getAttendanceHistory(Request $request)
    {
        $history = Attendance::where('employee_id', Auth::user()->employee->id)
            ->orderBy('clock_in_time', 'desc')
            ->paginate($request->get('per_page', 15));
        return response()->json($history);
    }

    /**
     * Get suspicious clock-in activities for a manager's team.
     */
    public function getSuspiciousActivities()
    {
        $activities = $this->attendanceService->getSuspiciousActivitiesForManager(Auth::user()->employee);
        return response()->json($activities);
    }

    /**
     * Get the attendance history for a manager's team.
     */
    public function getTeamAttendanceHistory(Request $request)
    {
        $subordinateIds = Auth::user()->employee->subordinates()->pluck('id');
        $history = Attendance::with('employee.user')
            ->whereIn('employee_id', $subordinateIds)
            ->orderBy('clock_in_time', 'desc')
            ->paginate($request->get('per_page', 25));
        return response()->json($history);
    }
}
