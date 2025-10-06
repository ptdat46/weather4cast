<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Services\DashboardService;
use App\Helpers\Common;
use App\Mail\DailyForecastEmail;
use Illuminate\Support\Facades\Mail;
use App\Http\Resources\DataResource;

class SendEmailReport extends Command
{
    protected $signature = 'report:send {--type=daily}';
    protected $description = 'Gửi dự báo thời tiết hằng ngày';

    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        parent::__construct();
        $this->dashboardService = $dashboardService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->option('type');
        
        Log::info("Đang gửi dự báo $type lúc " . now());

        // Logic
        $users = User::all();
        foreach($users as $user) {
            $email = $user['email'];
            $location = $user['location'];
            list($lat, $lon) = array_map('trim', explode(',', $location));
            $query = Common::forecastQuery($lat, $lon, 'm');
            $result = $this->dashboardService->getData($query);
            Mail::to($email)->send(new DailyForecastEmail(new DataResource($result)));
        }
        
        
        $this->info("Đã gửi báo cáo $type thành công!");
        
        return 0;
    }
}
