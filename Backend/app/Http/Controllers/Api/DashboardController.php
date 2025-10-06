<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForecastQueryRequest;
use Exception;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\QueryBaseDataRequest;
use App\Helpers\Common;
use App\Services\DashboardService;
use Illuminate\Support\Facades\Cache;
use App\Models\User;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService,
    ) {
    }

    public function getBaseData(QueryBaseDataRequest $request)
    {
        // get current weather's data in requester location

    }

    public function getCurrentData(QueryBaseDataRequest $request): JsonResponse
    {
        try {
            $queries = $request->validated();
            $locationAndUnits = $queries['location'] . ' - ' . $queries['units'];
            $query = Common::baseQuery($queries);
            if (Cache::has($locationAndUnits)) {
                $result = Cache::get($locationAndUnits);
            } else {
                $result = $this->dashboardService->getData($query);
                Cache::put($locationAndUnits, $result, 3600);
            }

            if (!$result) {
                return Common::errorResponse("Retrieve current data failed", [], 500);
            }
            if ($queries['location'] == null) {
                $lat = $result['location']['lat'];
                $long = $result['location']['lon'];
                $location = "{$lat}, {$long}";
                $user = auth('sanctum')->user();
                if ($user) {
                    $user->update(['location' => $location]);
                }
            }
            return Common::successResponse("Retrieve current data successfully", $result, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return Common::errorResponse(
                $e->validator->errors()->first(),
                $e->validator->errors()->toArray(),
                422
            );
        }
    }

    public function getForecastData(ForecastQueryRequest $request): JsonResponse
    {
        try {
            $queries = $request->validated();
            $lat = $queries["lat"];
            $long = $queries["long"];
            $units = $queries["units"];

            $latAndLongAndUnits = $lat . ' - ' . $long . ' - ' . $units;
            if (Cache::has($latAndLongAndUnits)) {
                $result = Cache::get($latAndLongAndUnits);
                if ($result) {
                    return Common::successResponse("Retrieve forecast data successfully", $result, 200);
                }
            }

            $query = Common::forecastQuery($lat, $long, $units);
            $result = $this->dashboardService->getData($query);
            if (!$result) {
                return Common::errorResponse("Retrieve forecast data failed", [], 500);
            }
            Cache::put($latAndLongAndUnits, $result, 3600);
            return Common::successResponse("Retrieve forecast data successfully", $result, 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return Common::errorResponse(
                $e->validator->errors()->first(),
                $e->validator->errors()->toArray(),
                422
            );
        }
    }
}

