<?php
header("access-control-allow-origin: *");
header("access-control-allow-methods: POST");
header("access-control-allow-headers: Content-Type");

$data = json_decode(file_get_contents('php://input'), true);

if(!empty($data['website']))
{
  die();
}

if ($_SERVER['REQUEST_METHOD'] != 'OPTIONS') {
  // TODO: get that e-mail from the database!
  $to      = 'laurent.michel@softozor.ch';
  $subject = 'New request from website';
  $name = $data['name'];
  $email_to = $data['email'];
  $tel = $data['tel'];
  $msg = $data['message'];
  $headers = 'From: ' . $email_to . "\r\n" .
  'Reply-To: ' . $to . "\r\n" .
  'X-Mailer: PHP/' . phpversion();

  $message = "Message from $name with e-mail $email_to and telephone number $tel:\n\n$msg";

  $send = mail($to, $subject, $message, $headers);

  if($send) {
    http_response_code(200);
  }
  else {
    http_response_code(401);
  }
}
?>
