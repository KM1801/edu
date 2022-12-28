import { ILocalVideoTrack, IRemoteVideoTrack, ILocalAudioTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import React, { useRef, useEffect } from "react";
import css from './mediaPlayer.module.scss';

export interface VideoPlayerProps {
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
  client_web: String;
  volume: any;
}

const MediaPlayer = (props: VideoPlayerProps) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
      props.videoTrack?.play(container.current);
    return () => {
      props.videoTrack?.stop();
    };

  }, [container, props.videoTrack]);

  useEffect(() => {
    props.audioTrack?.play();
    return () => {
      props.audioTrack?.stop();
    };
  }, [props.audioTrack]);

  //changing volume for main screen
  useEffect(() => {
    if (props.volume==='default') return;
    if (!container.current) return;
    return () => {
      
      console.log('_____CHANGING_VOLUME-parseInt(props.volume_________')
      console.log(parseInt(props.volume))
      
      props.audioTrack?.setVolume(parseInt(props.volume));
    };
  }, [props.volume]);

  let windowWidht:string="", windowHeight:string="200px", winMaxHeight="inherit";
  if (props.client_web==="client") 
   {
     windowWidht="250px";
     windowHeight="200px";
  } else if (props.client_web==="partner") 
  {
    windowWidht="10vw";
    windowHeight="100%";
    winMaxHeight="15vw";
  } else if (props.client_web==="main") {
    windowHeight="100%";
  } else if (props.client_web==="auido") {
    windowWidht="0";
    windowHeight="0";
  }

  return (
    <div ref={container}  
    className={props.client_web!=="main" ? css.video_player_cover : css.video_player_contain}
    style={{ width: windowWidht, height: windowHeight, borderRadius: "10px", maxHeight:winMaxHeight}}
    ></div>
  );
}

export default MediaPlayer;