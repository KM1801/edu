import React from 'react';
import AgoraRTC, { ILocalAudioTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';
import {useState, useEffect, useMemo} from 'react';
import css from './app.module.scss';
import Header from './components/header/header';
import PreCall from './components/pre_call/pre_call';
import Languages_choice from "./components/languages_choice/languages_choice";
import Cabin_choice from "./components/cabin_choice/cabin_choice";
import Chat_box from './components/chat_box/chat_box';
import {MainContextProvider} from './components/main_context';
import MediaPlayer from './components/MediaPlayer';
import MediaPlayerMain from './components/MediaPlayerMain';
import useAgora from './hooks/useAgora';
import axios from "axios";
import ReactPlayer from 'react-player';
import Button_camera from './components/button_camera/button_camera';
import Button_screen from './components/button_screen/button_screen';
import Button_mic_all from './components/button_mic_all/button_mic_all';
import Button_mic_to_student from './components/button_mic_to_student/button_mic_to_student';
import Button_mic_mute from './components/button_mic_mute/button_mic_mute';
import Button_record from './components/button_record/button_record';
import Button_terminate from './components/button_terminate/button_terminate';
import Volume_host from './components/volume_host/volume_host';
import Volume_student from './components/volume_student/volume_student';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Carousel from 'react-bootstrap/Carousel';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import vmsg from "vmsg";

/* App data */
let appData = {}

const arrayNames = [
  'Зал',
  'Кабина 1',
  'Кабина 2',
  'Кабина 3',
  'Кабина 4',
  'Кабина 5',
  'Кабина 6',
  'Кабина 7',
  'Кабина 8',
  'Кабина 9',
  'Кабина 10',
  'Кабина 11',
  'Кабина 12',
  'Кабина 13',
  'Кабина 14',
  'Кабина 15',
]

const SERVER_NAME = 'https://web-sockets-uy7atznzra-ey.a.run.app/';

/* Get params data */
const urlParams:URLSearchParams = new URLSearchParams(window.location.search);
const TokenGet:string | null = urlParams.get('uuid_');

//custom lang count for certain conferences
let langCountMode_precall:string;
let langCountMode_relay:string;
langCountMode_precall='DEFAULT_LANG';
langCountMode_relay= 'DEFAULT_LANG';

const CODEC = 'vp8';

/* Agora clients */
// Chat room
const client = AgoraRTC.createClient({ codec: CODEC, mode: 'rtc' });

// Speaker room (to recive speaker video and audio)
const client_host = AgoraRTC.createClient({ codec: CODEC, mode: 'live' });

// Speaker room (to push video and audio from file)
const client_host_edu = AgoraRTC.createClient({ codec: CODEC, mode: 'rtc' });

// Student room (to speak one by one)
const client_rtc_student = AgoraRTC.createClient({ codec: CODEC, mode: 'rtc' });

// Speaker room (always list to host)
const client_host_edu_live = AgoraRTC.createClient({ codec: CODEC, mode: 'live' });

// Teacher room (cabins always playing teacher)
const client_teacher_edu_live = AgoraRTC.createClient({ codec: CODEC, mode: 'live' });

// Relay rooms (to change zero audio track)
const client_relay:any=[];
client_relay[0]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });
client_relay[1]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });
client_relay[2]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });
client_relay[3]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });
client_relay[4]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });
client_relay[5]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });
client_relay[6]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });
client_relay[7]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });
client_relay[8]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });
client_relay[9]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });
client_relay[10]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });
client_relay[11]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });
client_relay[12]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });
client_relay[13]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });
client_relay[14]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });
client_relay[15]=AgoraRTC.createClient({ codec: CODEC, mode: 'live' });

// Target room (for streamer - MIC button)
const client_target = AgoraRTC.createClient({ codec: CODEC, mode: 'rtc' });

/* Agora system req */
const systemRequerments = AgoraRTC.checkSystemRequirements();

// Default Values for speaker and relay
(window as any).TARGET_ROOM = 0;
(window as any).STUDENT_ROOM = 1;
(window as any).RELAY_ROOM = 6;

//@ts-ignore
const recorder = new vmsg.Recorder({
  wasmURL: "https://unpkg.com/vmsg@0.3.0/vmsg.wasm"
});

const App = () => {
  //PLAY VIDEO EDU
  const [videoStart, setVideoStart] = useState<boolean>(false);
  //STARTING FILE MESSAGE BOOL
  const [videoStartProccess, setVideoStartProccess] = useState<boolean>(false);
  //REACT PLAYER PLAYING
  const [playingBool, setPlayingBool] = useState<boolean>(false);
  //Secret Name for teacher
  const [secretName, setSecretName]=useState<boolean>(false);
  //Secret Name for support
  const [secretNameSupport, setSecretNameSupport]=useState<boolean>(false);
  //File loading message
  const [textFileLoad, setTextFileLoad]=useState<string | any>('Choose file');
  //mute button for muting host
  const [MuteHostForTeacher, setMuteHostForTeacher]=useState<boolean>(false);
  //TERMINATE THE CONFERENCE
  const [TerminateConference, setTerminateConference]=useState<boolean>(false);
  //switch channel
  const [switch_channel_value, switch_channel]=useState<any>(0);
  //busy cabins
  const [BusyCabinsArray, setBusyCabinsArray]=useState<Array<any>>([]);
  //teacher's button state
  const [TeacherButton, setTeacherButton]=useState<boolean>(false);
  //teacher's button state
  const [ExitByDemand, setExitByDemand]=useState<boolean>(false);
  //Current folder file
  const [ActiveFilesFolder, setActiveFilesFolder]=useState<string>("Videos");
  //trackToPublish
  const [TrackToPublish, setTrackToPublish]=useState<any>();
  
  function VOID_FUNC(voidArg:boolean):any {
    return true;
  }

  //ARRAY for files
  const [filesArray, setFilesArray] = useState<Array<string>>(['01_sample.mp4','02_sample.mp4','03_sample.mp4']);
  //Current file
  const [currentPlayFileName, setCurrentPlayFileName] = useState<any>('');
  //Current Link string
  const [currentLinkString, setCurrentLinkString] = useState<string>('');

  //MAIN VIDEO
  const [volumeLevel, setvolumeLevel] = useState<boolean>(false);
  const [showVideo, setShowVideo] = useState<boolean>(true);

  //Dispatch starting recording
  const [DispatchRecording, setDispatchRecording]=useState<boolean>(false);
  const [Recordings, setRecordings]=useState<Array<any>>([]);

  //room's data (from nodejs server)
  const [ roomData, setRoomData ] = useState([]);
  // Deafult room (RU)
  const [ channel, setChannel ] = useState(0);

  // Application terminate
  const [ ApplicationTerminate, setApplicationTerminate ] = useState<boolean>(false);

  //second screen (show as soon as data is delivered)
  const [ showSecondScreen, setShowSecondScreen ] = useState<boolean>(false);
  function hideScreen (value:any) {
    setShowSecondScreen(value);
  }

  //client has entered to chat room
  const [ chatRoomEntered, setChatRoomEntered ] = useState<boolean>(false);
  function setChatRoomEnteredFunc (value:any) {
    setChatRoomEntered(value);
  }

  //Partners ids
  const [partnerIDs, setPartnerIDs] = useState<Array<number>>([]);
  function setPartnerIDsFunc (value:any) {
    setPartnerIDs(value);
  }

  //Show/hide chat window
  const [showChat, setshowChat] = useState<boolean>(true);
  function setShowChatFunc (value:any) {
    setshowChat(value);
  }

  //show/hide user's video
  const [showUserVideo, setshowUserVideo] = useState<boolean>(true);
  function setshowUserVideoFunc (value:any) {
    setshowUserVideo(value);
  }

  //key value for user window
  const [userVideoKey, setUserVideoKey] = useState<number>(4002);
  function setUserVideoKeyFunc (value:any) {
    setUserVideoKey((userVideoKey:any) => userVideoKey+1);
  }

  //Active relays
  const [activeRelays, setActiveRelays] = useState<Array<any>>([]);
  function setActiveRelaysFunc (value:any) {
    setActiveRelays(value);
  }

  //leaving target channel (TRUE/FALSE)
  const [ exitTargetChannel, setExitTargetChannel ] = useState<boolean>(true);
  function setExitTargetChannelFunc (value:any) {
    setExitTargetChannel(value);
  }

  //leaving student channel (TRUE/FALSE)
  const [ exitStudentChannel, setExitStudentChannel ] = useState<boolean>(true);
  function setExitStudentChannelFunc (value:any) {
    setExitStudentChannel(value);
  }

  //change student channel
  const [ StudentChannel, setStudentChannel ] = useState<number>(1);
  function setStudentChannelFunc (value:any) {
    setStudentChannel(value);
  }

  //channge target channel
  const [ targetChannel, setTargetChannel ] = useState<number>(0);
  function setTargetChannelFunc (value:any) {
    setTargetChannel(value);
  }

  //channge relay channel (floor by default)
  const [ relayChannel, setRelayChannel ] = useState<number>(6);
  function setRelayChannelFunc (value:any) {
    setRelayChannel(value);
  }

  //channge prev relay channel (0 by default)
  const [ PrevRelayChannel, setPrevRelayChannel ] = useState<number>(0);
  function setPrevRelayChannelFunc (value:any) {
    setPrevRelayChannel(value);
  }

  // relay channel stream object
  const [ relayChannelStream, setRelayChannelStream ] = useState(undefined);
  function setRelayChannelStreamFunc (value:any) {
    setRelayChannelStream(value);
  }

  // relay unqie key (for chat oscilloscope)
  const [ relayKey, setRelayKey ] = useState<number>(0);
  function setRelayKeyFunc (value:any) {
    setRelayKey(value);
  }

  // START/STOP STREAM
  const [streamStart, setStreamStart] = useState<boolean>(false);
  function setStreamStartFunc (value:any) {
    setStreamStart(value);
  }

  // JOIN ONE STUDENT
  const [StreamStartOne, setStreamStartOne] = useState<boolean>(false);
  function setStreamStartOneFunc (value:any) {
    setStreamStartOne(value);
  }

  // SET STREAMER
  const [currentStreamer, setCurrentStreamer] = useState('');
  function setCurrentStreamerFunc (value:any) {
    setCurrentStreamer(value);
  }

  // MUTE BIG BUTTON
  const [muteTarget, setmuteTarget] = useState('');
  function muteTargetFunc (value:any) {
    setmuteTarget(value);
  }

  // MIC BUTTON DELAY
  const [micButtonDelay, setMicButtonDelay] = useState<boolean>(false);
  function micButtonDelayFunc (value:any) {
    setMicButtonDelay(value);
  }

  const [ SourceActive, setSourceActive ] = useState<boolean>(false);
  const [ SourceType, setSourceType ] = useState<string>('');
  //VOID
  function returnVoid(value:any) {
    return value;
  }

  // volume (relay)
  const [ mainVolume, SetMainVolume ] = useState<number>(100);

  // volume for student room's video
  const [ mainVolumeSecond, SetMainVolumeSecond ] = useState<number>(100);

  // video volume
  const [ VolumeVideo, setVolumeVideo ] = useState<number>(100);
  // student's volume
  const [ StudentVolume, SetStudentVolume ] = useState<number>(100);

  // Methods to access channels
  const {
    localAudioTrack, localVideoTrack, leave, join, joinState, remoteUsers, muteSelf, muteEntering, muteRemoteUser, turnOffVideo
  } = useAgora(client, 'chatRoom', 0);
  const speaker_client = useAgora(client_host, 'speaker', 0);
  const target_client = useAgora(client_target, 'target', 0);
  const target_rtc_student = useAgora(client_rtc_student, 'target', 1);
  
  const relay_client:any=[];
  relay_client[0] = useAgora(client_relay[0], 'relay', 0);
  relay_client[1] = useAgora(client_relay[1], 'relay', 1);
  relay_client[2] = useAgora(client_relay[2], 'relay', 2);
  relay_client[3] = useAgora(client_relay[3], 'relay', 3);
  relay_client[4] = useAgora(client_relay[4], 'relay', 4);
  relay_client[5] = useAgora(client_relay[5], 'relay', 5);
  relay_client[6] = useAgora(client_relay[6], 'relay', 6);
  relay_client[7] = useAgora(client_relay[7], 'relay', 7);
  relay_client[8] = useAgora(client_relay[8], 'relay', 8);
  relay_client[9] = useAgora(client_relay[9], 'relay', 9);
  relay_client[10] = useAgora(client_relay[10], 'relay', 10);
  relay_client[11] = useAgora(client_relay[11], 'relay', 11);
  relay_client[12] = useAgora(client_relay[12], 'relay', 12);
  relay_client[13] = useAgora(client_relay[13], 'relay', 13);
  relay_client[14] = useAgora(client_relay[14], 'relay', 14);
  relay_client[15] = useAgora(client_relay[15], 'relay', 15);

  //EDU RELAY CLIENTS PART
  let relay_client_host_edu_live:any, relay_client_teacher_edu_live:any;
  relay_client_host_edu_live = useAgora(client_host_edu_live, 'relay', 0);
  relay_client_teacher_edu_live = useAgora(client_teacher_edu_live, 'relay', 0);

  // Nickname and muting
  const [nickName, setnickName] = useState('User');
  const [muteSelfBoolean, setmuteSelfBoolean] = useState(false);
  const [muteRemoteUsers, setmuteRemoteUsers] = useState<Array<string | Number>>([]);
  
  // Enter the channel
  useEffect (() => {
    // get all tokens and room's names
    axios.get(SERVER_NAME+'get_tokens_by_uuid_array?uuid_='+TokenGet)
    .then(function (response) {
      setRoomData(response.data);
      if (showSecondScreen) {
        (window as any).LANGUAGES_COUNT = response.data[1].length;
        // Current relay channel - FLOOR (last)
        setRelayChannelFunc(15);
        (window as any).RELAY_ROOM = 15;
        (window as any).TARGET_ROOM = channel;
        (window as any).CONF_IMAGE = response.data[5][4];

        // chat room (to communicate inside of the cabin)
        join(
          response.data[0][0],
          response.data[1][channel],
          setChatRoomEnteredFunc,
          response.data[2][channel],
          '', 
          nickName,
          showUserVideo);

        // student's room (one to one)
        target_rtc_student.join_target(response.data[0][0], response.data[3][1], setExitStudentChannelFunc, response.data[4][1]);

        // speaker room (to capture video from floor channel)
        speaker_client.join_speaker(response.data[0][0], response.data[5][0], response.data[5][1]);

        // target room - enter the stream channel (to be a publisher)
        target_client.join_target(response.data[0][0], response.data[3][channel], setExitTargetChannelFunc, response.data[4][channel]);

        // relay rooms
        if ((window as any).LANGUAGES_COUNT===2) {
          relay_client[0].join_relay(response.data[0][0], response.data[3][0], response.data[4][0]);
          relay_client[1].join_relay(response.data[0][0], response.data[3][1], response.data[4][1]);
        } else if ((window as any).LANGUAGES_COUNT===3) {
          relay_client[0].join_relay(response.data[0][0], response.data[3][0], response.data[4][0]);
          relay_client[1].join_relay(response.data[0][0], response.data[3][1], response.data[4][1]);
          relay_client[2].join_relay(response.data[0][0], response.data[3][2], response.data[4][2]);
        } else if ((window as any).LANGUAGES_COUNT===4) {
          relay_client[0].join_relay(response.data[0][0], response.data[3][0], response.data[4][0]);
          relay_client[1].join_relay(response.data[0][0], response.data[3][1], response.data[4][1]);
          relay_client[2].join_relay(response.data[0][0], response.data[3][2], response.data[4][2]);
          relay_client[3].join_relay(response.data[0][0], response.data[3][3], response.data[4][3]);
        } else if ((window as any).LANGUAGES_COUNT===5) {
          relay_client[0].join_relay(response.data[0][0], response.data[3][0], response.data[4][0]);
          relay_client[1].join_relay(response.data[0][0], response.data[3][1], response.data[4][1]);
          relay_client[2].join_relay(response.data[0][0], response.data[3][2], response.data[4][2]);
          relay_client[3].join_relay(response.data[0][0], response.data[3][3], response.data[4][3]);
          relay_client[4].join_relay(response.data[0][0], response.data[3][4], response.data[4][4]);
        } else if ((window as any).LANGUAGES_COUNT===6) {
          relay_client[0].join_relay(response.data[0][0], response.data[3][0], response.data[4][0]);
          relay_client[1].join_relay(response.data[0][0], response.data[3][1], response.data[4][1]);
          relay_client[2].join_relay(response.data[0][0], response.data[3][2], response.data[4][2]);
          relay_client[3].join_relay(response.data[0][0], response.data[3][3], response.data[4][3]);
          relay_client[4].join_relay(response.data[0][0], response.data[3][4], response.data[4][4]);
          relay_client[5].join_relay(response.data[0][0], response.data[3][5], response.data[4][5]);
        } else if ((window as any).LANGUAGES_COUNT===7) {
          relay_client[0].join_relay(response.data[0][0], response.data[3][0], response.data[4][0]);
          relay_client[1].join_relay(response.data[0][0], response.data[3][1], response.data[4][1]);
          relay_client[2].join_relay(response.data[0][0], response.data[3][2], response.data[4][2]);
          relay_client[3].join_relay(response.data[0][0], response.data[3][3], response.data[4][3]);
          relay_client[4].join_relay(response.data[0][0], response.data[3][4], response.data[4][4]);
          relay_client[5].join_relay(response.data[0][0], response.data[3][5], response.data[4][5]);
          relay_client[6].join_relay(response.data[0][0], response.data[3][6], response.data[4][6]);
        } else if ((window as any).LANGUAGES_COUNT===8) {
          relay_client[0].join_relay(response.data[0][0], response.data[3][0], response.data[4][0]);
          relay_client[1].join_relay(response.data[0][0], response.data[3][1], response.data[4][1]);
          relay_client[2].join_relay(response.data[0][0], response.data[3][2], response.data[4][2]);
          relay_client[3].join_relay(response.data[0][0], response.data[3][3], response.data[4][3]);
          relay_client[4].join_relay(response.data[0][0], response.data[3][4], response.data[4][4]);
          relay_client[5].join_relay(response.data[0][0], response.data[3][5], response.data[4][5]);
          relay_client[6].join_relay(response.data[0][0], response.data[3][6], response.data[4][6]);
          relay_client[7].join_relay(response.data[0][0], response.data[3][7], response.data[4][7]);
        } else if ((window as any).LANGUAGES_COUNT===9) {
          relay_client[0].join_relay(response.data[0][0], response.data[3][0], response.data[4][0]);
          relay_client[1].join_relay(response.data[0][0], response.data[3][1], response.data[4][1]);
          relay_client[2].join_relay(response.data[0][0], response.data[3][2], response.data[4][2]);
          relay_client[3].join_relay(response.data[0][0], response.data[3][3], response.data[4][3]);
          relay_client[4].join_relay(response.data[0][0], response.data[3][4], response.data[4][4]);
          relay_client[5].join_relay(response.data[0][0], response.data[3][5], response.data[4][5]);
          relay_client[6].join_relay(response.data[0][0], response.data[3][6], response.data[4][6]);
          relay_client[7].join_relay(response.data[0][0], response.data[3][7], response.data[4][7]);
          relay_client[8].join_relay(response.data[0][0], response.data[3][8], response.data[4][8]);
        } else if ((window as any).LANGUAGES_COUNT===10) {
          relay_client[0].join_relay(response.data[0][0], response.data[3][0], response.data[4][0]);
          relay_client[1].join_relay(response.data[0][0], response.data[3][1], response.data[4][1]);
          relay_client[2].join_relay(response.data[0][0], response.data[3][2], response.data[4][2]);
          relay_client[3].join_relay(response.data[0][0], response.data[3][3], response.data[4][3]);
          relay_client[4].join_relay(response.data[0][0], response.data[3][4], response.data[4][4]);
          relay_client[5].join_relay(response.data[0][0], response.data[3][5], response.data[4][5]);
          relay_client[6].join_relay(response.data[0][0], response.data[3][6], response.data[4][6]);
          relay_client[7].join_relay(response.data[0][0], response.data[3][7], response.data[4][7]);
          relay_client[8].join_relay(response.data[0][0], response.data[3][8], response.data[4][8]);
          relay_client[9].join_relay(response.data[0][0], response.data[3][9], response.data[4][9]);
        } else if ((window as any).LANGUAGES_COUNT===11) {
          relay_client[0].join_relay(response.data[0][0], response.data[3][0], response.data[4][0]);
          relay_client[1].join_relay(response.data[0][0], response.data[3][1], response.data[4][1]);
          relay_client[2].join_relay(response.data[0][0], response.data[3][2], response.data[4][2]);
          relay_client[3].join_relay(response.data[0][0], response.data[3][3], response.data[4][3]);
          relay_client[4].join_relay(response.data[0][0], response.data[3][4], response.data[4][4]);
          relay_client[5].join_relay(response.data[0][0], response.data[3][5], response.data[4][5]);
          relay_client[6].join_relay(response.data[0][0], response.data[3][6], response.data[4][6]);
          relay_client[7].join_relay(response.data[0][0], response.data[3][7], response.data[4][7]);
          relay_client[8].join_relay(response.data[0][0], response.data[3][8], response.data[4][8]);
          relay_client[9].join_relay(response.data[0][0], response.data[3][9], response.data[4][9]);
          relay_client[10].join_relay(response.data[0][0], response.data[3][10], response.data[4][10]);
        } else if ((window as any).LANGUAGES_COUNT===12) {
          relay_client[0].join_relay(response.data[0][0], response.data[3][0], response.data[4][0]);
          relay_client[1].join_relay(response.data[0][0], response.data[3][1], response.data[4][1]);
          relay_client[2].join_relay(response.data[0][0], response.data[3][2], response.data[4][2]);
          relay_client[3].join_relay(response.data[0][0], response.data[3][3], response.data[4][3]);
          relay_client[4].join_relay(response.data[0][0], response.data[3][4], response.data[4][4]);
          relay_client[5].join_relay(response.data[0][0], response.data[3][5], response.data[4][5]);
          relay_client[6].join_relay(response.data[0][0], response.data[3][6], response.data[4][6]);
          relay_client[7].join_relay(response.data[0][0], response.data[3][7], response.data[4][7]);
          relay_client[8].join_relay(response.data[0][0], response.data[3][8], response.data[4][8]);
          relay_client[9].join_relay(response.data[0][0], response.data[3][9], response.data[4][9]);
          relay_client[10].join_relay(response.data[0][0], response.data[3][10], response.data[4][10]);
          relay_client[11].join_relay(response.data[0][0], response.data[3][11], response.data[4][11]);
        } else if ((window as any).LANGUAGES_COUNT===13) {
          relay_client[0].join_relay(response.data[0][0], response.data[3][0], response.data[4][0]);
          relay_client[1].join_relay(response.data[0][0], response.data[3][1], response.data[4][1]);
          relay_client[2].join_relay(response.data[0][0], response.data[3][2], response.data[4][2]);
          relay_client[3].join_relay(response.data[0][0], response.data[3][3], response.data[4][3]);
          relay_client[4].join_relay(response.data[0][0], response.data[3][4], response.data[4][4]);
          relay_client[5].join_relay(response.data[0][0], response.data[3][5], response.data[4][5]);
          relay_client[6].join_relay(response.data[0][0], response.data[3][6], response.data[4][6]);
          relay_client[7].join_relay(response.data[0][0], response.data[3][7], response.data[4][7]);
          relay_client[8].join_relay(response.data[0][0], response.data[3][8], response.data[4][8]);
          relay_client[9].join_relay(response.data[0][0], response.data[3][9], response.data[4][9]);
          relay_client[10].join_relay(response.data[0][0], response.data[3][10], response.data[4][10]);
          relay_client[11].join_relay(response.data[0][0], response.data[3][11], response.data[4][11]);
          relay_client[12].join_relay(response.data[0][0], response.data[3][12], response.data[4][12]);
        } else if ((window as any).LANGUAGES_COUNT===14) {
          relay_client[0].join_relay(response.data[0][0], response.data[3][0], response.data[4][0]);
          relay_client[1].join_relay(response.data[0][0], response.data[3][1], response.data[4][1]);
          relay_client[2].join_relay(response.data[0][0], response.data[3][2], response.data[4][2]);
          relay_client[3].join_relay(response.data[0][0], response.data[3][3], response.data[4][3]);
          relay_client[4].join_relay(response.data[0][0], response.data[3][4], response.data[4][4]);
          relay_client[5].join_relay(response.data[0][0], response.data[3][5], response.data[4][5]);
          relay_client[6].join_relay(response.data[0][0], response.data[3][6], response.data[4][6]);
          relay_client[7].join_relay(response.data[0][0], response.data[3][7], response.data[4][7]);
          relay_client[8].join_relay(response.data[0][0], response.data[3][8], response.data[4][8]);
          relay_client[9].join_relay(response.data[0][0], response.data[3][9], response.data[4][9]);
          relay_client[10].join_relay(response.data[0][0], response.data[3][10], response.data[4][10]);
          relay_client[11].join_relay(response.data[0][0], response.data[3][11], response.data[4][11]);
          relay_client[12].join_relay(response.data[0][0], response.data[3][12], response.data[4][12]);
          relay_client[13].join_relay(response.data[0][0], response.data[3][13], response.data[4][13]);
        } else if ((window as any).LANGUAGES_COUNT===15) {
          relay_client[0].join_relay(response.data[0][0], response.data[3][0], response.data[4][0]);
          relay_client[1].join_relay(response.data[0][0], response.data[3][1], response.data[4][1]);
          relay_client[2].join_relay(response.data[0][0], response.data[3][2], response.data[4][2]);
          relay_client[3].join_relay(response.data[0][0], response.data[3][3], response.data[4][3]);
          relay_client[4].join_relay(response.data[0][0], response.data[3][4], response.data[4][4]);
          relay_client[5].join_relay(response.data[0][0], response.data[3][5], response.data[4][5]);
          relay_client[6].join_relay(response.data[0][0], response.data[3][6], response.data[4][6]);
          relay_client[7].join_relay(response.data[0][0], response.data[3][7], response.data[4][7]);
          relay_client[8].join_relay(response.data[0][0], response.data[3][8], response.data[4][8]);
          relay_client[9].join_relay(response.data[0][0], response.data[3][9], response.data[4][9]);
          relay_client[10].join_relay(response.data[0][0], response.data[3][10], response.data[4][10]);
          relay_client[11].join_relay(response.data[0][0], response.data[3][11], response.data[4][11]);
          relay_client[12].join_relay(response.data[0][0], response.data[3][12], response.data[4][12]);
          relay_client[13].join_relay(response.data[0][0], response.data[3][13], response.data[4][13]);
          relay_client[14].join_relay(response.data[0][0], response.data[3][14], response.data[4][14]);
        }
        
        relay_client_host_edu_live.join_speaker(response.data[0][0], response.data[5][0], response.data[5][1]);
        relay_client_teacher_edu_live.join_relay(response.data[0][0], response.data[3][0], response.data[4][0]);

        //pre-load
        /*const canvas:HTMLCanvasElement = document.getElementById('canvas_video') as HTMLCanvasElement;
        let videoToCapture:any = document?.getElementById('react_player_id')?.childNodes[0];
        (window as any).videoToCapture = videoToCapture;
        (window as any).canvasToCapture = canvas;*/
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
  }, [showSecondScreen])

  // initial target state changes
  useEffect(()=> {
    setTargetChannelFunc(channel);
  }, [channel])

  //terminate conference from the browser - get response ?uuid_=
  const terminateTheConference = () => {
    axios.get(SERVER_NAME+'disable_conference?uuid_='+TokenGet+'&c_active=f'+'&secret_=Y3OVskTNjw')
    .then(function (response) {
        console.log('CONFERENCE HAS BEEN TERMINATED');
        setTerminateConference(true);
        setApplicationTerminate(true);
    }
  )}

  // exit student room
  useEffect (() => {
    console.log('___________EXIT STUDENT ROOM_________');
    console.table({'(window as any).STUDENT_ROOM':(window as any).STUDENT_ROOM, 'StudentChannel':StudentChannel});
    if ((window as any).STUDENT_ROOM!==StudentChannel) {
      target_rtc_student.leave(setExitStudentChannelFunc);
    }
  }, [StudentChannel])
  
  // change student room
  useEffect (() =>
    {(async () => {
      console.log('___________CHANGE STUDENT ROOM_________');
      console.table({
      '(window as any).STUDENT_ROOM':(window as any).STUDENT_ROOM, 
      'relayChannel':relayChannel,
      'exitStudentChannel': exitStudentChannel,
      'StreamStartOne': StreamStartOne});

      if ((window as any).STUDENT_ROOM!==StudentChannel && exitStudentChannel===true && roomData.length!==0) {

        await target_rtc_student.join_target(roomData[0][0],roomData[1][relayChannel], setExitStudentChannelFunc, roomData[2][relayChannel]);
        console.log('joined channel');

        (window as any).prev_student_room=roomData[1][(window as any).STUDENT_ROOM];
        (window as any).STUDENT_ROOM=StudentChannel;
        //if stream is on - unpublish and publish
        if (StreamStartOne) {
          await target_rtc_student.TARGET_VOLUME_DOWN(setStreamStartOneFunc);
          await target_rtc_student.TARGET_VOLUME_UP(setStreamStartOneFunc);
         }
      }
    })()
  }, [exitStudentChannel])

  //delay the mic button
  useEffect(() => {
    if (showSecondScreen) {
      setTimeout(function () {
          micButtonDelayFunc(true);
      }, 4000);
    }
  }, [showSecondScreen])

  //dispatch recording 
  const record_mic_and_all = async() => {
    if (!DispatchRecording && !secretName) {
      try {
        console.log('-------------------');
        console.log('RECORDING HAS EDNED');
        console.log('-------------------');
        (window as any).mediaRecorderMAIN.stop();
        const blob = await recorder.stopRecording();
        //wait for some more time to get the blob
        setTimeout(() => {
          try {
            console.log('_____________USER AUDIO BLOB________________');
            console.log(blob);
            console.log('_____________MAIN AUDIO BLOB________________');
            console.log((window as any).blobMainVideo);
            //send user audio
            let file_USER:any, file_VIDEO:any;
            fetch(`https://rsi.exchange/wp-content/uploads/upload.php?u_name=${nickName}&c_name=${roomData[5][2]}`, {method:"POST", body:blob})
            .then(response => response.text()) // read the response stream as JSON
            .then(data => {
              console.log('__________data from USER BLOB____________');
              console.log(data);
              file_USER=data;
              return fetch(`https://rsi.exchange/wp-content/uploads/upload.php?u_name=MAIN_VIDEO&c_name=${roomData[5][2]}`, {method:"POST", body:(window as any).blobMainVideo})
            })
            .then(response => response.text()) // read the response stream as JSON
            .then(data => {
              console.log('__________data from MAIN BLOB__________');
              console.log(data);
              file_VIDEO=data;
              return fetch(`https://rsi.exchange/wp-content/uploads/ffmpeg_mixing.php?file_VIDEO=${file_VIDEO}&file_USER=${file_USER}`, {method:"POST", body:''})
            })
            .then(response => console.log('2 AND FFMPEG ARE DISPATCHED'))
            setRecordings(Recordings => Recordings.concat(URL.createObjectURL(blob)));
          } catch(e) {
            console.log('____error while sending blobs to server_____'+e);
          }
        }, 1500)
      } catch(e) {
        console.log('error while stopping record')
        console.log(e)
      }
    } else if (DispatchRecording && !secretName) {
      try {
        console.log('-------------------')
        console.log('RECORDING HAS STARTED')
        console.log('-------------------')
        await recorder.initAudio();
        await recorder.initWorker();
        recorder.startRecording();

        //start recording MAIN AUDIO
        speaker_client.remoteUsers.map((user) => {
          //@ts-ignore
          const newStream = new MediaStream([user.audioTrack._mediaStreamTrack]);
          let mediaRecorderMAIN =  new MediaRecorder(newStream);
          (window as any).chunks = [];
          mediaRecorderMAIN.ondataavailable = function(e) {
            (window as any).chunks.push(e.data);
          }

          mediaRecorderMAIN.start();
          mediaRecorderMAIN.addEventListener('stop', function(event) { 
            console.log("recorder stopped");
            (window as any).blobMainVideo = new Blob((window as any).chunks, { 'type' : 'audio/mpeg' });
            (window as any).chunks = [];
          });

          //@ts-ignore
          (window as any).mediaRecorderMAIN = '';
          (window as any).mediaRecorderMAIN = mediaRecorderMAIN;
        })
      } catch (e) {
        console.log(e);
      }
  }
}

  //**********************************************************/
  //choose room when clicking button (for students)
  //**********************************************************/
  useEffect(() => {
      (async () => {
      if (roomData.length!==0) {
        //stop streaming and unpublish stream
        setCurrentStreamerFunc('');
        await target_client.TARGET_VOLUME_DOWN(setStreamStartFunc);
        //exit chat room
        await leave(VOID_FUNC);
        (window as any).TARGET_ROOM = switch_channel_value;
        // join new chat room
        await join(
          roomData[0][0], 
          roomData[1][switch_channel_value], 
          setChatRoomEnteredFunc, 
          roomData[2][switch_channel_value],
          '',
          nickName, 
          showUserVideo);
        //new channel
        setChannel(channel => switch_channel_value);
        //exit current target
        await target_client.leave(setExitTargetChannelFunc);
        //target room - enter new target room
        await target_client.join_target(roomData[0][0], roomData[3][switch_channel_value], setExitTargetChannelFunc, roomData[4][switch_channel_value]);
        //new target channel
        setTargetChannelFunc(switch_channel_value);
      }
    })()
  }, [switch_channel_value])

  /* * * *
  * From web-camera
  * * */
  const startWebCamera = async () => {
    if (SourceActive) {
      await client_host_edu.unpublish();
      setSourceActive(false);
      setVideoStart(false);
      setSourceType('');
    } else {
      try {
       await client_host_edu.join(roomData[0][0],roomData[5][0],roomData[5][1]);
      } catch(e){console.log(e)}
      const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks({encoderConfig:"high_quality"});
      await client_host_edu.publish([microphoneTrack, cameraTrack]);
      setSourceActive(true);
      setVideoStart(true);
      setSourceType('web');
    }
    return
  }

  /* * * *
  * From screen
  * * */
  const startScreenSharing = async () => {
    if (SourceActive) {
      try {
        (window as any).LOCAL_SCREEN_TRACK.stop();
      } catch(e){console.log(e)}
      await client_host_edu.unpublish();
      setSourceActive(false);
      setVideoStart(false);
      setSourceType('');
    } else {
      let localVideoTrack, localAudioTrack;
      try {
        await client_host_edu.join(roomData[0][0],roomData[5][0],roomData[5][1]);
        [localVideoTrack, localAudioTrack] = await AgoraRTC.createScreenVideoTrack({encoderConfig: "720p_2"}, "enable");
        (window as any).LOCAL_SCREEN_TRACK = localAudioTrack;
      } catch(e) {
          localVideoTrack=null;
          localAudioTrack=null;
      }
		
      if (localVideoTrack==null && localAudioTrack==null) {
        [localVideoTrack, localAudioTrack] = await AgoraRTC.createScreenVideoTrack({encoderConfig: "720p_2"}, "enable");
      }

      const asnwer2 = await client_host_edu.publish(localVideoTrack!);
      if (localAudioTrack) {
        const asnwer3 = await client_host_edu.publish(localAudioTrack);
      }
      setSourceActive(true);
      setVideoStart(true);
      setSourceType('screen');
    }
    return
  }

  //current date function
  const getCurrentFormattedDay = ()=> {
    var today:any = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    return dd+ '-' + mm + '-' + yyyy;
  }

  //fetch files while starting
  useEffect(() => {
      try {
        let currentFolderName:string = '';
        //change current files path
        const currentDay:string = getCurrentFormattedDay();
        setCurrentLinkString(`https://rsi.exchange/wp-content/uploads/${currentDay}/`);
        currentFolderName = currentDay;
        //fetch names of files
        fetch(`https://rsi.exchange/wp-content/uploads/get_files_list.php?folder_path=${currentFolderName}`)
        .then((response) => {
          return response.json();
        }).then((data) => {
          console.log(data);
          const mapped = Object.entries(data).map(([k,v]) => `${v}`);
          const filteredArray=mapped.filter(el=>{
          if (el.split('.')[0].length!==0 && (el.split('.')[1]=='mp4' || el.split('.')[1]=='mp3' || el.split('.')[1]=='wav')) {
              return el;
          }})
          setFilesArray(filteredArray);
        });
    } catch(e) {
      console.log(e);
    }
  },[ActiveFilesFolder])

  //check for super-user
  useEffect(() => {
    if (nickName==='teachersl') {
      setSecretName(true);
      setnickName('Teacher');
    } else if (nickName==='supportsl') {
      setSecretNameSupport(true);
      setSecretName(true);
      setnickName('Support');
    }
  }, [showSecondScreen]);

  //closing tab on event
  useEffect(() => {
    if (ApplicationTerminate===true) {
      //leave from every client
      client?.leave();
      client_host?.leave();
      client_host_edu?.leave();
      client_rtc_student?.leave();
      client_host_edu_live?.leave();
      client_teacher_edu_live?.leave();
      client_relay[0]?.leave();
      client_relay[1]?.leave();
      client_relay[2]?.leave();
      client_relay[3]?.leave();
      client_relay[4]?.leave();
      client_relay[5]?.leave();
      client_relay[6]?.leave();
      client_relay[7]?.leave();
      client_relay[8]?.leave();
      client_relay[9]?.leave();
      client_relay[10]?.leave();
      client_relay[11]?.leave();
      client_relay[12]?.leave();
      client_relay[13]?.leave();
      client_relay[14]?.leave();
      client_relay[15]?.leave();
      client_target?.leave();
      document.getElementsByTagName('BODY')[0].innerHTML = '<div style="display:flex; height:80vh; justify-content:center; align-items:center;"><h1 style="color: red; margin: auto; position:absolute;">CONFERENCE IS CLOSED</h1></div>';
      //erase db row
      setExitByDemand(true);
    }
  }, [ApplicationTerminate]);

  //start isRecordingEvent
  useEffect(() => {
    record_mic_and_all()
  }, [DispatchRecording]);
  
  // choose file and fill it with color
  // change src object of the src tag
  const chooseFileFromList = async (e:any) => {
    setVideoStartProccess(true);
    setVideoStart(false);
    setCurrentPlayFileName(e.target.innerHTML);

    let folderName='';
    if (ActiveFilesFolder==='Videos') {
      folderName = '2021';
    } else {
      folderName = getCurrentFormattedDay();
    }
    //@ts-ignore
    document.getElementById('react_player_id').childNodes[0].src=`https://rsi.exchange/wp-content/uploads/${folderName}/${e.target.innerHTML}`;
    await client_host_edu.leave();
    setVideoStartProccess(false);

    (window as any).videoToCapture.addEventListener('loadedmetadata', function() {
      (window as any).canvasToCapture.width = (window as any).videoToCapture.videoWidth;
      (window as any).canvasToCapture.height = (window as any).videoToCapture.videoHeight;
      (window as any).canvasToCapture.style.width="150px";
      (window as any).canvasToCapture.style.height="auto";
    });

  }
  //-----------------------------------------------
  //------------find user name by id---------------
  //-----------------------------------------------
  const findUserNameById = (array:any, id_user:any) => {
    const name = array.find((el:any) => el.user_id==id_user)
    try {
      return name['user_name'];
    } catch(e) {
      return 'Connecting..'
    }
  }
  
if (roomData.length!==0 && !showSecondScreen)
  return (
    <MainContextProvider value={appData}>
     <PreCall 
     roomData={roomData}
     setChannelFunc={setChannel}
     currentChannel={channel}
     TokenGet={TokenGet}
     display={showSecondScreen}
     setHide={hideScreen}
     systemReq={systemRequerments}
     setnickName={setnickName}
     nickName={nickName}
     langMode={langCountMode_precall}
     />
    </MainContextProvider>
)

if (showSecondScreen) return (
  <MainContextProvider value={{
    startWebCamera, 
    startScreenSharing, 
    SourceType,
    setCurrentStreamerFunc,
    setStreamStartFunc,
    target_client,
    streamStart,
    secretName,
    client,
    target_rtc_student,
    StreamStartOne,
    roomData,
    relayChannel,
    setExitStudentChannelFunc,
    setStreamStartOneFunc,
    muteSelf,
    muteTargetFunc,
    muteTarget,
    SetMainVolume,
    mainVolume,
    DispatchRecording,
    setDispatchRecording,
    micButtonDelay,
    SetStudentVolume,
    StudentVolume,
    terminateTheConference
    }}>

    {/* INVISIBLE TAGS - AUDIO PLAYERS */}
    <div style={{"visibility":"hidden"}}>
        {/* ---------------Students are always playing Teacher (for all)--------------- */}
        {channel!==0 && !secretName ?
        relay_client_teacher_edu_live?.remoteUsers?.map((user:any) => 
        <>
        {/*
        @ts-ignore*/}
        <MediaPlayer
        key={userVideoKey+102}
        volume={StudentVolume}
        setvolumeLevel={SetStudentVolume}
        videoTrack={undefined}
        audioTrack={user.audioTrack}
        client_web={'auido'}>
        </MediaPlayer>
        </>
        )
        :
        <></>
        }
        {/* ---------Teacher is playing student (only the chosen one)--------- */}
        {/* ---------Student is playing other student (only the chosen one)--------- */}
        {secretName || (!secretName) ? relay_client[relayChannel]?.remoteUsers?.map((user: { audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined; }) =>
        <MediaPlayer 
        //@ts-ignore
        key={user?.uid+103}
        volume={mainVolume}
        videoTrack={undefined}
        //@ts-ignore
        audioTrack={user?.uid!==client_rtc_student?.uid ? user?.audioTrack :undefined} 
        client_web={'main'}/>
        )
        :
        <></>
        }
    </div>

    <Container fluid>
      <Row className={`justify-content-md-center ${css.height_100} ${css.margin_0}`}>
        <Col xs="2" sm="2" md="2" lg="2" xl="2" style={{"padding":"0"}}>
        <Tabs defaultActiveKey="chat" id="uncontrolled-tab-example">
          <Tab eventKey="chat" title="Chat">
            <Chat_box 
                partnerIDs={partnerIDs}
                setPartnerIDs={setPartnerIDsFunc}
                chatRoom={roomData[1][channel]}
                targetChannel={roomData[1][targetChannel]}
                nickName={nickName}
                clientID={client.uid}
                streamStart={streamStart}
                setStreamStartFunc={setStreamStartFunc}
                showMain={chatRoomEntered}
                setStreamer={setCurrentStreamerFunc}
                currentStreamer={currentStreamer}
                setActiveRelaysFunc={setActiveRelaysFunc}
                activeRelays={activeRelays}
                showChat={showChat}
                setBusyCabinsArray={setBusyCabinsArray}
                setApplicationTerminate={setApplicationTerminate}
                DispatchRecording={DispatchRecording}
                setDispatchRecording={setDispatchRecording}
                ExitByDemand={ExitByDemand}
                secretName={secretName}
                TerminateConference={TerminateConference}
              />
          </Tab>
          <Tab eventKey="students" title="Users" style={{"minHeight":"300px", "padding":"10px"}}>
            <div style={{"color":"white", "display":"flex"}}>
              <div>{nickName}</div>
              {/* SELF-MUTE */}
              <a href={void 0} onClick={(e) => {
                muteSelf(e, client.uid, "CHAT", setmuteSelfBoolean, !muteSelfBoolean, setRelayKeyFunc, relayKey)}} 
                id="self_mute">
                <div style={{"position":"initial"}} className={!muteSelfBoolean ? css.client_mike : css.client_mike_off}></div>
              </a>
            </div>
            {remoteUsers.map(user => (
              <div style={{"color":"white", "display":"flex"}}>
                <div>{findUserNameById(partnerIDs, user.uid)}</div>
                <a style={{"position":"relative"}} href={void 0} onClick={(e) => {
                    if (muteRemoteUsers.includes(user.uid)) {
                      {/* Delete user from muted*/}
                      const newMutedUsersArray = muteRemoteUsers.filter(item => item !== user.uid);
                      setmuteRemoteUsers(newMutedUsersArray);
                    } else {
                      {/* Add user to muted*/}
                      setmuteRemoteUsers(muteRemoteUsers => [...muteRemoteUsers, user.uid]);
                    }
                    muteRemoteUser(e, user.uid);
                    }
                    }>
                  <div 
                  style={{"position":"initial"}}
                  className={
                    muteRemoteUsers.includes(user.uid) ?
                    css.icon_volume_off
                    :
                    css.icon_volume
                    }>
                  </div>
                </a>
              </div>
            ))}
          </Tab>
          <Tab eventKey="files" title="Files" disabled>
            <div className={css.file_choose}>
                  <ul className={css.list_style}>
                    <div style={{"display":"flex", "justifyContent":"center"}}>
                      <div 
                      className={css.folder_button}
                      onClick={(e)=> {
                        setActiveFilesFolder('Students');
                      }}>Students</div>
                    </div>
                    {filesArray.map((el:any) => {
                      return <li 
                      className={                  
                        currentPlayFileName===el
                        ?
                        `
                        ${css.active_li}
                        `
                        :
                        ``}
                      onClick={chooseFileFromList}>
                        {el}
                      </li>
                    })}
                  </ul>
              </div>
          </Tab>
        </Tabs>
              <div style={{"display":"flex", "flexDirection":"column", "alignItems":"center"}}>
              <h4 style={{"color":"white","fontWeight":"bold"}}>Teacher</h4>
              <div className={css.partners_webs} style={{"height":"150px"}}>
              {secretName ?
                //@ts-ignore
                <div className={css.partner} key={client._clientId}>
                  <div className={css.name}>{nickName}</div>
                    {/* USER HIMSELF*/}
                    <MediaPlayer key={userVideoKey} volume={'default'} videoTrack={showUserVideo ? localVideoTrack: undefined} audioTrack={undefined} client_web={'partner'}></MediaPlayer>
                    {/* Two functions for handling click - mute audio stream and toggle icon */} 
                    {/* SELF-MUTE */}
                    <a href={void 0} onClick={(e) => {
                      muteSelf(e, client.uid, "CHAT", setmuteSelfBoolean, !muteSelfBoolean, setRelayKeyFunc, relayKey)}} 
                      id="self_mute">
                      <div className={!muteSelfBoolean ? css.client_mike : css.client_mike_off}></div>
                    </a>
                  </div>
                  :
                  <>
                    {/* @ts-ignore */}
                    {remoteUsers.map(user =>
                      findUserNameById(partnerIDs, user.uid)==="Teacher" ? 
                      /* Teacher is in the room */
                      <div className={css.partner} key={user.uid}>
                      <div className={
                        user.uid===currentStreamer ?
                        `
                        ${css.name_partner_red}
                        ${css.name_partner}
                        `
                        :
                        `
                        ${css.name_partner}
                        `
                        }>
                        {findUserNameById(partnerIDs, user.uid)}
                        {user.uid===currentStreamer ? " MIC" : ""}
                      </div>
    
                      <a href={void 0} onClick={(e) => {
                        if (muteRemoteUsers.includes(user.uid)) {
                          {/* Delete user from muted*/}
                          const newMutedUsersArray = muteRemoteUsers.filter(item => item !== user.uid);
                          setmuteRemoteUsers(newMutedUsersArray);
                        } else {
                          {/* Add user to muted*/}
                          setmuteRemoteUsers(muteRemoteUsers => [...muteRemoteUsers, user.uid]);
                        }
                        muteRemoteUser(e, user.uid);
                        }
                        }>
                      <div className={
                          muteRemoteUsers.includes(user.uid) ?
                          css.icon_volume_off
                          :
                          css.icon_volume
                          }></div>
                      </a>
                      {/*
                        @ts-ignore*/}
                      <MediaPlayer
                        key={userVideoKey+100}
                        volume={'default'}
                        videoTrack={channel===0 ? user.videoTrack : undefined}
                        audioTrack={user.audioTrack}
                        client_web={'partner'}>
                      </MediaPlayer>
                    </div>
                      :
                      void 0
                    )}
                  </>
                }
              </div>
            </div>
        </Col>
        <Col xs="10" sm="10" md="10" lg="10" xl="10">
          <Row className={`justify-content-md-center ${css.height_85} ${css.margin_0}`}>
            <Col xs="12" sm="12" md="12" lg="12" xl="12" className={css.central_panel}>
            <div style={{"position":"absolute","right":"10px","top":"30px", "zIndex":99999}}>
              {channel===0 && secretName ?
                    <Languages_choice
                    //changing relay
                    setChannelFunc={setRelayChannelFunc}
                    currentLangChannel={relayChannel}
                    PrevLangChannel={PrevRelayChannel}
                    setPrevLangChannel={setPrevRelayChannelFunc}
                    //changing target
                    setChannelFuncStudent={setStudentChannelFunc}
                    currentLangChannelStudent={StudentChannel}
                    setId={"langChoice_RELAY"}
                    number={1}
                    roomData={roomData}
                    activeRelays={activeRelays}
                    osciloScopeStream={relayChannelStream}
                    relayKey={langCountMode_relay}
                    roomChannel={channel}
                    secretName={secretName}
                    BusyCabinsArray={BusyCabinsArray}
                    setTeacherButton={setTeacherButton}
                    ButtonPushed={TeacherButton}
                  />
                  :
                  <></>
                  ||
                  channel===0 && !secretName ?
                  <Cabin_choice 
                    //@ts-ignore
                    key={'cabschoice0'+Math.random(1)}
                    switch_channel={switch_channel}
                    channel={channel}
                    BusyCabinsArray={BusyCabinsArray}
                  />
                  :
                  <></>
                  }
              </div>
            {/* HEADER-NAME AND Terminate buton */}
            <div className={css.header_line}>
              {/* Header - room name */}
              <Header Room={roomData.length!==0 ? roomData[5][2]+' ('+arrayNames[channel]+')' : 'Conference'+' ('+arrayNames[channel]+')'}/>
            </div>

            {/* LEFT PANEL - STUDENTS FILES OR LISTEN TO*/}
            <div className={css.left_panel}>
              {secretName && channel===0 ? 
              void 0
              :
              <>
                {/* Relay for students */}
                <Languages_choice
                  //changing relay
                  setChannelFunc={setRelayChannelFunc}
                  currentLangChannel={relayChannel}
                  PrevLangChannel={PrevRelayChannel}
                  setPrevLangChannel={setPrevRelayChannelFunc}
                  //changing target
                  setChannelFuncStudent={returnVoid}
                  currentLangChannelStudent={500}
                  setId={"langChoice_RELAY"}
                  number={1}
                  roomData={roomData}
                  activeRelays={activeRelays}
                  osciloScopeStream={relayChannelStream}
                  relayKey={langCountMode_relay}
                  roomChannel={channel}
                  secretName={secretName}
                  BusyCabinsArray={BusyCabinsArray}
                  setTeacherButton={setTeacherButton}
                  ButtonPushed={TeacherButton}
                /> 
              </>
              }
            </div>
            {/* VIDEO SCREEN*/}
            {secretName ?
                speaker_client.remoteUsers.map((user) =>
                  //@ts-ignore
                  <MediaPlayerMain 
                  volume={mainVolumeSecond}
                  videoTrack={showVideo ? user.videoTrack: undefined}
                  setShowVideo={setShowVideo}
                  showVideo={showVideo}
                  audioTrack={undefined}
                  client_web={'main'}
                  setvolumeLevel={SetMainVolumeSecond}
                  conf_image={(window as any).CONF_IMAGE}
                  conf_name={(window as any).CONF_NAME}
                  key={user.uid}>
                  </MediaPlayerMain>
                )
                :
                speaker_client.remoteUsers.map((user) =>
                  //@ts-ignore
                  <MediaPlayerMain 
                  volume={mainVolumeSecond}
                  videoTrack={showVideo ? user.videoTrack: undefined}
                  setShowVideo={setShowVideo}
                  showVideo={showVideo}
                  audioTrack={user.audioTrack}
                  client_web={'main'}
                  setvolumeLevel={SetMainVolumeSecond}
                  conf_image={(window as any).CONF_IMAGE}
                  conf_name={(window as any).CONF_NAME}
                  key={user.uid}>
                  </MediaPlayerMain>
                )
              }
              {/* Bottom video control panel */}
              {(channel!==0 && !secretName) || secretName ?
              <div className={css.captions_buttons}>
              <div style={{"display":"flex"}}>
                {secretName ?
                  <div style={{"display":"flex", "border":"1px solid #fff", "borderRight":"0", "flexDirection":"column"}}>
                  {secretName ?<div style={{"borderBottom": "1px solid #fff", "textAlign":"center", "color":"#fff", "fontWeight":"bold"}}>VOLUME</div> : void 0}
                    <div style={{"margin":"10px"}}><Volume_host/></div>
                  </div>
                  :
                  <></>
                }

                {secretName ?
                <div style={{"display":"flex", "border":"1px solid #fff", "borderRight":"0", "flexDirection":"column"}}> 
                 <div style={{"borderBottom": "1px solid #fff", "textAlign":"center", "color":"#fff", "fontWeight":"bold"}}>REC</div> 
                {/* RECORD AUDIO BUTTON */}
                {secretName && videoStart ?
                  <div style={{"margin":"10px"}}><Button_record/></div>
                  :
                  <></>
                  }
                </div>
                :
                <></>
                }

                <div style={{"display":"flex", "border":"1px solid #fff", "flexDirection":"column"}}>
                {secretName ?<div style={{"borderBottom": "1px solid #fff", "textAlign":"center", "color":"#fff", "fontWeight":"bold"}}>SHARE</div> : void 0}
                  <div  style={{"display":"flex"}}>
                  {/* PLAY WEB-CAMERA BUTTON */}
                  {secretName 
                  ? <div style={{"margin":"10px"}}><Button_camera/></div>
                  : <></>
                  }
                  
                  {/* Screen sharing */}
                  {secretName ?
                    <div style={{"margin":"10px"}}><Button_screen/></div>
                  :
                  <></>
                  }
                  </div>
                </div>
                <div style={{"display":"flex", "border":"1px solid #fff","borderLeft":"0", "flexDirection":"column"}}>
                  <div style={{"borderBottom": "1px solid #fff", "textAlign":"center", "color":"#fff", "fontWeight":"bold"}}>MIC</div>
                  <div  style={{"display":"flex"}}>
                  {/* MIC BUTTON */}
                  {secretName || channel!==0 ?
                    <div style={{"margin":"10px"}}><Button_mic_all/></div>
                  :
                  <></>
                  }

                  {/* MIC BUTTON TO STUDENT */}
                  {secretName ?
                    <div style={{"margin":"10px"}}><Button_mic_to_student/></div>
                  :
                  <></>
                  }

                  {/* MIC MUTE BUTTON */}
                  {secretName  || channel!==0 ?
                    <div style={{"margin":"10px"}}><Button_mic_mute/></div>
                  :
                  <></>
                  }
                  {/* VOLUME STUDENT */}
                  {!secretName && channel!==0 ?
                  <div style={{"margin":"5px"}}><Volume_student/></div>
                    :
                  <></>
                  }
                  </div>
                </div>
                <div style={{"display":"flex", "border":"1px solid #fff","borderLeft":"0", "flexDirection":"column"}}>
                  {secretName ? <div style={{"borderBottom": "1px solid #fff", "textAlign":"center", "color":"#fff", "fontWeight":"bold"}}>Conference</div> : void 0}
                {/* Terminate the conference */}
                {secretName? 
                  <div style={{"margin":"10px"}}><Button_terminate/></div>
                  :
                  <></>
                }
                </div>
              </div>
            </div>
            :
            <></>
            }
            </Col>
          </Row>
          <Row className={`justify-content-md-center ${css.height_15}`}>
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
            <div className={`overflow-auto ${css.partners_webs}`}>
                {!secretName ?
                //@ts-ignore
                <div className={css.partner} key={client._clientId}>
                  <div className={css.name}>{nickName}</div>
                    {/* USER HIMSELF*/}
                    <MediaPlayer key={userVideoKey} volume={'default'} videoTrack={showUserVideo ? localVideoTrack: undefined} audioTrack={undefined} client_web={'partner'}></MediaPlayer>
                    {/* Two functions for handling click - mute audio stream and toggle icon */} 
                    {/* SELF-MUTE */}
                    <a href={void 0} onClick={(e) => {
                      muteSelf(e, client.uid, "CHAT", setmuteSelfBoolean, !muteSelfBoolean, setRelayKeyFunc, relayKey)}} 
                      id="self_mute">
                      <div className={!muteSelfBoolean ? css.client_mike : css.client_mike_off}></div>
                    </a>
                  </div>
                  :
                  <></>
                  }

                {/* REMOTE STUDENTS WINDOWS */}
                {remoteUsers.map((user,indx) =>
                  findUserNameById(partnerIDs, user.uid)!=="Teacher" ?
                  <div className={css.partner} key={user.uid}>
                  <div className={
                    user.uid===currentStreamer ?
                    `
                    ${css.name_partner_red}
                    ${css.name_partner}
                    `
                    :
                    `
                    ${css.name_partner}
                    `
                    }>
                    {findUserNameById(partnerIDs, user.uid)}
                    {user.uid===currentStreamer ? " MIC" : ""}
                  </div>

                  <a href={void 0} onClick={(e) => {
                    if (muteRemoteUsers.includes(user.uid)) {
                      {/* Delete user from muted*/}
                      const newMutedUsersArray = muteRemoteUsers.filter(item => item !== user.uid);
                      setmuteRemoteUsers(newMutedUsersArray);
                    } else {
                      {/* Add user to muted*/}
                      setmuteRemoteUsers(muteRemoteUsers => [...muteRemoteUsers, user.uid]);
                    }
                    muteRemoteUser(e, user.uid);
                    }
                    }>
                  <div className={
                      muteRemoteUsers.includes(user.uid) ?
                      css.icon_volume_off
                      :
                      css.icon_volume
                      }></div>
                  </a>
                  {/*
                    @ts-ignore*/}
                  <MediaPlayer
                    key={userVideoKey+100}
                    volume={'default'}
                    videoTrack={channel===0 ? user.videoTrack : undefined}
                    audioTrack={user.audioTrack}
                    client_web={'partner'}>
                  </MediaPlayer>
                </div>
                :
                <></>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
    </MainContextProvider>
  );
  return (<>Loading..</>)
}

export default App;