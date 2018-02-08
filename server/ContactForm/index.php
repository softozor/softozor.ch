<?php
header("Access-Control-Allow-Origin: *");
require '../getConnection.php';
$lang = strval($_GET['lang']);
$conn = getConnection("michella_contact");
buildFieldSet($conn, $lang);  
mysqli_close($conn);
?>

<?php
function getPlaceHolder($conn, $lang, $id)
{
  $req = "SELECT " . $lang . " FROM placeholders WHERE id = '" . $id . "'";
  $res = mysqli_query($conn, $req);
  if($row = mysqli_fetch_row($res))
  {
    $returnValue = $row[0];
  }
  
  mysqli_free_result($res);
  return $returnValue;
}

function buildFieldSet($conn, $lang)
{
  echo "<fieldset>";
  $req = "SELECT id, field, required, type, name FROM fields_definition";
  $res = mysqli_query($conn, $req);
  $i = 0;
  while($row = mysqli_fetch_array($res))
  {
    echo "<";
    echo $row['field'] . " ";
    if(!empty($row['type']))
    {
      echo "type='" . $row['type'] . "' ";
    }
    if(isset($row['name']))
    {
      echo "name='" . $row['name'] . "' "; 
    }
    echo "tabindex='" . ++$i . "' "; 
    if($row['required'])
    {
      echo "required ";
    }
    
    if($row['field'] != "button")
    {
      echo "placeholder='" . getPlaceHolder($conn, $lang, $row['id']) . "'></" . $row['field'] . ">";
    }
    else 
    { 
        echo ">"; 
        echo getPlaceHolder($conn, $lang, $row['id']); 
        echo "</ " . $row['field'] . ">"; 
    }
  }
  echo "</fieldset>";
}
?>
