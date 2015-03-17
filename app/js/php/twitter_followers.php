<?php
	if(isset($_POST['name'])) {
		session_start();
		require_once("twitteroauth/twitteroauth/twitteroauth.php"); //Path to twitteroauth library
		 
		$twitteruser = "KChapron";
		$notweets = 30;
		$consumerkey = "emWFGjwMYGT8WEgCvNt9UEKqB";
		$consumersecret = "CIWb6nWpwjCLvilA3iYHCeUc532KXB6m8LXPhHU1HbmiUKLW5P";
		$accesstoken = "565485966-jFJ6DiUauJOQKmoXDayDz6UFutQuaUTBb1OKeNW7";
		$accesstokensecret = "5h2Vg6F4FoZg8eXdsW23ZjlNbfFV85rYSO7t6iHzjra2C";
		 
		function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
		  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
		  return $connection;
		}
		 
		$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
		 
		$followers = $connection->get("https://api.twitter.com/1.1/followers/list.json?screen_name=".$twitteruser);

		$nbFollow = json_encode($followers->{'users'});

		// $jsonFollowers = json_encode($nbFollow);

		// return $jsonFollowers;
		session_destroy();
		echo $nbFollow;
	}
?>