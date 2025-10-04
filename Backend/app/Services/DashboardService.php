<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class DashboardService
{
    public function getData(String $query) {
        try {
            $response = Http::get($query)->throw();
            return $response->json();
        } catch (Exception $e) {
            Log::error($e);
            return null;
        }
        
    }
}