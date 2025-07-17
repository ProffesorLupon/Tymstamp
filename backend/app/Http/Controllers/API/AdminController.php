<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Spatie\DbDumper\Databases\MySql;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use App\Models\User;

class AdminController extends Controller
{
    /**
     * Trigger a database backup.
     */
    public function backupDatabase()
    {
        try {
            Storage::makeDirectory('backups');
            $filename = 'backup-' . Carbon::now()->format('Y-m-d_H-i-s') . '.sql';
            $path = Storage::path('backups/' . $filename);

            MySql::create()
                ->setDbName(config('database.connections.mysql.database'))
                ->setUserName(config('database.connections.mysql.username'))
                ->setPassword(config('database.connections.mysql.password'))
                ->dumpToFile($path);

            return response()->json([
                'message' => 'Database backup completed successfully.',
                'path' => 'storage/app/backups/' . $filename
            ]);
        } catch (\Exception $e) {
            report($e);
            return response()->json(['message' => 'Database backup failed.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get a list of all managers and admins to assign as a manager.
     */
    public function getManagers()
    {
        $managers = User::with('employee')
            ->whereIn('role', ['manager', 'admin'])
            ->get();
            
        return response()->json($managers);
    }

    /**
     * Get a paginated list of all users.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUsers(Request $request)
    {
        // Fetch all users, including their employee details, and order by name.
        // Paginate the results to prevent performance issues with large datasets.
        $users = User::with('employee')
            ->orderBy('name', 'asc')
            ->paginate($request->get('per_page', 25));

        return response()->json($users);
    }
}
