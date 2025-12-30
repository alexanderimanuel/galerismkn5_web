<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proyek extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'jurusan_id', 
        'judul',
        'deskripsi',
        'tautan_proyek',
        'image_url',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    /**
     * Get the user (siswa) that owns the proyek
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the jurusan that the proyek belongs to
     */
    public function jurusan()
    {
        return $this->belongsTo(Jurusan::class);
    }

    /**
     * Get the penilaian for this proyek (1-to-1 relationship)
     */
    public function penilaian()
    {
        return $this->hasOne(Penilaian::class);
    }

    /**
     * Scope to get projects by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get terkirim projects
     */
    public function scopeTerkirim($query)
    {
        return $query->where('status', 'terkirim');
    }

    /**
     * Scope to get dinilai projects
     */
    public function scopeDinilai($query)
    {
        return $query->where('status', 'dinilai');
    }
}
