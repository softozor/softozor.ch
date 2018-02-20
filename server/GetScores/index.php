<?php
require '../getConnection.php';

header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');

$conn = getConnection("michella_game");
$scores = getScores($conn);
echo json_encode($scores);
mysqli_close($conn);
?>

<?php
function getScores($conn) {
  $req = "SELECT DISTINCT username, score FROM scores ORDER BY score DESC";
  $result = array();
  if($res = $conn->query($req)) {
    while($row = $res->fetch_array()) {
      array_push($result, array("username" => $row[0], "score" => $row[1]));
    }
  }
  mysqli_free_result($res);
  return $result;
}
?>