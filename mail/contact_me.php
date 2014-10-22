<?php
// Check for empty fields
if(empty($_POST['name'])  		||
   empty($_POST['email']) 		||
   empty($_POST['phone']) 		||
   empty($_POST['message'])	||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	echo "No arguments Provided!";
	return false;
   }
	
$name = $_POST['name'];
$email_address = $_POST['email'];
$phone = $_POST['phone'];
$message = $_POST['message'];
	
// Create the email and send the message
$to = 'contato@rapatao.com';
$email_subject = "[rapatao.com] Contato:  $name";
$email_body = "Você recebeu a seguinte mensagem:\n\n"."Nome: $name\n\nE-mail: $email_address\n\nTelefone: $phone\n\nMensagem:\n$message";
$headers = "From: noreply@rapatao.com\n";
$headers .= "Reply-To: $email_address";
mail($to,$email_subject,$email_body,$headers);
return true;			
?>