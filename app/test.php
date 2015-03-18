<?php 
	$string = "test le : ".date("d-m-Y")." à ".date("H:i")."\n";
	$nom_fichier='preprod/fichier.txt';
	file_put_contents($nom_fichier, $string, FILE_APPEND);
	echo "c'est fait encore et encore";
?>