<?php

require_once __DIR__ . '/../bootstrap.php';

class TaskApiTest extends BackendTestCase
{
    private $baseUrl = 'http://localhost:8000';
    private $token;
    private $taskId;

    private function getToken()
    {
        if ($this->token) return $this->token;

        $ch = curl_init($this->baseUrl . '/api/login');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'email' => 'user@example.com',
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

    public function testCreateTask()
    {
        $token = $this->getToken();
        
        $ch = curl_init($this->baseUrl . '/api/tasks');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'title' => 'Test Task',
            'description' => 'Test Description',
            'status' => 'pending'
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
        $this->assertEquals('Test Task', $data['data']['title']);
        $this->taskId = $data['data']['id'];
    }

    public function testListTasks()
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

    public function testUpdateTask()
    {
        $token = $this->getToken();
        
        $ch = curl_init($this->baseUrl . '/api/tasks/' . $this->taskId);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'title' => 'Updated Task',
            'status' => 'done'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->assertTrue($data['success']);
        $this->assertEquals('Updated Task', $data['data']['title']);
        $this->assertEquals('done', $data['data']['status']);
    }

    public function testDeleteTask()
    {
        $token = $this->getToken();
        
        $ch = curl_init($this->baseUrl . '/api/tasks/' . $this->taskId);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->assertTrue($data['success']);
    }

    public function testUnauthorizedAccess()
    {
        $ch = curl_init($this->baseUrl . '/api/tasks');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer invalid_token'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->assertEquals(401, $httpCode);
        $this->assertFalse($data['success']);
    }
}
