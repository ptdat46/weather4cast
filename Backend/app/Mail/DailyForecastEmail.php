<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Http\Resources\DataResource;

class DailyForecastEmail extends Mailable
{
    use Queueable, SerializesModels;

    public array $forecastData;
    public function __construct(DataResource $dataResource)
    {
        $this->forecastData = $dataResource->toArray(request());
    }

    public function build()
    {
        $cityName = $this->forecastData['city']['name'] ?? 'Unknown City';
        $country  = $this->forecastData['city']['country'] ?? '';

        return $this->subject("Dự báo thời tiết hằng ngày - {$cityName}, {$country}")
            ->view('emails.daily_forecast')
            ->with([
                'city' => $this->forecastData['city'],
                'forecast' => $this->forecastData['forecast'],
            ]);
    }
}
