<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Employee;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate a unique employee code
        static $employeeNumber = 100;
        $employeeNumber++;

        return [
            // user_id will be provided when calling this factory
            'employee_code' => 'EMP-' . str_pad($employeeNumber, 4, '0', STR_PAD_LEFT),
            'position' => $this->faker->jobTitle,
            'manager_id' => null, // Can be overridden in seeders
        ];
    }
}