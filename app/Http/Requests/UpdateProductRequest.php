<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class UpdateProductRequest extends FormRequest
{
    
    public function rules()
    {
        return [
            'title' => 'required|string|max:55',
            'description' => 'required'
        ];
    }
}
