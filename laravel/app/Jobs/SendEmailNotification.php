<?php

namespace App\Jobs;

use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendEmailNotification implements ShouldQueue
{
    use Queueable;

    private $data;
    /**
     * Create a new job instance.
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try{

            Mail::send('A todo has just been '.$this->data['subject'],[], function($message){
                $message->to($this->data['email'])
                ->subject($this->data['subject']);
            });
        }catch(Exception $e){
            \Log::info($e->getMessage());
        }
    }
}
