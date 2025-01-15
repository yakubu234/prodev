<?php
namespace App\Traits;

use Illuminate\Http\Resources\Json\JsonResource;

trait ApiResponse {


    protected function success($data, string $message = null, int $code = 200)
    {
        return response()->json([
            'status'=> 'success',
            'message' => $message,
            'data' => $data
        ],$code);
    }

    protected function error(string $message, $data = null,  int $code = 400)
    {
        return response()->json([
            'status'=> 'error',
            'message' => $message,
            'data' => $data
        ],$code);
    }
}

?>