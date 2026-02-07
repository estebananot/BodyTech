<?php

require_once __DIR__ . '/../vendor/autoload.php';

require_once __DIR__ . '/TaskNotificationServer.php';

$loop = React\EventLoop\Loop::get();

$webSocket = new Ratchet\WebSocket\WsServer(
    new TaskNotificationServer()
);

$webServer = new Ratchet\Server\IoServer(
    new Ratchet\Http\HttpServer($webSocket),
    new React\Socket\Server('0.0.0.0:8080', $loop),
    $loop
);

echo "WebSocket server started on port 8080\n";
$webServer->run();
