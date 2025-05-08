<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EmployeeAttendanceController extends Controller
{
    public function clock_in(Request $request)
    {
        // Handle employee clock-in 
        return response()->json(['message' => 'Clocked in successfully']);
    }
}
