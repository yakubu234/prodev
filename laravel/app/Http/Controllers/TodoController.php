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

    public const STATUS = 'open';

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
        ]);

        $todo = Todo::find($id);

        if(!$todo){
            return $this->error('Todo not found',null, 404);
        }

        $todo->title = $validated['title'];
        $todo->description = $validated['description'];
        $todo->save();

        $this->sendMail(['subject' => 'updated']);
        return $this->success($todo,'Todo updated successfully', 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $todo = Todo::find($id);

        if(!$todo){
            return $this->error('Todo not found',null, 404);
        }
        $todo->status = 'completed';
        $todo->save();

        $this->sendMail(['subject' => 'updated']);
        return $this->success($todo,'Todo Completed successfully', 201);
    }

    public function fetchAll(Request $request)
    {
        $todos = Todo::where('status', self::STATUS)->get();
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
