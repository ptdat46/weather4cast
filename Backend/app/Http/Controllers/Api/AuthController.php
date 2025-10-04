<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Common;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}

    public function register(RegisterRequest $request) : JsonResponse
    {
        try {
            $user = $this->authService->register($request->validated());
            return Common::successResponse('Successfully created user', [$user]);
        } catch (Exception $e) {
            return Common::errorResponse('Failed when creating new user', $e);
        }
    }

    public function login(LoginRequest $request) : JsonResponse
    {
        try {
            $result = $this->authService->login($request['email'], $request['password']);
            if(!empty($result)) {
                return Common::successResponse('Successfully logging in', [$result]);
            } else {
                return Common::errorResponse('Incorrect credentials', []);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return Common::errorResponse('Login failed', []);
        }
    }

    public function logout(Request $request) : JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return Common::errorResponse('User not found', []);
        }
        $result = $this->authService->logout($user);
        if (!$result) {
            return Common::errorResponse('Logout failed', []);
        }
        return Common::successResponse('Successfully logged out', []);
    }
}
