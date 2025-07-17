<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Model;

class User extends Authenticatable
{
    /**
     * The HasApiTokens trait provides the necessary methods for issuing and managing API tokens.
     * HasFactory allows for the use of model factories for testing.
     * Notifiable enables the model to receive notifications.
     */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // Added role for authorization (e.g., 'employee', 'manager', 'admin')
    ];

    /**
     * The attributes that should be hidden for serialization.
     * This is important for security, to prevent sensitive data like passwords from being exposed in API responses.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Define the one-to-one relationship between a User and an Employee.
     * Each User account corresponds to one Employee profile.
     */
    public function employee()
    {
        return $this->hasOne(Employee::class);
    }

    /**
     * Check if the user has a specific role.
     *
     * @param string $role The role to check for.
     * @return bool
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }
}
