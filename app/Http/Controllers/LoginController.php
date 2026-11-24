<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
        ]);

        if (! Auth::attempt(
            [
                'email' => $validated['email'],
                'password' => $validated['password'],
            ],
            $request->boolean('remember'),
        )) {
            return response()->json([
                'message' => 'Email atau kata sandi tidak cocok.',
                'errors' => [
                    'email' => ['Email atau kata sandi tidak cocok.'],
                ],
            ], 422);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Berhasil masuk.',
            'redirect' => '/beranda.html',
        ]);
    }
}
