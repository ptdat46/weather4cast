<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\City;
use Illuminate\Validation\Rule;

class QueryBaseDataRequest extends FormRequest
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
        $cityNames = City::pluck("city_name")->toArray();
        return [
            "location" => ['nullable', 'string', 'max:255', Rule::in($cityNames)],
            "units" => ['nullable', 'string', 'max:1', Rule::in(['m', 'f'])]
        ];
    }
}
