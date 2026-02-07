<?php

use Firebase\JWT\JWT;

class AuthController {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function register($request, $response) {
        $data = $request->getParsedBody();

        if (!isset($data['name'], $data['email'], $data['password'])) {
            $body = json_encode(['success' => false, 'message' => 'Datos incompletos']);
            $response->getBody()->write($body);
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        if (strlen($data['password']) < 8) {
            $body = json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos 8 caracteres']);
            $response->getBody()->write($body);
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        if (!preg_match('/[A-Z]/', $data['password'])) {
            $body = json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos una mayúscula']);
            $response->getBody()->write($body);
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        if (!preg_match('/[a-z]/', $data['password'])) {
            $body = json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos una minúscula']);
            $response->getBody()->write($body);
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        if (!preg_match('/[0-9]/', $data['password'])) {
            $body = json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos un número']);
            $response->getBody()->write($body);
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $data['password'])) {
            $body = json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos un caracter especial']);
            $response->getBody()->write($body);
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        try {
            $stmt = $this->db->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :password)");
            $stmt->execute([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12])
            ]);

            $id = $this->db->lastInsertId();

            $body = json_encode([
                'success' => true,
                'message' => 'Usuario registrado exitosamente',
                'data' => ['id' => $id, 'name' => $data['name'], 'email' => $data['email']]
            ]);
            $response->getBody()->write($body);
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (\PDOException $e) {
            $body = json_encode(['success' => false, 'message' => 'El email ya está registrado']);
            $response->getBody()->write($body);
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }
    }

    public function login($request, $response) {
        $data = $request->getParsedBody();

        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute(['email' => $data['email'] ?? '']);
        $user = $stmt->fetch();

        if (!$user || !password_verify($data['password'] ?? '', $user->password)) {
            $body = json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
            $response->getBody()->write($body);
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $payload = [
            'iss' => 'mini-task-manager',
            'sub' => $user->id,
            'iat' => time(),
            'exp' => time() + 86400
        ];

        $token = JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');

        $body = json_encode([
            'success' => true,
            'message' => 'Login exitoso',
            'data' => [
                'token' => $token,
                'user' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email]
            ]
        ]);
        $response->getBody()->write($body);
        return $response->withHeader('Content-Type', 'application/json');
    }
}
