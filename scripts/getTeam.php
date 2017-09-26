<?php
$lang = strval($_GET['lang']);

$conn = mysqli_connect('michella.mysql.db.internal', 'michella_user', 'SgjFhdaZ', 'michella_softozor');
if(!$conn)
{
  die("Could not connect: " . mysqli_error($conn));
}

buildAccordions($conn, $lang);

mysqli_close($conn);
?>

  <?php
function getShortDescription($conn, $lang, $id)
{
  $req = "SELECT " . $lang . " FROM short_desc WHERE id = '" . $id . "'";
  $res = mysqli_query($conn, $req);
  if($row = mysqli_fetch_row($res))
  {
    $returnValue = $row[0];
  }

  mysqli_free_result($res);
  return $returnValue;
}

function getPortfolio($conn, $lang, $id)
{
  $req = "SELECT " . $lang . " FROM portfolio WHERE id = '" . $id . "'";
  $res = mysqli_query($conn, $req);
  if($row = mysqli_fetch_row($res))
  {
    return $row[0];
  }

  mysqli_free_result($res);
}

function buildAccordions($conn, $lang)
{
  $req = "SELECT id, img, firstName, lastName FROM team_members";

  $res = mysqli_query($conn, $req);

  while($row = mysqli_fetch_array($res))
  {
    echo "<button class='accordion'  onclick='AccordionLoader.toggle(this)'>";
    echo "<figure>";
    echo "<img src='images/Team/" . $row['img'] . "'>";
    echo "</figure>";
    echo "<div class='shortDescr'>";
    echo "<h2>";
    echo $row['firstName'] . " " . $row['lastName'];
    echo "</h2>";
    echo getShortDescription($conn, $lang, $row['id']);
    echo "</button>"; 
    echo "<div class='panel'>";
    echo getPortfolio($conn, $lang, $row['id']);
    echo "</div>";
  }

  mysqli_free_result($res);
}
?>
