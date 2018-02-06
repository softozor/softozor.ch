<?php
if(!empty($_POST['website']))
{
  die();
}

// TODO: get that e-mail from the database!
$to      = 'laurent.michel@softozor.ch';
$subject = 'New request from website';
$name = $_POST['name'];
$email_to = $_POST['email'];
$tel = $_POST['tel'];
$msg = $_POST['message'];
$headers = 'From: ' . $email_to . "\r\n" .
'Reply-To: ' . $to . "\r\n" .
'X-Mailer: PHP/' . phpversion();

$message = "Message from $name with e-mail $email_to and telephone number $tel:\n\n$msg";

$send = mail($to, $subject, $message, $headers);

// TODO: prepare nice webpage that displays "E-mail sent" along with a link to softozor.ch
if($send) {
   echo "Email sent";
}
else {
    echo "Email sending failed";
}

?>
