<?php

namespace App\Services;

use App\Http\Resources\UserResource;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function __construct(
        protected UserRepository $userRepository
    ) {
    }

    public function register(array $data): UserResource
    {
        // Hash password
        $data['password'] = bcrypt($data['password']);
        // Tạo user
        return new UserResource($this->userRepository->create($data));
    }

    public function login(string $email, string $password): array
    {
        $user = $this->userRepository->findByEmail($email);
        if (!$user || !Auth::attempt(['email' => $email, 'password' => $password])) {
            return [];
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => new UserResource($user),
            'token' => $token,
        ];
    }

    public function logout($user): Bool
    {
        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
            return true;
        }
        return false;
    }
}