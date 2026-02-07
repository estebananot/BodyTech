<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class TaskNotificationServer implements MessageComponentInterface
{
    protected $clients;
    protected $subscriptions;
    protected $userConnections;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
        $this->userConnections = [];
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = json_decode($msg, true);
        
        if (isset($data['type'])) {
            switch ($data['type']) {
                case 'subscribe':
                    if (isset($data['userId'])) {
                        $userId = $data['userId'];
                        $this->userConnections[$userId] = $from;
                        $from->send(json_encode([
                            'type' => 'subscribed',
                            'userId' => $userId
                        ]));
                    }
                    break;
                    
                case 'ping':
                    $from->send(json_encode(['type' => 'pong']));
                    break;
            }
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);
        
        foreach ($this->userConnections as $userId => $connection) {
            if ($connection === $conn) {
                unset($this->userConnections[$userId]);
                break;
            }
        }
        
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }

    public function notifyTaskUpdate($userId, $task, $action)
    {
        if (isset($this->userConnections[$userId])) {
            $connection = $this->userConnections[$userId];
            $connection->send(json_encode([
                'type' => 'task_update',
                'action' => $action,
                'task' => $task
            ]));
        }
    }

    public function broadcastToUser($userId, $message)
    {
        if (isset($this->userConnections[$userId])) {
            $connection = $this->userConnections[$userId];
            $connection->send(json_encode($message));
        }
    }
}
