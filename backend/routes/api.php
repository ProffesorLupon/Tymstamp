<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\EmployeeAttendanceController;
use App\Http\Controllers\API\TripController;
use App\Http\Controllers\API\LeaveController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\EmployeeController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Public Routes ---
Route::post('/login', [AuthController::class, 'login'])->name('api.login');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.email');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');

// --- Protected Routes for All Authenticated Users ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn(Request $request) => $request->user()->load('employee'));

    // Attendance, Trip, and Leave routes... (no changes here)
    Route::prefix('attendance')->name('api.attendance.')->group(function () {
        Route::post('/clock-in', [EmployeeAttendanceController::class, 'clockIn']);
        Route::post('/clock-out', [EmployeeAttendanceController::class, 'clockOut']);
        Route::get('/today', [EmployeeAttendanceController::class, 'getTodaysAttendance']);
        Route::get('/history', [EmployeeAttendanceController::class, 'getAttendanceHistory']);
    });
    Route::prefix('trips')->name('api.trips.')->group(function () {
        Route::post('/start', [TripController::class, 'startTrip']);
        Route::post('/end', [TripController::class, 'endTrip']);
        Route::get('/', [TripController::class, 'getTrips']);
    });
    Route::prefix('leave')->name('api.leave.')->group(function () {
        Route::post('/request', [LeaveController::class, 'submitRequest']);
        Route::get('/history', [LeaveController::class, 'getLeaveHistory']);
    });

    // --- Protected Routes for Managers, HR, & Admins ---
    Route::middleware('role:manager|admin|hr')->prefix('manager')->name('api.manager.')->group(function () {
        Route::get('/leave/pending-requests', [LeaveController::class, 'getPendingRequests']);
        Route::post('/leave/requests/{leaveRequest}/approve', [LeaveController::class, 'approveRequest']);
        Route::post('/leave/requests/{leaveRequest}/reject', [LeaveController::class, 'rejectRequest']);
        Route::get('/team-attendance', [EmployeeAttendanceController::class, 'getTeamAttendanceHistory']);
        Route::get('/suspicious-activity', [EmployeeAttendanceController::class, 'getSuspiciousActivities']);
    });

    // --- Protected Routes for HR & Admins ---
    Route::middleware('role:admin|hr')->prefix('admin')->name('api.admin.')->group(function() {
        Route::post('/backup-database', [AdminController::class, 'backupDatabase']);
        Route::get('/managers', [AdminController::class, 'getManagers']);
        Route::get('/users', [AdminController::class, 'getUsers']);
        Route::post('/users', [AuthController::class, 'register']);
        
        // NEW: Route to upload a reference photo for an employee.
        // It uses route model binding to automatically find the employee by their ID.
        Route::post('/employees/{employee}/upload-face', [EmployeeController::class, 'uploadReferenceFace'])->name('employees.upload-face');
    });
});
