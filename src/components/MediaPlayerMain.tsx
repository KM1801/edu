import { ILocalVideoTrack, IRemoteVideoTrack, ILocalAudioTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import React, { useRef, useEffect } from "react";
import css from './mediaPlayerMain.module.scss';

export interface VideoPlayerProps {
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
  client_web: String;
  volume: any;
  setFullScreen: Function;
  changeScreenSize: Function;
  setvolumeLevel: Function;
  setZeroChannelOnFunc:any;
  ZeroChannelOn:any;
  fullScreen:any;
  setShowVideo:any;
  showVideo:any;
  currentChannel:any;
  setCurrentChannelFunc:any;
  roomData:any;
  conf_image:string;
  conf_name:string;
}

// Whack fullscreen
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
        //@ts-ignore
  } else if (document.mozCancelFullScreen) {
        //@ts-ignore
    document.mozCancelFullScreen();
        //@ts-ignore
  } else if (document.webkitExitFullscreen) {
        //@ts-ignore
    document.webkitExitFullscreen();
  }
}
    //@ts-ignore
function launchIntoFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function goFullScreen() {
    //@ts-ignore
  var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement ||
  //@ts-ignore
document.webkitFullscreenElement || document.msFullscreenElement;
	if(fullscreenElement){
  	exitFullscreen();
  }else {
  	launchIntoFullscreen(document.getElementById('parent_div'));
  }
}

const MediaPlayerMain = (props: VideoPlayerProps) => {
  const container = useRef<HTMLDivElement>(null);

  var fs = document.getElementById('btnFS');
  //
  fs?.addEventListener('click', goFullScreen);

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
  }, [container, props.audioTrack]);

  //changing volume for main screen
  useEffect(() => {
    if (props.volume==='default') return;
    if (!container.current) return;
    return () => {
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
    winMaxHeight="10vw";
  } else if (props.client_web==="main") {
    windowHeight="100%";
  }

  return (
    <div id={"parent_div"} ref={container} className={props.client_web!=="main" ? css.video_player_cover : css.video_player_contain}
    style={{ width: windowWidht, height: windowHeight, borderRadius: "10px", maxHeight:winMaxHeight, position: "relative"}}
    >

    <div className={css.btn_fs} id="btnFS" style={{"display":"none"}}>
      Fullscreen
    </div>
    <div className={css.logo} style={{"display":"none"}}>
      <img style={{"width":"54px", "height":"54px"}} src={props.conf_image}/>
    </div>

    {/* Custom controls */}
    {props.client_web==='main' ?
    <div className={css.flex_div}>
    <ul id="video-controls" className={css.controls}>

      {props.audioTrack ? <li style={{
        "display":"flex", 
        "alignContent":"center",
        "color":"#fff", 
        "fontWeight":"bold", 
        "backgroundColor":"#777",
        "borderRadius":"5px"
        }}>
        <img className={css.small_icon} src="https://rsi.exchange/wp-content/uploads/2021/01/volume-_new.png"/>
        <input className={"vol_control"} id="vol-control" type="range" min="0" max="100" step="1"
        onInput={(e:any) => props.setvolumeLevel(parseInt(e.target.value) as number)}
        onChange={(e:any) =>  props.setvolumeLevel(parseInt(e.target.value) as number)}>
        </input>
        
      </li>
      :
      <></>
      }

      <li>
        <a 
        id="mute" 
        onClick={(e)=>{
          props.setShowVideo(!props.showVideo)
        }}>
        {props.showVideo ?
        <img className={css.small_icon} src="https://rsi.exchange/wp-content/uploads/2021/01/hide_new.png"/>
        :
        <img className={css.small_icon} src="https://rsi.exchange/wp-content/uploads/2021/01/view.png"/>
        }
        </a>
      </li>
    </ul>
    </div>
    :
    <></>}
    </div>
  );
}

export default MediaPlayerMain;