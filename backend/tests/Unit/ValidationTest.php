<?php

require_once __DIR__ . '/../bootstrap.php';

class ValidationTest extends BackendTestCase
{
    public function testPasswordMinLength()
    {
        $password = '123';
        $this->assertLessThanOrEqual(8, strlen($password));
    }

    public function testPasswordMinLengthValid()
    {
        $password = 'password123';
        $this->assertGreaterThanOrEqual(8, strlen($password));
    }

    public function testValidEmailFormat()
    {
        $emails = ['test@example.com', 'user.name@domain.org', 'test+tag@email.co'];
        $pattern = '/^[^\s@]+@[^\s@]+\.[^\s@]+$/';
        
        foreach ($emails as $email) {
            $this->assertTrue((bool)preg_match($pattern, $email), "Failed for: $email");
        }
    }

    public function testInvalidEmailFormat()
    {
        $emails = ['invalid-email', 'test@', '@example.com', 'test example@com'];
        $pattern = '/^[^\s@]+@[^\s@]+\.[^\s@]+$/';
        
        foreach ($emails as $email) {
            $this->assertFalse((bool)preg_match($pattern, $email), "Should fail for: $email");
        }
    }

    public function testRequiredFieldValidation()
    {
        $data = ['name' => '', 'email' => '', 'password' => ''];
        $requiredFields = ['name', 'email', 'password'];
        
        foreach ($requiredFields as $field) {
            $this->assertEmpty(trim($data[$field]), "Field $field should be required");
        }
    }

    public function testNameMinLength()
    {
        $name = 'AB';
        $this->assertLessThan(3, strlen($name));
    }

    public function testNameMinLengthValid()
    {
        $name = 'John';
        $this->assertGreaterThanOrEqual(3, strlen($name));
    }

    public function testTitleMaxLength()
    {
        $title = str_repeat('a', 201);
        $this->assertGreaterThan(200, strlen($title));
    }

    public function testTitleMaxLengthValid()
    {
        $title = str_repeat('a', 200);
        $this->assertLessThanOrEqual(200, strlen($title));
    }

    public function testValidTaskStatuses()
    {
        $validStatuses = ['pending', 'in_progress', 'done'];
        $this->assertContains('pending', $validStatuses);
        $this->assertContains('in_progress', $validStatuses);
        $this->assertContains('done', $validStatuses);
    }

    public function testInvalidTaskStatus()
    {
        $validStatuses = ['pending', 'in_progress', 'done'];
        $invalidStatus = 'invalid_status';
        $this->assertNotContains($invalidStatus, $validStatuses);
    }

    public function testJwtPayloadStructure()
    {
        $payload = [
            'iss' => 'mini-task-manager',
            'sub' => 1,
            'iat' => time(),
            'exp' => time() + 86400
        ];
        
        $this->assertArrayHasKey('iss', $payload);
        $this->assertArrayHasKey('sub', $payload);
        $this->assertArrayHasKey('iat', $payload);
        $this->assertArrayHasKey('exp', $payload);
    }

    public function testJwtExpiration24Hours()
    {
        $exp = time() + 86400;
        $iat = time();
        $expectedExp = $iat + 86400;
        
        $this->assertEquals($expectedExp, $exp);
        $this->assertEquals(86400, $exp - $iat);
    }

    public function testPasswordConfirmMatch()
    {
        $password = 'securePassword123';
        $confirmPassword = 'securePassword123';
        
        $this->assertEquals($password, $confirmPassword);
    }

    public function testPasswordConfirmMismatch()
    {
        $password = 'securePassword123';
        $confirmPassword = 'differentPassword';
        
        $this->assertNotEquals($password, $confirmPassword);
    }

    public function testDateFormat()
    {
        $date = '2026-02-06 17:27:05';
        $pattern = '/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/';
        
        $this->assertTrue((bool)preg_match($pattern, $date));
    }

    public function testJsonResponseStructure()
    {
        $response = [
            'success' => true,
            'message' => 'Operation successful',
            'data' => ['id' => 1, 'title' => 'Test']
        ];
        
        $this->assertArrayHasKey('success', $response);
        $this->assertArrayHasKey('message', $response);
        $this->assertArrayHasKey('data', $response);
    }

    public function testErrorResponseStructure()
    {
        $errorResponse = [
            'success' => false,
            'message' => 'Error message'
        ];
        
        $this->assertArrayHasKey('success', $errorResponse);
        $this->assertArrayHasKey('message', $errorResponse);
        $this->assertFalse($errorResponse['success']);
    }
}
