<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\ResetCodesDirectory;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Submitted;
use App\Models\Exercise;


class UserRepository implements \App\Repositories\Contracts\UserRepositoryInterface
{
    public function create(array $data): User
    {
        $user = User::create($data);
        return $user;
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function findById(int $id): ?User
    {
        return User::findOrFail($id);
    }

    public function updateByEmail(string $email, array $data): Bool
    {
        try {
            $user = User::where('email', $email)->firstOrFail();
            $user->update($data);
            return true;
        } catch (\Exception $exception) {
           return false;
        }
    }

    public function updateById(int $id, array $data): bool
    {
        try {
            $user = User::findOrFail($id);
            $user->update($data);
            return true;
        } catch (\Exception $exception) {
            return false;
        }
    }

}
