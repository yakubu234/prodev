<?php

use App\Http\Controllers\TodoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/todo/{id}', [TodoController::class,'fetchSingle']);
Route::get('/todo', [TodoController::class,'fetchAll']);
Route::post('/todo/add', [TodoController::class,'create']);
Route::put('/todo/update/{id}', [TodoController::class,'update']);
Route::put('/todo/completed/{id}', [TodoController::class,'updateStatus']);
