<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjekController;
use App\Http\Controllers\JurusanController;
use App\Http\Controllers\AkunController;
use App\Http\Controllers\PenilaianController;
use App\Http\Controllers\StudentImportController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\Auth\ClaimAccountController;
use App\Http\Controllers\DashboardStatsController;

/**
 * Authentication Routes
 * These routes handle user registration, login, and authentication
 */

// Public authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/**
 * Public Proyek Routes
 * These routes can be accessed without authentication for public viewing
 */
Route::get('/proyeks', [ProjekController::class, 'index'])->name('proyeks.index');
Route::get('/proyeks/latest', [ProjekController::class, 'latest'])->name('proyeks.latest');
Route::get('/proyeks/best', [ProjekController::class, 'best'])->name('proyeks.best');
Route::get('/proyeks/ungraded', [ProjekController::class, 'ungraded'])->name('proyeks.ungraded')->middleware('auth:sanctum');
Route::get('/proyeks/{proyek}', [ProjekController::class, 'show'])->name('proyeks.show');

/**
 * Public Jurusan Routes
 * These routes provide access to department/major information for forms
 */
Route::get('/jurusans', [SiswaController::class, 'getJurusans'])->name('jurusans.index');
Route::get('/jurusans/{jurusan}', [JurusanController::class, 'show'])->name('jurusans.show');

/**
 * Public Student Onboarding Routes
 * These routes support the student account claiming process
 */
Route::get('/siswa/available', [SiswaController::class, 'getAvailableStudents'])->name('siswa.available');
Route::post('/auth/claim', [ClaimAccountController::class, 'store'])->name('auth.claim');

/**
 * Public Kelas Routes
 * These routes provide access to class information for forms
 */
Route::get('/kelas', [SiswaController::class, 'getAllKelas'])->name('kelas.index');
Route::get('/kelas/by-jurusan', [SiswaController::class, 'getKelasByJurusan'])->name('kelas.by-jurusan');

/**
 * Public Template Download
 * Public route for downloading Excel import template
 */
Route::get('/download-template', [StudentImportController::class, 'downloadTemplate'])->name('public.template.download');

/**
 * Protected Routes
 * These routes require authentication via Sanctum token
 */
Route::middleware(['auth:sanctum'])->group(function () {
    // User management
    Route::get('/user', [AuthController::class, 'me'])->name('user.me');
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    Route::post('/logout-all', [AuthController::class, 'logoutAll'])->name('auth.logout.all');

    Route::get('/user-stats', [AuthController::class, 'userStats'])->name('user.stats');
    
    /**
     * Dashboard Statistics Routes
     * High-level statistics and monitoring for admin and guru roles
     */
    Route::get('/dashboard/stats', [DashboardStatsController::class, 'index'])->name('dashboard.stats');
    Route::get('/dashboard/stats/jurusan/{jurusanId}', [DashboardStatsController::class, 'jurusanStats'])->name('dashboard.stats.jurusan');
    
    /**
     * Get user profile information
     * Returns detailed user profile data including role information
     */
    Route::get('/profile', function (Request $request) {
        $user = $request->user();
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_guru' => $user->isGuru(),
            'is_siswa' => $user->isSiswa(),
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ]);
    })->name('user.profile');

    /**
     * Protected Proyek (Projects) Routes
     * CRUD operations that require authentication
     */
    Route::post('/proyeks', [ProjekController::class, 'store'])->name('proyeks.store');
    Route::put('/proyeks/{proyek}', [ProjekController::class, 'update'])->name('proyeks.update');
    Route::patch('/proyeks/{proyek}', [ProjekController::class, 'update'])->name('proyeks.update.patch');
    Route::delete('/proyeks/{proyek}', [ProjekController::class, 'destroy'])->name('proyeks.destroy');
    Route::get('/my-proyeks', [ProjekController::class, 'myProjects'])->name('proyeks.my');

    /**
     * Admin-only Account Management Routes
     * CRUD operations for managing guru and siswa accounts
     */
    Route::get('/akuns', [AkunController::class, 'index'])->name('akuns.index');
    Route::post('/akuns', [AkunController::class, 'store'])->name('akuns.store');
    Route::get('/akuns/{id}', [AkunController::class, 'show'])->name('akuns.show');
    Route::put('/akuns/{id}', [AkunController::class, 'update'])->name('akuns.update');
    Route::patch('/akuns/{id}', [AkunController::class, 'update'])->name('akuns.update.patch');
    Route::delete('/akuns/{id}', [AkunController::class, 'destroy'])->name('akuns.destroy');
    Route::get('/akuns-stats', [AkunController::class, 'stats'])->name('akuns.stats');

    /**
     * Student Excel Import Routes
     * Admin-only routes for importing students from Excel files
     */
    Route::post('/admin/import-students', [StudentImportController::class, 'import'])->name('students.import');
    Route::get('/admin/students/import/status', [StudentImportController::class, 'getImportStatus'])->name('students.import.status');

    /**
     * Penilaian (Grading) Routes
     * CRUD operations for grading projects by teachers
     */
    Route::get('/penilaians', [PenilaianController::class, 'index'])->name('penilaians.index');
    Route::post('/penilaians', [PenilaianController::class, 'store'])->name('penilaians.store');
    Route::get('/penilaians/{id}', [PenilaianController::class, 'show'])->name('penilaians.show');
    Route::put('/penilaians/{id}', [PenilaianController::class, 'update'])->name('penilaians.update');
    Route::patch('/penilaians/{id}', [PenilaianController::class, 'update'])->name('penilaians.update.patch');
    Route::delete('/penilaians/{id}', [PenilaianController::class, 'destroy'])->name('penilaians.destroy');
    Route::post('/penilaians/check-permission', [PenilaianController::class, 'checkGradingPermission'])->name('penilaians.check');
});
