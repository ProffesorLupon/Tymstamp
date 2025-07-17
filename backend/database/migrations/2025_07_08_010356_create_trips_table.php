<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This migration creates the 'trips' table to log business-related
     * travel, including location data and purpose.
     */
    public function up(): void
    {
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();
            $table->string('start_location');
            $table->string('end_location')->nullable();
            $table->decimal('start_latitude', 10, 7);
            $table->decimal('start_longitude', 10, 7);
            $table->decimal('end_latitude', 10, 7)->nullable();
            $table->decimal('end_longitude', 10, 7)->nullable();
            $table->decimal('distance', 8, 2)->nullable(); // Distance in kilometers
            $table->string('purpose');
            $table->string('status')->default('started'); // e.g., started, completed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * This will drop the 'trips' table.
     */
    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};