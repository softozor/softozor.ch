<?php
require 'getConnection.php';

$lang = strval($_GET['lang']);
$contentId = strval($_GET['contentId']);

$conn = getConnection("michella_softozor");

echo getContent($conn, $lang, $contentId);

mysqli_close($conn);
?>

  <?php
function getContent($conn, $lang, $contentId)
{
  $req = "SELECT " . $lang . " FROM general_text WHERE id='" . $contentId . "'";
  $res = mysqli_query($conn, $req);
  
  if($row = mysqli_fetch_row($res))
  {
    $returnValue = $row[0];
  }

  mysqli_free_result($res);
  return $returnValue;
}
?>
