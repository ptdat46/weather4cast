<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DataResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'city' => [
                'name' => $this['city']['name'] ?? null,
                'country' => $this['city']['country'] ?? null,
            ],

            'forecast' => collect($this['list'] ?? [])->map(function ($item) {
                return [
                    'time' => $item['dt_txt'] ?? null,
                    'temperature' => $item['main']['temp'] ?? null,
                    'weather' => $item['weather'][0]['main'] ?? null,
                    'wind_speed' => $item['wind']['speed'] ?? null,
                    'cloud' => $item['clouds']['all'] ?? null,
                ];
            }),
        ];
    }
}
