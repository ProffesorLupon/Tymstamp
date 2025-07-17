<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Employee;
use Carbon\Carbon;

class AttendanceService
{
    // Define a threshold in kilometers for what is considered a suspicious distance.
    private const SUSPICIOUS_DISTANCE_KM = 50;

    /**
     * Check if a given clock-in is suspicious based on the location of the previous clock-out.
     *
     * @param Attendance $currentAttendance The attendance record for the new clock-in.
     * @return bool
     */
    public function isSuspicious(Attendance $currentAttendance): bool
    {
        $employee = $currentAttendance->employee;

        // Get the most recent previous attendance record that has a clock-out time.
        $lastAttendance = Attendance::where('employee_id', $employee->id)
            ->whereNotNull('clock_out_time')
            ->orderBy('clock_out_time', 'desc')
            ->first();

        // If there's no previous record, we can't determine if it's suspicious.
        if (!$lastAttendance) {
            return false;
        }

        // If the last clock-out location is not available, we can't compare.
        if (is_null($lastAttendance->clock_out_latitude) || is_null($lastAttendance->clock_out_longitude)) {
            return false;
        }

        $distance = $this->calculateDistance(
            $lastAttendance->clock_out_latitude,
            $lastAttendance->clock_out_longitude,
            $currentAttendance->clock_in_latitude,
            $currentAttendance->clock_in_longitude
        );

        return $distance > self::SUSPICIOUS_DISTANCE_KM;
    }

    /**
     * Retrieves all suspicious clock-in activities for a manager's team.
     * For simplicity, this example considers any record created today as potentially suspicious.
     * A more robust implementation would involve a 'is_suspicious' flag in the database.
     *
     * @param Employee $manager
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getSuspiciousActivitiesForManager(Employee $manager)
    {
        $subordinateIds = $manager->subordinates()->pluck('id');

        // This is a simplified approach. We are checking all of today's attendance records
        // for the manager's team and running the check on each.
        $todaysAttendances = Attendance::whereIn('employee_id', $subordinateIds)
            ->whereDate('clock_in_time', Carbon::today())
            ->get();

        return $todaysAttendances->filter(function ($attendance) {
            return $this->isSuspicious($attendance);
        });
    }

    /**
     * Calculate the distance between two points on Earth using the Haversine formula.
     * @param float $lat1 Latitude of point 1.
     * @param float $lon1 Longitude of point 1.
     * @param float $lat2 Latitude of point 2.
     * @param float $lon2 Longitude of point 2.
     * @return float Distance in kilometers.
     */
    private function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371; // in kilometers

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
