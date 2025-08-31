<?php
try {
$pdo = new PDO('mysql:host=localhost;dbname=dname', 'user', 'password');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $affected = $pdo->exec("UPDATE deletion SET value='0' WHERE value=1"); //or other table
    if($affected > 0){
        echo "1";
    } else {
        echo "0";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>