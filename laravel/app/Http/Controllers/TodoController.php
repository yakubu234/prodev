<?php

namespace App\Http\Controllers;

use App\Jobs\SendEmailNotification;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\Todo;
use Illuminate\Support\Facades\Bus;
use App\Models\User;

class TodoController extends Controller
{
    use ApiResponse;

    public function create(Request $request){

        $validated = $request->validate([
            'title' => ['required'],
            'description' => ['required']
        ]);

        $todo = new Todo();
        $todo->title = $validated['title'];
        $todo->description = $validated['description'];
        $todo->save();

        $this->sendMail(['subject' => 'created']);
        
        return $this->success($todo,'Todo added successfully', 201);
    }

    public function sendMail($data)
    {
        $users = User::all();

        // creating a chunk
        $batchSize = 10;
        $chunks = collect($users)->chunk($batchSize);

        foreach($chunks as $key => $chunk){

            foreach($chunk as $user){
                SendEmailNotification::dispatch($data);
            }
        }

    }


    public function update(Request $request, $id)
    {

        $validated = $request->validate([
            'title' => ['required'],
            'description' => ['required'],
            'status' => ['nullable', 'in:open,completed']
        ]);

        $todo = Todo::find($id);

        if(!$todo){
            return $this->error('Todo not found',null, 404);
        }

        isset($validated['title']) ? $todo->title = $validated['title']:'';
        isset($validated['status']) ? $todo->status = $validated['status']:'';
        isset($validated['description']) ? $todo->title = $validated['description']:'';
        $todo->save();

        $this->sendMail(['subject' => 'updated']);
        return $this->success($todo,'Todo updated successfully', 201);
    }

    public function fetchAll(Request $request)
    {
        $todos = Todo::all();
        return $this->success($todos,'All Todo fetched successfully', 200);

    }

    public function fetchSingle(Request $request, $id)
    {
        $todo = Todo::find($id);

        if(!$todo){
            return $this->error('Todo not found',null, 404);
        }

        return $this->success($todo,'Todo fethced successfully', 200);
    }
}
