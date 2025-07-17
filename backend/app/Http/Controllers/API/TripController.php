<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Trip;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Notifications\TripStatusUpdate;
use Illuminate\Support\Facades\Notification;

class TripController extends Controller
{
    /**
     * Start a new trip for the authenticated employee.
     */
    public function startTrip(Request $request)
    {
        $request->validate([
            'start_location' => 'required|string',
            'start_latitude' => 'required|numeric',
            'start_longitude' => 'required|numeric',
            'purpose' => 'required|string|max:255',
        ]);

        $employee = Auth::user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Employee profile not found.'], 404);
        }

        $activeTrip = Trip::where('employee_id', $employee->id)->where('status', 'started')->first();
        if ($activeTrip) {
            return response()->json(['message' => 'You already have an active trip.'], 400);
        }

        $trip = Trip::create([
            'employee_id' => $employee->id,
            'start_time' => Carbon::now(),
            'start_location' => $request->start_location,
            'start_latitude' => $request->start_latitude,
            'start_longitude' => $request->start_longitude,
            'purpose' => $request->purpose,
            'status' => 'started',
        ]);

        // --- NOTIFICATION LOGIC ---
        $manager = $employee->manager;
        if ($manager && $manager->user) {
            Notification::send($manager->user, new TripStatusUpdate($trip));
        }

        return response()->json(['message' => 'Trip started successfully.', 'trip' => $trip], 201);
    }

    /**
     * End the currently active trip for the authenticated employee.
     */
    public function endTrip(Request $request)
    {
        $request->validate([
            'end_location' => 'required|string',
            'end_latitude' => 'required|numeric',
            'end_longitude' => 'required|numeric',
        ]);

        $employee = Auth::user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Employee profile not found.'], 404);
        }

        $trip = Trip::where('employee_id', $employee->id)->where('status', 'started')->first();

        if (!$trip) {
            return response()->json(['message' => 'No active trip found to end.'], 404);
        }

        $distance = $this->calculateDistance(
            $trip->start_latitude,
            $trip->start_longitude,
            $request->end_latitude,
            $request->end_longitude
        );

        $trip->update([
            'end_time' => Carbon::now(),
            'end_location' => $request->end_location,
            'end_latitude' => $request->end_latitude,
            'end_longitude' => $request->end_longitude,
            'distance' => $distance,
            'status' => 'completed',
        ]);

        // --- NOTIFICATION LOGIC ---
        $manager = $employee->manager;
        if ($manager && $manager->user) {
            Notification::send($manager->user, new TripStatusUpdate($trip));
        }

        return response()->json(['message' => 'Trip ended successfully.', 'trip' => $trip]);
    }

    /**
     * Get the trip history for the authenticated user.
     */
    public function getTrips(Request $request)
    {
        $employee = Auth::user()->employee;
        if (!$employee) {
            return response()->json(['message' => 'Employee profile not found.'], 404);
        }

        $trips = Trip::where('employee_id', $employee->id)
            ->orderBy('start_time', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($trips);
    }

    /**
     * Get details for a specific trip.
     */
    public function getTripDetails(Trip $trip)
    {
        if ($trip->employee_id !== Auth::user()->employee->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($trip);
    }

    /**
     * Calculate the distance between two points on Earth using the Haversine formula.
     * @return float Distance in kilometers.
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371;

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
