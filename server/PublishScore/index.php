<?php
require '../getConnection.php';

header("access-control-allow-origin: *");
header("access-control-allow-methods: POST");
header("access-control-allow-headers: Content-Type");

$data = json_decode(file_get_contents('php://input'), true);

$username = $data['username'];
$score = $data['score'];

$conn = getConnection("michella_game");

$maxNbScores = 20;

if ($_SERVER['REQUEST_METHOD'] != 'OPTIONS') {
  if(getNbScores($conn) < $maxNbScores) {
    insertScore($conn, $username, $score);
  } else {
    $smallestScore = getSmallestScore($conn);
    replaceScore($conn, $smallestScore, $username, $score);
  }
}

mysqli_close($conn);
?>

<?php
function getNbScores($conn) {
  $req = "SELECT COUNT(*) FROM scores";
  if($res = $conn->query($req)) {
    $row = $res->fetch_row();
    $nbRows = $row[0];
    mysqli_free_result($res);
  }
  return $nbRows;
}

function insertScore($conn, $username, $score) {
  $req = "INSERT INTO scores(username, score) VALUES ('".$username."', '".$score."')";
  if($conn->query($req) === TRUE) {
    http_response_code(200);
  } else {
    http_response_code(500);
  }
}

function getSmallestScore($conn) {
  $req = "SELECT min(score) FROM scores";
  if($res = $conn->query($req)) {
    $row = $res->fetch_row();
    $result = $row[0];
    mysqli_free_result($res);
  }
  return $result;
}

function replaceScore($conn, $oldScore, $username, $score) {
  $req = "UPDATE scores SET username='".$username."', score='".$score."' WHERE score=".$oldScore;
  if($conn->query($req) === TRUE) {
    http_response_code(200);
  } else {
    http_response_code(500);
  }
}
?>