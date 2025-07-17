<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Password;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Register a new user and store their reference photo if provided.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'string', 'in:employee,manager,hr'],
            'position' => ['required', 'string', 'max:255'],
            'manager_id' => ['nullable', 'exists:employees,id'],
            'face_image' => ['nullable', 'string'], // Validate that the face image is a base64 string
        ]);

        // Create the User record
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // Create the associated Employee profile
        $employee = Employee::create([
            'user_id' => $user->id,
            'employee_code' => 'EMP-' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
            'position' => $request->position,
            'manager_id' => $request->manager_id,
        ]);

        // Handle the face image upload if it was captured during registration
        if ($request->has('face_image') && $request->face_image) {
            try {
                // Remove the base64 prefix and decode the image data
                $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->face_image));
                
                // Generate a unique, random filename for the image to prevent conflicts
                $filename = 'faces/' . Str::random(40) . '.jpg';
                
                // Store the file in the 'public' disk (storage/app/public/faces)
                Storage::disk('public')->put($filename, $imageData);
                
                // Save the path to the stored image in the employee's record
                $employee->face_image_path = $filename;
                $employee->save();
            } catch (\Exception $e) {
                // If storing the image fails, log the error but don't fail the user creation.
                // The photo can be uploaded later via the "Manage Users" page.
                report($e);
            }
        }

        // Return the newly created user with their employee details
        $user->load('employee');

        return response()->json([
            'message' => 'User created successfully.',
            'user' => $user
        ], 201);
    }

    /**
     * Authenticate the user and return an API token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid login details'], 401);
        }

        $user = User::where('email', $request['email'])->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('employee')
        ]);
    }

    /**
     * Log the user out (Invalidate the token).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Send a password reset link to the user.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => "We can't find a user with that email address."], 404);
        }

        $token = Password::createToken($user);
        $user->notify(new ResetPasswordNotification($token));

        return response()->json(['message' => 'We have e-mailed your password reset link!']);
    }

    /**
     * Reset the user's password.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $status = Password::reset($request->only('email', 'password', 'password_confirmation', 'token'), function ($user, $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->save();
        });

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password has been reset successfully.']);
        }

        return response()->json(['message' => 'Invalid token or email.'], 400);
    }
}
