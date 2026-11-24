<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/index.html');   // ganti dengan file halaman utamamu
});

Route::get('/csrf-token', function (): JsonResponse {
    return response()->json(['token' => csrf_token()]);
})->name('csrf-token');

Route::post('/register', [RegistrationController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('register.store');

Route::post('/login', [LoginController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('login.store');

Route::get('/profile-data', [ProfileController::class, 'show'])
    ->middleware('auth')
    ->name('profile.show');
