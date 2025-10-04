<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForecastQueryRequest;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\QueryBaseDataRequest;
use App\Helpers\Common;
use App\Services\DashboardService;

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
            $query = Common::baseQuery($queries);
            $result = $this->dashboardService->getData($query);
            if (!$result) {
                return Common::errorResponse("Retrieve current data failed", [], 500);
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

            $query = Common::forecastQuery($lat, $long, $units);
            $result = $this->dashboardService->getData($query);
            if (!$result) {
                return Common::errorResponse("Retrieve forecast data failed", [], 500);
            }
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

