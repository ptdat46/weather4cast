<?php
namespace App\Helpers;

use Illuminate\Http\JsonResponse;
use App\Models\City;

class Common
{
    const ADMIN = 'admin';
    /**
     * Common helper methods for API responses.
     */
    public static function successResponse($message, $data, $statusCode = 200) : JsonResponse
    {
        return response()->json([
            'message' => $message,
            'data' => $data,
            'status' => $statusCode,
        ], $statusCode);
    }

    public static function errorResponse($message, $errors, $statusCode = 500) : JsonResponse
    {
        return response()->json([
            'message' => $message,
            'errors' => $errors,
            'status' => $statusCode,
        ], $statusCode);
    }

    public static function baseQuery(array $queries) {
        $accessKey = config('services.api_key_weather_stack');
        $defaultQuery = "http://api.weatherstack.com/current?access_key=" . $accessKey;
        if ($queries["location"] == null) {
            $defaultQuery .= "&query=fetch:ip";
        } else {
            $location = City::where("city_name", $queries["location"])->first()["slug"];
            $defaultQuery .= "&query=" . $location;
        }

        if ($queries["units"] == null || $queries["units"] == "m") {
            $defaultQuery .= "&units=m";
        } else {
            $defaultQuery .= "&units=f";
        }

        return $defaultQuery;
    }

    public static function forecastQuery(string $lat, string $long, string $units) {
        $accessKey = config('services.api_key_open_weather');
        $defaultQuery = "api.openweathermap.org/data/2.5/forecast?lat=$lat&lon=$long&appid=$accessKey";
        if ($units == 'm') {
            $defaultQuery .= "&units=metric";
        } else {
            $defaultQuery .= "&units=imperial";
        }
        $defaultQuery .= "&cnt=32";
        return $defaultQuery;
    }
}
