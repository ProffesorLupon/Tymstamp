<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;
use Illuminate\Support\Facades\Storage;

class EmployeeController extends Controller
{
    /**
     * Upload a reference facial image for a specific employee.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Employee $employee
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadReferenceFace(Request $request, Employee $employee)
    {
        $request->validate([
            'face_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Delete the old image if it exists to save space.
        if ($employee->face_image_path) {
            Storage::disk('public')->delete($employee->face_image_path);
        }

        // Store the new image in 'storage/app/public/faces'.
        // The path returned will be relative, e.g., 'faces/image_name.jpg'.
        $path = $request->file('face_image')->store('faces', 'public');

        // Update the employee record with the path to the new image.
        $employee->update([
            'face_image_path' => $path,
        ]);

        return response()->json([
            'message' => 'Reference photo uploaded successfully.',
            'employee' => $employee->fresh()->load('user'), // Return updated employee data
        ]);
    }
}
