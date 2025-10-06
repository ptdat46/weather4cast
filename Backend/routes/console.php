<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

//Gửi mail hằng ngày
Schedule::command('report:send {--type=daily}')
    ->dailyAt('07:00')
    ->description('Gửi dự báo hàng ngày');
