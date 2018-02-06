<?php
function getConnection($database)
{
  $conn = mysqli_connect('michella.mysql.db.internal', 'michella_user', 'SgjFhdaZ', $database);
  if(!$conn)
  {
    die("Could not connect: " . mysqli_error($conn));
  }
  return $conn;
}
?>
