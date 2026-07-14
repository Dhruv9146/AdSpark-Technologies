<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_contents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('cta_text')->default('Explore Services');
            $table->string('cta_link')->default('#services');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_contents');
    }
};
