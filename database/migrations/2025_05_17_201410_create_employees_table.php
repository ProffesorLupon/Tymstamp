<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique()->primary();
            $table->string('employee_name');
            $table->string('employee_last_name');
            $table->string('employee_email')->unique();
            $table->string('employee_password');
            $table->string('employee_phone')->unique();
            $table->text('employee_address');
            $table->string('employee_department');
            $table->string('employee_position');
            $table->string('employee_hire_date');
            $table->string('employee_status')->default('active');
            $table->string('employee_clock_in_time')->nullable();
            $table->string('employee_clock_out_time')->nullable();
            $table->string('employee_clock_in_status')->default('not clocked in');
            $table->string('employee_clock_out_status')->default('not clocked out');
            $table->string('employee_clock_in_location')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
