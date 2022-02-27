<?php
$servername = "rasmus.today.mysql";
$username = "rasmus_today";
$password = "Lnrxn7UEj2D4WxcCfbdlfgnh";
$dbname = "rasmus_today";

//Conect to database
$conn = mysqli_connect($servername, $username, $password, $dbname);
if(!$conn)
    echo "noCon";

$replacedStatement = "SELECT timestamp, activity, value FROM `fitness`";
$stmt = $conn->prepare($replacedStatement);
$stmt->execute();

$data = $stmt->get_result();
$stmt->close();
$conn->close();
$result = array();
while($row = $data->fetch_assoc()) {
    array_push($result, $row);
}
echo json_encode($result);
?>