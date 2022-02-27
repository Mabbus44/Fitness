<?php
$servername = "rasmus.today.mysql";
$username = "rasmus_today";
$password = "Lnrxn7UEj2D4WxcCfbdlfgnh";
$dbname = "rasmus_today";

//Conect to database
$conn = mysqli_connect($servername, $username, $password, $dbname);
if(!$conn)
    echo "noCon";

//Prepare statement
if(isset($_POST)){
    $text = "post but no var";;
    if(!isset($_POST["arg1"])){
        echo "invalid args";
    }
    if(!isset($_POST["arg2"])){
        echo "invalid args";
    }
}
$replacedStatement = "INSERT INTO `fitness` (timestamp, activity, value) VALUES (now(), ?, ?)";
$stmt = $conn->prepare($replacedStatement);
$stmt->bind_param("si", $_POST["arg1"], $_POST["arg2"]);
$stmt->execute();
$stmt->close();
$conn->close();
echo "ok";
?>