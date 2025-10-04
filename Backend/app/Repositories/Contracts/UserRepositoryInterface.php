<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Http\JsonResponse;

interface UserRepositoryInterface
{
    public function create(array $data): User;
    public function findByEmail(string $email): ?User;
    public function findById(int $id): ?User;
    public function updateById(int $id, array $data): bool;
}
