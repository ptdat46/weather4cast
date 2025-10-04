<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ForecastQueryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "lat" => "required|numeric|between:-90,90",
            "long" => "required|numeric|between:-180,180",
            "units" => "required|string|in:m,f"
        ];
    }

    public function messages(): array
    {
        return [
            "lat.required" => "Trường lat là bắt buộc.",
            "lat.numeric" => "Lat phải là số.",
            "lat.between" => "Lat phải nằm trong khoảng -90 đến 90.",

            "long.required" => "Trường long là bắt buộc.",
            "long.numeric" => "Long phải là số.",
            "long.between" => "Long phải nằm trong khoảng -180 đến 180.",

            "units.required" => "Trường units là bắt buộc.",
            "units.string" => "Units phải là chuỗi.",
            "units.in" => "Units chỉ được phép là 'm' (metric) hoặc 'f' (fahrenheit)."
        ];
    }
}
