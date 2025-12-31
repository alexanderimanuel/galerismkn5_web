<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Artisan;
use App\Models\User;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// ROUTE RAHASIA UNTUK PERBAIKI IMAGE 404 (VERSION 2 - ROBUST)
Route::get('/fix-storage', function () {
    $output = "<h1>Storage Link Fixer</h1>";
    try {
        $target = storage_path('app/public');
        $link = public_path('storage');

        $output .= "Target Path: $target<br>";
        $output .= "Link Path: $link<br>";

        // 1. Cek apakah folder target ada
        if (!file_exists($target)) {
            $output .= "Making directory $target...<br>";
            mkdir($target, 0755, true);
        }

        // 2. Cek apakah link sudah ada
        if (file_exists($link)) {
            $output .= "Link 'public/storage' sudah ada. Menghapus...<br>";
            // Gunakan @ untuk suppress error jika bukan link
            @unlink($link);
            // Jika masih ada (misal folder asli), coba rename
            if (file_exists($link)) {
                $output .= "Gagal hapus. Mencoba rename...<br>";
                rename($link, public_path('storage_backup_' . time()));
            }
        }

        // 3. Coba pakai Artisan
        try {
            Artisan::call('storage:link');
            $output .= "<h2 style='color:green'>BERHASIL via Artisan!</h2>";
        } catch (\Throwable $e) {
            $output .= "Gagal via Artisan: " . $e->getMessage() . "<br>";
            $output .= "Mencoba manual symlink()...<br>";

            if (symlink($target, $link)) {
                $output .= "<h2 style='color:green'>BERHASIL via Manual Symlink!</h2>";
            } else {
                throw new \Exception("Gagal manual symlink. Cek permission.");
            }
        }

        $output .= "<br>Silakan cek aplikasi Android Anda, gambar seharusnya mucul.";
        return $output;

    } catch (\Throwable $e) {
        return $output . "<h2 style='color:red'>GAGAL TOTAL: " . $e->getMessage() . "</h2><pre>" . $e->getTraceAsString() . "</pre>";
    }
});

// Simple session login for docs access
Route::post('/docs-login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    if (Auth::attempt($request->only('email', 'password'))) {
        $request->session()->regenerate();
        return redirect('/docs/api');
    }

    return back()->withErrors([
        'email' => 'The provided credentials do not match our records.',
    ]);
});

// Simple login form for docs access
Route::get('/docs-login', function () {
    return view('docs-login');
});

// Logout route for docs
Route::post('/docs-logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/docs-login');
});

require __DIR__ . '/auth.php';
