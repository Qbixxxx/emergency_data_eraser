<?php
$pdo = new PDO('mysql:host=localhost;dbname=dname', 'user', 'password');
$pdo->exec("UPDATE deletion SET value='1' WHERE value=0"); //or other table
echo "OK";
?>