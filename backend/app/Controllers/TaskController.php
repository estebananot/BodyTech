<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class TaskController {
    private $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    private function getAuthenticatedUserId($request) {
        $authHeader = $request->getHeader('Authorization');
        if (!$authHeader || !preg_match('/Bearer\s+(.*)$/', $authHeader[0], $matches)) {
            return false;
        }
        $token = $matches[1];
        try {
            $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
            return $decoded->sub;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function index($request, $response) {
        $userId = $this->getAuthenticatedUserId($request);
        if (!$userId) {
            $body = json_encode(['success' => false, 'message' => 'No autorizado']);
            $response->getBody()->write($body);
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $params = $request->getQueryParams();
        $status = $params['status'] ?? null;

        $sql = "SELECT * FROM tasks WHERE user_id = ?";
        $execParams = [$userId];

        if ($status && in_array($status, ['pending', 'in_progress', 'done'])) {
            $sql .= " AND status = ?";
            $execParams[] = $status;
        }

        $sql .= " ORDER BY created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($execParams);
        $tasks = $stmt->fetchAll();

        $body = json_encode(['success' => true, 'data' => $tasks]);
        $response->getBody()->write($body);
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function create($request, $response) {
        $userId = $this->getAuthenticatedUserId($request);
        if (!$userId) {
            $body = json_encode(['success' => false, 'message' => 'No autorizado']);
            $response->getBody()->write($body);
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $data = $request->getParsedBody();

        if (!isset($data['title'])) {
            $body = json_encode(['success' => false, 'message' => 'El título es requerido']);
            $response->getBody()->write($body);
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        $stmt = $this->db->prepare("INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $userId,
            $data['title'],
            $data['description'] ?? null,
            $data['status'] ?? 'pending'
        ]);

        $taskId = $this->db->lastInsertId();

        $stmt = $this->db->prepare("SELECT * FROM tasks WHERE id = ?");
        $stmt->execute([$taskId]);
        $task = $stmt->fetch();

        $body = json_encode([
            'success' => true,
            'message' => 'Tarea creada exitosamente',
            'data' => $task
        ]);
        $response->getBody()->write($body);
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }

    public function update($request, $response, $args) {
        $userId = $this->getAuthenticatedUserId($request);
        if (!$userId) {
            $body = json_encode(['success' => false, 'message' => 'No autorizado']);
            $response->getBody()->write($body);
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $id = $args['id'];

        $stmt = $this->db->prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        $task = $stmt->fetch();

        if (!$task) {
            $body = json_encode(['success' => false, 'message' => 'Tarea no encontrada']);
            $response->getBody()->write($body);
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        $data = $request->getParsedBody();

        $fields = ['title', 'description', 'status'];
        $updates = [];
        $params = [];

        foreach ($fields as $field) {
            if (isset($data[$field])) {
                $updates[] = "$field = ?";
                $params[] = $data[$field];
            }
        }

        if (!empty($updates)) {
            $params[] = $userId;
            $params[] = $id;
            $sql = "UPDATE tasks SET " . implode(', ', $updates) . " WHERE user_id = ? AND id = ?";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
        }

        $stmt = $this->db->prepare("SELECT * FROM tasks WHERE id = ?");
        $stmt->execute([$id]);
        $task = $stmt->fetch();

        $body = json_encode([
            'success' => true,
            'message' => 'Tarea actualizada exitosamente',
            'data' => $task
        ]);
        $response->getBody()->write($body);
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function delete($request, $response, $args) {
        $userId = $this->getAuthenticatedUserId($request);
        if (!$userId) {
            $body = json_encode(['success' => false, 'message' => 'No autorizado']);
            $response->getBody()->write($body);
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $id = $args['id'];

        $stmt = $this->db->prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);

        if ($stmt->rowCount() > 0) {
            $body = json_encode(['success' => true, 'message' => 'Tarea eliminada']);
            $response->getBody()->write($body);
            return $response->withHeader('Content-Type', 'application/json');
        }

        $body = json_encode(['success' => false, 'message' => 'Tarea no encontrada']);
        $response->getBody()->write($body);
        return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
    }
}
