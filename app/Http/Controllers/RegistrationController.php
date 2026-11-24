<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegistrationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:32'],
            'address' => ['required', 'string', 'max:1000'],
            'preferred_bank' => ['required', Rule::in(['BCA', 'BNI', 'BRI'])],
            'password' => ['required', 'string', 'confirmed', Password::min(8)],
            'terms_accepted' => ['accepted'],
            'cardNumber' => ['prohibited'],
            'card_number' => ['prohibited'],
            'expiry' => ['prohibited'],
            'cvv' => ['prohibited'],
            'holder' => ['prohibited'],
            'cardholder' => ['prohibited'],
            'card_holder' => ['prohibited'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'preferred_bank' => $validated['preferred_bank'],
            'password' => $validated['password'],
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Akun berhasil dibuat.',
            'redirect' => '/beranda.html',
        ], 201);
    }
}
