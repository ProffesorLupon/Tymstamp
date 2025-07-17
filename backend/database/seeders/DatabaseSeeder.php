<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * This seeder creates a default set of users for testing and development,
     * including a manager, an HR user, and several employees.
     */
    public function run(): void
    {
        // --- 1. Create the Admin User ---
        // This user has the highest level of permissions.
        $adminUser = User::factory()
            ->has(Employee::factory()->state([
                'employee_code' => 'EMP-0000',
                'position' => 'System Administrator',
            ]))
            ->create([
                'name' => 'Admin User',
                'email' => 'admin@tymstamp.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]);
        $adminEmployee = $adminUser->employee;


        // --- 2. Create a Manager User ---
        // The manager will oversee the HR user and other employees.
        $managerUser = User::factory()
            ->has(Employee::factory()->state([
                'employee_code' => 'EMP-0001',
                'position' => 'Project Manager',
                'manager_id' => $adminEmployee->id, // The manager reports to the admin
            ]))
            ->create([
                'name' => 'Jane Doe (Manager)',
                'email' => 'manager@tymstamp.com',
                'password' => Hash::make('password'),
                'role' => 'manager',
            ]);
        $managerEmployee = $managerUser->employee;


        // --- 3. Create the new HR User ---
        // This user has HR-specific permissions and reports to the manager.
        // Login with:
        // Email: hr@tymstamp.com
        // Password: password
        User::factory()
            ->has(Employee::factory()->state([
                'employee_code' => 'EMP-0003',
                'position' => 'HR Specialist',
                'manager_id' => $managerEmployee->id, // HR reports to the manager
            ]))
            ->create([
                'name' => 'HR Person',
                'email' => 'hr@tymstamp.com',
                'password' => Hash::make('password'),
                'role' => 'hr',
            ]);


        // --- 4. Create a regular Employee User ---
        // This employee reports to the manager.
        User::factory()
            ->has(Employee::factory()->state([
                'employee_code' => 'EMP-0002',
                'position' => 'Software Developer',
                'manager_id' => $managerEmployee->id,
            ]))
            ->create([
                'name' => 'John Smith (Employee)',
                'email' => 'employee@tymstamp.com',
                'password' => Hash::make('password'),
                'role' => 'employee',
            ]);


        // --- 5. Create additional employees ---
        // These employees also report to the manager.
        User::factory(8)
            ->has(Employee::factory()->state(['manager_id' => $managerEmployee->id]))
            ->create(['role' => 'employee']);
    }
}
