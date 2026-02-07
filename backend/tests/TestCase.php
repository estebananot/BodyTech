<?php

use PHPUnit\Framework\TestCase;

abstract class BackendTestCase extends TestCase
{
    protected function setUp(): void
    {
        $dbPath = __DIR__ . '/../database/db.sqlite';
        $backupPath = __DIR__ . '/../database/db.sqlite.bak';
        if (file_exists($backupPath)) {
            copy($backupPath, $dbPath);
        }
    }
}
