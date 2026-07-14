<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'admin_email',
        'action',
        'details',
        'ip_address',
    ];

    /**
     * Get the user associated with this activity log.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
