<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_registration_creates_a_hashed_password_and_authenticates_the_user(): void
    {
        $response = $this->postJson('/register', [
            'name' => 'Ayu Pratama',
            'email' => 'ayu@example.com',
            'phone' => '+62 812-3456-7890',
            'address' => 'Jl. Merdeka No. 10, Jakarta',
            'preferred_bank' => 'BRI',
            'password' => 'StrongPass123!',
            'password_confirmation' => 'StrongPass123!',
            'terms_accepted' => true,
        ]);

        $response->assertCreated()
            ->assertJsonPath('redirect', '/beranda.html')
            ->assertJsonMissingPath('password');

        $this->assertDatabaseHas('users', [
            'name' => 'Ayu Pratama',
            'email' => 'ayu@example.com',
            'phone' => '+62 812-3456-7890',
            'address' => 'Jl. Merdeka No. 10, Jakarta',
            'preferred_bank' => 'BRI',
        ]);

        $this->assertTrue(Hash::check(
            'StrongPass123!',
            (string) User::query()->where('email', 'ayu@example.com')->value('password'),
        ));
        $this->assertAuthenticated();
    }

    public function test_registration_rejects_raw_card_details_without_creating_a_user(): void
    {
        $response = $this->postJson('/register', [
            'name' => 'Ayu Pratama',
            'email' => 'ayu@example.com',
            'phone' => '+62 812-3456-7890',
            'address' => 'Jl. Merdeka No. 10, Jakarta',
            'preferred_bank' => 'BCA',
            'password' => 'StrongPass123!',
            'password_confirmation' => 'StrongPass123!',
            'terms_accepted' => true,
            'cardNumber' => '4111111111111111',
            'cvv' => '123',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['cardNumber', 'cvv']);

        $this->assertDatabaseMissing('users', ['email' => 'ayu@example.com']);
    }

    public function test_registration_rejects_an_existing_email(): void
    {
        User::factory()->create(['email' => 'ayu@example.com']);

        $response = $this->postJson('/register', [
            'name' => 'Ayu Pratama',
            'email' => 'ayu@example.com',
            'phone' => '+62 812-3456-7890',
            'address' => 'Jl. Merdeka No. 10, Jakarta',
            'preferred_bank' => 'BNI',
            'password' => 'StrongPass123!',
            'password_confirmation' => 'StrongPass123!',
            'terms_accepted' => true,
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email']);

        $this->assertDatabaseCount('users', 1);
    }

    #[DataProvider('supportedBanks')]
    public function test_supported_bank_preferences_are_saved(string $bank): void
    {
        $email = strtolower($bank).'@example.com';

        $this->postJson('/register', [
            'name' => 'Ayu Pratama',
            'email' => $email,
            'phone' => '+62 812-3456-7890',
            'address' => 'Jl. Merdeka No. 10, Jakarta',
            'preferred_bank' => $bank,
            'password' => 'StrongPass123!',
            'password_confirmation' => 'StrongPass123!',
            'terms_accepted' => true,
        ])->assertCreated();

        $this->assertDatabaseHas('users', [
            'email' => $email,
            'preferred_bank' => $bank,
        ]);
    }

    public static function supportedBanks(): array
    {
        return [
            'BCA' => ['BCA'],
            'BNI' => ['BNI'],
            'BRI' => ['BRI'],
        ];
    }

    public function test_registration_rejects_an_unsupported_bank_preference(): void
    {
        $response = $this->postJson('/register', [
            'name' => 'Ayu Pratama',
            'email' => 'ayu@example.com',
            'phone' => '+62 812-3456-7890',
            'address' => 'Jl. Merdeka No. 10, Jakarta',
            'preferred_bank' => 'MANDIRI',
            'password' => 'StrongPass123!',
            'password_confirmation' => 'StrongPass123!',
            'terms_accepted' => true,
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['preferred_bank']);

        $this->assertDatabaseMissing('users', ['email' => 'ayu@example.com']);
    }

    public function test_registration_reports_required_fields_without_creating_a_user(): void
    {
        $response = $this->postJson('/register', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'phone', 'address', 'preferred_bank', 'password', 'terms_accepted']);

        $this->assertDatabaseCount('users', 0);
    }

    public function test_csrf_token_endpoint_returns_a_session_token(): void
    {
        $this->getJson('/csrf-token')
            ->assertOk()
            ->assertJsonStructure(['token']);
    }
}
