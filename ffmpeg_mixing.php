<?
try {
    //Reduce background volume, assuming it's input2.mp3
    shell_exec('ffmpeg -i 02-10-2021/MAIN_VIDEO(Test2Edu123)10:16:41am.mpeg -af "volume=0.3" backround.wav');
    //Merge the two
    shell_exec('ffmpeg -y -i  02-10-2021/Teacher(Test2Edu123)10:16:41am.mpeg -i  02-10-2021/background.wav -filter_complex amerge -c:a libmp3lame -q:a 4 output.mp3');
} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}
?>