<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;
use Slim\Middleware\ErrorMiddleware;

require_once __DIR__ . '/../app/Database.php';

$app = AppFactory::create();

$app->addBodyParsingMiddleware();

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
        ->withHeader('Access-Control-Allow-Credentials', 'true')
        ->withHeader('Access-Control-Max-Age', '86400');
});

$app->options('/{routes:.*}', function ($request, $response) {
    return $response
        ->withHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
        ->withHeader('Access-Control-Max-Age', '86400');
});

require_once __DIR__ . '/../app/Controllers/AuthController.php';
require_once __DIR__ . '/../app/Controllers/TaskController.php';

$authController = new AuthController();
$taskController = new TaskController();

$app->post('/api/register', [$authController, 'register']);
$app->post('/api/login', [$authController, 'login']);

$app->get('/api/tasks', [$taskController, 'index']);
$app->post('/api/tasks', [$taskController, 'create']);
$app->put('/api/tasks/{id}', [$taskController, 'update']);
$app->delete('/api/tasks/{id}', [$taskController, 'delete']);

$app->run();
