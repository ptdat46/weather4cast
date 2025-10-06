<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dự báo thời tiết 3 ngày tới - {{ $city['name'] ?? 'Unknown' }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f7f9fc;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .container {
            background: #fff;
            border-radius: 10px;
            padding: 25px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        }
        h2 {
            color: #007bff;
            margin-bottom: 15px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px 10px;
            text-align: center;
        }
        th {
            background-color: #007bff;
            color: white;
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 13px;
            color: #777;
        }
    </style>
</head>
<body>
<div class="container">
    <h2>Dự báo thời tiết 3 ngày tới tại {{ $city['name'] ?? '' }}, {{ $city['country'] ?? '' }}</h2>

    <table>
        <thead>
            <tr>
                <th>Time</th>
                <th>Temp (K)</th>
                <th>Weather</th>
                <th>Wind (m/s)</th>
                <th>Cloud (%)</th>
            </tr>
        </thead>
        <tbody>
        @foreach($forecast as $item)
            <tr>
                <td>{{ $item['time'] }}</td>
                <td>{{ $item['temperature'] }}</td>
                <td>{{ $item['weather'] }}</td>
                <td>{{ $item['wind_speed'] }}</td>
                <td>{{ $item['cloud'] }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <div class="footer">
        Được gửi hằng ngày tự động bởi Weather4cast 🌤️
    </div>
</div>
</body>
</html>
