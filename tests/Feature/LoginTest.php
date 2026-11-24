<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_credentials_authenticate_the_user(): void
    {
        $user = User::factory()->create([
            'email' => 'ayu@example.com',
            'password' => 'StrongPass123!',
        ]);

        $this->postJson('/login', [
            'email' => 'ayu@example.com',
            'password' => 'StrongPass123!',
        ])
            ->assertOk()
            ->assertJsonPath('redirect', '/beranda.html');

        $this->assertAuthenticatedAs($user);
    }

    public function test_invalid_credentials_do_not_authenticate_the_user(): void
    {
        User::factory()->create([
            'email' => 'ayu@example.com',
            'password' => 'StrongPass123!',
        ]);

        $this->postJson('/login', [
            'email' => 'ayu@example.com',
            'password' => 'WrongPass123!',
        ])
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Email atau kata sandi tidak cocok.');

        $this->assertGuest();
    }
}
