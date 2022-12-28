<?
try {
    //Reduce background volume, assuming it's input2.mp3
    //shell_exec('ffmpeg -i 1.mpeg -af "volume=0.3" background.wav');
    //Merge the two
    shell_exec('ffmpeg -i 2.mpeg -i 1.mpeg -filter_complex amix=inputs=2:duration=longest output.mp3');
    //shell_exec('ffmpeg -y -i 2.mpeg -i 1.mpeg -filter_complex amerge -c:a libmp3lame -q:a 4 output.mp3');
} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}
?>