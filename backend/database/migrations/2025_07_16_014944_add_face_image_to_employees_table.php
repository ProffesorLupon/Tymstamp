<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This adds a column to store the path to the employee's reference facial image.
     * It is set to nullable because existing employees may not have a photo yet.
     */
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->string('face_image_path')->nullable()->after('position');
        });
    }

    /**
     * Reverse the migrations.
     *
     * This will remove the column if the migration is rolled back.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn('face_image_path');
        });
    }
};
