<?php

require_once __DIR__ . '/../bootstrap.php';

class AuthApiTest extends BackendTestCase
{
    private $baseUrl = 'http://localhost:8000';
    private $email;

    public function testRegister()
    {
        $this->email = 'test_' . time() . '@example.com';
        
        $ch = curl_init($this->baseUrl . '/api/register');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'name' => 'Test User',
            'email' => $this->email,
            'password' => 'password123'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->assertEquals(201, $httpCode);
        $this->assertTrue($data['success']);
        $this->assertEquals($this->email, $data['data']['email']);
    }

    public function testLogin()
    {
        $ch = curl_init($this->baseUrl . '/api/login');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'email' => $this->email,
            'password' => 'password123'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->assertEquals(200, $httpCode);
        $this->assertTrue($data['success']);
        $this->assertNotEmpty($data['data']['token']);
    }

    public function testLoginInvalidCredentials()
    {
        $ch = curl_init($this->baseUrl . '/api/login');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'email' => $this->email,
            'password' => 'wrongpassword'
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $data = json_decode($response, true);
        $this->assertEquals(401, $httpCode);
        $this->assertFalse($data['success']);
    }
}
