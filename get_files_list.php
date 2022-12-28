<?
$path    = '.';
$files = scandir($path);
$files = array_diff(scandir($path), array('.', '..'));
$json_files=json_encode($files, JSON_PRETTY_PRINT);
//echo '['+$json_files+']';
echo $json_files;
?>