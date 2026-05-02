<?php
$host = 'localhost';
$dbname = 'skypro';
$username = 'root';
$password = 'Newjoker2k333';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected to database successfully!\n\n";

    $pdo->beginTransaction();
    echo "Starting cleanup...\n";

    // Delete in correct order
    echo "- Deleting audit_log...\n";
    $pdo->exec('DELETE FROM audit_log');

    echo "- Deleting devices...\n";
    $pdo->exec('DELETE FROM devices');

    echo "- Deleting subscriptions...\n";
    $pdo->exec('DELETE FROM subscriptions');

    echo "- Deleting activation_keys...\n";
    $pdo->exec('DELETE FROM activation_keys');

    echo "- Deleting nextauth_sessions...\n";
    $pdo->exec('DELETE FROM nextauth_sessions');

    echo "- Deleting accounts...\n";
    $pdo->exec('DELETE FROM accounts');

    echo "- Deleting verification_tokens...\n";
    $pdo->exec('DELETE FROM verification_tokens');

    echo "- Deleting users...\n";
    $count = $pdo->exec('DELETE FROM users');
    echo "Deleted $count users\n\n";

    // Create admin user
    echo "Creating admin user...\n";
    $adminEmail = 'admin@skywaveads.com';
    $adminPass = password_hash('Admin@2026', PASSWORD_DEFAULT);
    $adminName = 'Admin';

    $stmt = $pdo->prepare('INSERT INTO users (email, password_hash, name, role, status, email_verified_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())');
    $stmt->execute([$adminEmail, $adminPass, $adminName, 'admin', 'active']);
    echo "Admin user created: $adminEmail\n";

    // Create test user
    echo "\nCreating test user...\n";
    $testEmail = 'test@skywaveads.com';
    $testPass = password_hash('Test@2026', PASSWORD_DEFAULT);
    $testName = 'Test User';

    $stmt = $pdo->prepare('INSERT INTO users (email, password_hash, name, role, status, email_verified_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())');
    $stmt->execute([$testEmail, $testPass, $testName, 'user', 'active']);
    echo "Test user created: $testEmail\n";

    $pdo->commit();
    echo "\n✅ All operations completed successfully!\n";

    // List all users
    echo "\nAll users in database:\n";
    $users = $pdo->query('SELECT id, email, name, role, status FROM users');
    foreach ($users as $user) {
        echo "  ID: {$user['id']}, Email: {$user['email']}, Role: {$user['role']}, Status: {$user['status']}\n";
    }

} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo "Error: " . $e->getMessage() . "\n";
}
