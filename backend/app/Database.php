<?php

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

class Database {
    private static $pdo = null;

    public static function getConnection() {
        if (self::$pdo === null) {
            $connection = $_ENV['DB_CONNECTION'] ?? 'pgsql';
            
            if ($connection === 'mysql') {
                $host = $_ENV['DB_HOST'] ?? 'localhost';
                $port = $_ENV['DB_PORT'] ?? '3306';
                $database = $_ENV['DB_DATABASE'] ?? 'mini_task_manager';
                $username = $_ENV['DB_USERNAME'] ?? 'root';
                $password = $_ENV['DB_PASSWORD'] ?? '';
                
                $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";
                self::$pdo = new PDO($dsn, $username, $password);
            } else {
                $host = $_ENV['DB_HOST'] ?? 'localhost';
                $port = $_ENV['DB_PORT'] ?? '5432';
                $database = $_ENV['DB_DATABASE'] ?? 'mini_task_manager';
                $username = $_ENV['DB_USERNAME'] ?? 'root';
                $password = $_ENV['DB_PASSWORD'] ?? '';
                
                $dsn = "pgsql:host={$host};port={$port};dbname={$database}";
                self::$pdo = new PDO($dsn, $username, $password);
            }
            
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
            self::$pdo->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
        }
        return self::$pdo;
    }

    public static function lastInsertId() {
        return self::$pdo->lastInsertId();
    }
}
