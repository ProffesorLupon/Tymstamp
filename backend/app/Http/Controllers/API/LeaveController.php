<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;
use App\Notifications\LeaveRequestSubmitted;
use App\Notifications\LeaveRequestActioned;
use Illuminate\Auth\Access\AuthorizationException;
use App\Services\LeaveBalanceService;

class LeaveController extends Controller
{
    protected $leaveBalanceService;

    public function __construct(LeaveBalanceService $leaveBalanceService)
    {
        $this->leaveBalanceService = $leaveBalanceService;
    }

    /**
     * Submit a leave request for the authenticated employee.
     */
    public function submitRequest(Request $request)
    {
        $request->validate([
            'leave_type' => 'required|string|in:sick,casual,paid',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:500',
        ]);

        $employee = Auth::user()->employee;

        $leaveRequest = LeaveRequest::create([
            'employee_id' => $employee->id,
            'leave_type' => $request->leave_type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        $manager = $employee->manager;
        if ($manager && $manager->user) {
            Notification::send($manager->user, new LeaveRequestSubmitted($leaveRequest, $manager->user));
        }

        return response()->json(['message' => 'Leave request submitted successfully.', 'leave_request' => $leaveRequest], 201);
    }

    /**
     * Get the leave history for the authenticated user.
     */
    public function getLeaveHistory(Request $request)
    {
        $employee = Auth::user()->employee;
        $history = LeaveRequest::where('employee_id', $employee->id)
            ->orderBy('start_date', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($history);
    }

    /**
     * Get the leave balance for the authenticated user.
     */
    public function getLeaveBalance()
    {
        $employee = Auth::user()->employee;
        $balances = $this->leaveBalanceService->getLeaveBalances($employee);
        return response()->json($balances);
    }

    /**
     * Get pending leave requests for the manager's team.
     */
    public function getPendingRequests()
    {
        $manager = Auth::user()->employee;
        $subordinateIds = $manager->subordinates()->pluck('id');

        $pendingRequests = LeaveRequest::with('employee.user')
            ->whereIn('employee_id', $subordinateIds)
            ->where('status', 'pending')
            ->get();

        return response()->json($pendingRequests);
    }

    /**
     * Approve a leave request.
     */
    public function approveRequest(LeaveRequest $leaveRequest)
    {
        $manager = Auth::user()->employee;

        if ($leaveRequest->employee->manager_id !== $manager->id) {
            throw new AuthorizationException('You are not authorized to approve this request.');
        }

        $leaveRequest->update([
            'status' => 'approved',
            'approved_by' => $manager->id,
        ]);

        Notification::send($leaveRequest->employee->user, new LeaveRequestActioned($leaveRequest));

        return response()->json(['message' => 'Leave request approved.', 'leave_request' => $leaveRequest]);
    }

    /**
     * Reject a leave request.
     */
    public function rejectRequest(Request $request, LeaveRequest $leaveRequest)
    {
        $request->validate(['rejection_reason' => 'required|string|max:500']);

        $manager = Auth::user()->employee;

        if ($leaveRequest->employee->manager_id !== $manager->id) {
            throw new AuthorizationException('You are not authorized to reject this request.');
        }

        $leaveRequest->update([
            'status' => 'rejected',
            'approved_by' => $manager->id,
            'rejection_reason' => $request->rejection_reason,
        ]);

        Notification::send($leaveRequest->employee->user, new LeaveRequestActioned($leaveRequest, $request->rejection_reason));

        return response()->json(['message' => 'Leave request rejected.', 'leave_request' => $leaveRequest]);
    }

    /**
     * Get team leave calendar.
     */
    public function getTeamLeaveCalendar(Request $request)
    {
        $manager = Auth::user()->employee;
        $subordinateIds = $manager->subordinates()->pluck('id')->push($manager->id);

        $leaves = LeaveRequest::whereIn('employee_id', $subordinateIds)
            ->where('status', 'approved')
            ->whereYear('start_date', $request->get('year', Carbon::now()->year))
            ->get(['employee_id', 'start_date', 'end_date', 'leave_type']);

        return response()->json($leaves);
    }
}
