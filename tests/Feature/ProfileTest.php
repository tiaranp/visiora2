<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;


    public function test_registration_details_are_available_on_the_profile(): void
    {
        $this->postJson('/register', [
            'name' => 'Ayu Pratama',
            'email' => 'ayu@example.com',
            'phone' => '+62 812-3456-7890',
            'address' => 'Jl. Merdeka No. 10, Jakarta',
            'preferred_bank' => 'BRI',
            'password' => 'StrongPass123!',
            'password_confirmation' => 'StrongPass123!',
            'terms_accepted' => true,
        ])->assertCreated()
            ->assertJsonPath('redirect', '/beranda.html');

        $this->getJson('/profile-data')
            ->assertOk()
            ->assertExactJson([
                'name' => 'Ayu Pratama',
                'email' => 'ayu@example.com',
                'phone' => '+62 812-3456-7890',
                'address' => 'Jl. Merdeka No. 10, Jakarta',
                'preferred_bank' => 'BRI',
            ]);
    }


    public function test_authenticated_user_receives_their_registration_details(): void
    {
        $user = User::factory()->create([
            'name' => 'Ayu Pratama',
            'email' => 'ayu@example.com',
            'phone' => '+62 812-3456-7890',
            'address' => 'Jl. Merdeka No. 10, Jakarta',
            'preferred_bank' => 'BRI',
        ]);

        $this->actingAs($user)
            ->getJson('/profile-data')
            ->assertOk()
            ->assertExactJson([
                'name' => 'Ayu Pratama',
                'email' => 'ayu@example.com',
                'phone' => '+62 812-3456-7890',
                'address' => 'Jl. Merdeka No. 10, Jakarta',
                'preferred_bank' => 'BRI',
            ]);
    }

    public function test_guest_receives_401_when_requesting_profile_data(): void
    {
        $this->getJson('/profile-data')
            ->assertUnauthorized();
    }
}
