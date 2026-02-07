<?php

require_once __DIR__ . '/../bootstrap.php';

class TaskValidationTest extends BackendTestCase
{
    private $baseUrl = 'http://localhost:8000';
    private $token;
    private $testEmail;

    private function getToken()
    {
        if ($this->token) return $this->token;

        $this->testEmail = 'validation_test_' . time() . '@example.com';
        
        $ch = curl_init($this->baseUrl . '/api/register');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'name' => 'Validation Test User',
            'email' => $this->testEmail,
            'password' => 'password123'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        curl_close($ch);

        $ch = curl_init($this->baseUrl . '/api/login');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'email' => $this->testEmail,
            'password' => 'password123'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->token = $data['data']['token'];
        return $this->token;
    }

    public function testCreateTaskWithoutTitle()
    {
        $token = $this->getToken();
        
        $ch = curl_init($this->baseUrl . '/api/tasks');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'title' => '',
            'description' => 'Test description'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->assertEquals(400, $httpCode);
        $this->assertFalse($data['success']);
    }

    public function testCreateTaskWithTitleTooLong()
    {
        $token = $this->getToken();
        
        $ch = curl_init($this->baseUrl . '/api/tasks');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'title' => str_repeat('a', 201),
            'description' => 'Test description'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->assertEquals(400, $httpCode);
        $this->assertFalse($data['success']);
    }

    public function testCreateTaskWithInvalidStatus()
    {
        $token = $this->getToken();
        
        $ch = curl_init($this->baseUrl . '/api/tasks');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'title' => 'Valid Task Title',
            'status' => 'invalid_status'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->assertEquals(200, $httpCode);
        $this->assertEquals('pending', $data['data']['status']);
    }

    public function testFilterTasksByStatus()
    {
        $token = $this->getToken();
        
        $ch = curl_init($this->baseUrl . '/api/tasks?status=pending');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->assertTrue($data['success']);
        
        foreach ($data['data'] as $task) {
            $this->assertEquals('pending', $task['status']);
        }
    }

    public function testFilterTasksByAllStatus()
    {
        $token = $this->getToken();
        
        $ch = curl_init($this->baseUrl . '/api/tasks');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->assertTrue($data['success']);
        $this->assertIsArray($data['data']);
    }

    public function testCreateTaskWithOptionalDescription()
    {
        $token = $this->getToken();
        
        $ch = curl_init($this->baseUrl . '/api/tasks');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'title' => 'Task without description'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->assertEquals(201, $httpCode);
        $this->assertTrue($data['success']);
        $this->assertEquals('pending', $data['data']['status']);
    }

    public function testUpdatePartialTask()
    {
        $token = $this->getToken();
        
        $ch = curl_init($this->baseUrl . '/api/tasks');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'title' => 'Task to update partially'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $data = json_decode($response, true);
        $taskId = $data['data']['id'];
        curl_close($ch);

        $ch = curl_init($this->baseUrl . '/api/tasks/' . $taskId);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'description' => 'Updated description only'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $data = json_decode($response, true);
        curl_close($ch);

        $this->assertTrue($data['success']);
        $this->assertEquals('Updated description only', $data['data']['description']);
        $this->assertEquals('Task to update partially', $data['data']['title']);
    }
}
