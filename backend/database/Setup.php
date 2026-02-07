<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

try {
    $connection = $_ENV['DB_CONNECTION'] ?? 'sqlite';
    $dbPath = __DIR__ . '/../database/db.sqlite';
    
    if ($connection === 'sqlite') {
        $pdo = new PDO('sqlite:' . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $sql = file_get_contents(__DIR__ . '/init.sql');
        $pdo->exec($sql);
        echo "SQLite database initialized successfully.\n";
    } else {
        echo "Use docker-compose for MySQL/PostgreSQL initialization.\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
