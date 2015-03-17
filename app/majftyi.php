<?php
    $total_fans = 0;

    function getFacebookLikes($countName){
        if($countName!=""){
            $json = file_get_contents("http://graph.facebook.com/".$countName);
            $obj = json_decode($json);
            return $obj->likes;
        }else{
            return 0;
        }
    }
    function getTwitterFollowers($countName){

        if($countName!=""){

            session_start();

            require_once("twitteroauth/twitteroauth/twitteroauth.php"); //Path to twitteroauth library

            $twitteruser = $countName;

            $consumerkey = "emWFGjwMYGT8WEgCvNt9UEKqB";
            $consumersecret = "CIWb6nWpwjCLvilA3iYHCeUc532KXB6m8LXPhHU1HbmiUKLW5P";
            $accesstoken = "565485966-jFJ6DiUauJOQKmoXDayDz6UFutQuaUTBb1OKeNW7";
            $accesstokensecret = "5h2Vg6F4FoZg8eXdsW23ZjlNbfFV85rYSO7t6iHzjra2C";

            // function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
            //   echo "pass";
            //   $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
            //   return $connection;
            // } 

            $connection = new TwitterOAuth($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
            $infosCount = $connection->get("https://api.twitter.com/1.1/users/show.json?screen_name=".$twitteruser);
            session_destroy();
            return $infosCount->{'followers_count'};
        }else{
            return 0;
        }
    }
    function getYoutubeAbonnes($countName){
        if($countName!=""){
            $JSON = file_get_contents("http://gdata.youtube.com/feeds/api/users/".$countName."?alt=json");
            $JSON_Data = json_decode($JSON, true);
            return intval($JSON_Data["entry"]["yt\$statistics"]["subscriberCount"]);
        }else{
            return 0;
        }
    }
    function getInstaID($username){
        $username = strtolower($username);
        $token = "1754953319.1677ed0.0ad1ba1915f5415d87c043aed04d570c";
        $url = "https://api.instagram.com/v1/users/search?q=".$username."&access_token=".$token;
        $get = file_get_contents($url);
        $json = json_decode($get);
        foreach($json->data as $user)
        {
            if($user->username == $username)
            {
                return $user->id;
            }
        }
        return '00000000'; // return this if nothing is found
    }
    function getInstagramAbonnes($countName){
        if($countName!=""){
            $ID = getInstaID($countName);
            $token = "1754953319.1677ed0.0ad1ba1915f5415d87c043aed04d570c";
            $JSON = file_get_contents("https://api.instagram.com/v1/users/".$ID."/?access_token=".$token);
            $JSON_Data = json_decode($JSON, true);
            return $JSON_Data["data"]["counts"]["followed_by"];
        }else{
            return 0;
        }
    }
    function MAJJson(){
        $JSON = file_get_contents("js/data.json");
        $rappers = json_decode($JSON, true);
        
        foreach($rappers as &$rapper) {
            $rapper['likes'] = getFacebookLikes($rapper['facebook']);
            $rapper['followers'] = getTwitterFollowers($rapper['twitter']);
            $rapper['abonnes'] = getYoutubeAbonnes($rapper['youtube']);
            $rapper['insta_follows'] = getInstagramAbonnes($rapper['instagram']);
            $rapper['v3'] = $rapper['likes'] + $rapper['followers'] + $rapper['abonnes'] + $rapper['insta_follows'];

            $total_fans += $rapper['likes'];
            $total_fans += $rapper['followers'];
            $total_fans += $rapper['abonnes'];
            $total_fans += $rapper['insta_follows'];

            
        }

        foreach ($rappers as &$rapper) {
            $rapper['total_fans'] = $total_fans;
        }

        $rappersEncode = json_encode($rappers);
        file_put_contents("js/data.json", $rappersEncode);

        echo "done";
    }
?>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Test json</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!--     <link rel="stylesheet" type="text/css" href="jquery.fullPage.css" /> -->
        <!-- <link rel="stylesheet" href="./style/master.css"> -->
        <!-- <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"> -->
    </head>
    <body>
        <p>Nombre de likes Facebook de La Fouine : <span class='fb'><?php echo getFacebookLikes("lafouine78officiel"); ?></span></p>
        <p>Nombre de followers Twitter de La Fouine : <span class='tw'><?php echo getTwitterFollowers("78LaFouine"); ?></span></p>
        <p>Nombre d'abonnés Youtube de La Fouine : <span class='yt'><?php echo getYoutubeAbonnes("lafouineofficiel"); ?></span></p>
        <p>Nombre d'abonnés Instagram de La Fouine : <span class='yt'><?php echo getInstagramAbonnes("lafouine78"); ?></span></p>
        <br/>
        <br/>
        <?php MAJJson(); ?>
    </body>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/twitterlib.js/1.0.8/twitterlib.min.js"></script>
    <script type="text/javascript">
        // $(function(){
        //     $.getJSON( "http://graph.facebook.com/lafouine78officiel", function( data ) {
        //         console.log(data.likes);
        //         $( "p span.fb" ).html( data.likes );
        //     });
        // })
        
    </script>
</html>