import { useState, useEffect } from 'react';
import AgoraRTC, {
  IAgoraRTCClient, IAgoraRTCRemoteUser, MicrophoneAudioTrackInitConfig, CameraVideoTrackInitConfig, IMicrophoneAudioTrack, ICameraVideoTrack, ILocalVideoTrack, ILocalAudioTrack } from 'agora-rtc-sdk-ng';


export default function useAgora(client: IAgoraRTCClient | undefined, roomType:string, RoomNumber: number)
  :
   {
      localAudioTrack: ILocalAudioTrack | undefined,
      localVideoTrack: ILocalVideoTrack | undefined,
      joinState: boolean,
      leave: Function,
      join: Function,
      join_speaker: Function,
      join_relay: Function,
      join_target: Function,
      TARGET_VOLUME_UP: Function,
      TARGET_VOLUME_DOWN: Function,
      CHANGE_VOLUME_LEVEL:Function,
      STUDENT_VOLUME_UP: Function,
      STUDENT_VOLUME_DOWN:Function,
      startStreamFunc: Function,
      muteSelf: Function,
      turnOffVideo:Function,
      muteEntering: Function,
      muteRemoteUser: Function,
      muteEveryone: Function,
      UnmuteEveryone: Function,
      remoteUsers: IAgoraRTCRemoteUser[],
    }
  {

  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | undefined>(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack | undefined>(undefined);

  const [joinState, setJoinState] = useState(false);

  const [startStream, setStartStream] = useState(false);

  const [muteRemoteUsers, setmuteRemoteUsers] = useState<Array<string | Number>>([]);

  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  if (!(window as any)?.TRACK_RELAY_INPUT) {
    (window as any).TRACK_RELAY_INPUT=[];
  }
  
  // CREATE LOCAL TRACKS FROM WEB-CAMERA
  async function createLocalTracks(audioConfig?: MicrophoneAudioTrackInitConfig, videoConfig?: CameraVideoTrackInitConfig)
  : Promise<[IMicrophoneAudioTrack, ICameraVideoTrack]> {
    const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(audioConfig, videoConfig);
    setLocalAudioTrack(microphoneTrack);
    setLocalVideoTrack(cameraTrack);
    return [microphoneTrack, cameraTrack];
  }

  // JOIN CHAT ROOM
  async function join(
    appid: string, 
    channel: string, 
    setChatRoomEntered: Function, 
    token?: string, 
    uid?: string | number | null, 
    nickName?: string, 
    showUserVideo?:any) {
    if (!client) return;
    const [microphoneTrack, cameraTrack] = await createLocalTracks({},{encoderConfig: "180p_3"});

    const asnwer = await client.join(appid, channel, token || null);
    const asnwer2 = await client.publish([microphoneTrack, cameraTrack]);
    
    (window as any).client = client;
    (window as any).videoTrack = cameraTrack;
    (window as any).audioTrackChat = microphoneTrack;

    setJoinState(true);
    setChatRoomEntered(true);
  }

  /* * *
  * JOIN PART
  */

  // JOIN TO SPEAKER ROOM
  async function join_speaker(appid: string, channel: string, token?: string, uid?: string | number | null) {
    if (!client) return;
    try {
      const asnwer = await client.join(appid, channel, token || null);
    } catch(e) {
      console.log('------------------------------------');
      console.log('Error message - JOIN SPREAKER ROOM' + e);
      console.log('------------------------------------');
    }
  }

  // JOIN TO RELAY ROOM
  async function join_relay(appid: string, channel: string, token?: string, uid?: string | number | null) {
    if (!client) return;
    try {
      const asnwer = await client.join(appid, channel, token || null);
    }
    catch(e) {
      console.log('------------------------------------');
      console.log('Error message - JOIN RELAY ROOM' + e);
      console.log('------------------------------------');
    }
  }

  // JOIN TO TARGET ROOM
  async function join_target(appid: string, channel: string, setExitTargetChannelFunc:Function, token?: string, uid?: string | number | null) {
    if (!client) return;
    try {
      const asnwer = await client.join(appid, channel, token || null);
      setExitTargetChannelFunc(false);
    } catch(e) {
      console.log('------------------------------------');
      console.log('Error message - JOIN TARGET ROOM' + e);
      console.log(channel);
      console.log('------------------------------------');
    }
  }

  /* * *
  * PUBLISH AND VOLUME CHANGES PART
  */
  //----------------------------------------------------------//
  // Target channel publish
  async function TARGET_VOLUME_UP(setStatusFunc: Function) {
    if (!client) return;
    const [microphoneTrack, cameraTrack] = await createLocalTracks({AEC: false, AGC: true, ANS: true, encoderConfig: {bitrate: 128, sampleRate: 48000, stereo: false}},{});
    (window as any).TARGET_AUDIO_OUTPUT = microphoneTrack;
    const asnwer2 = await client.publish([microphoneTrack, cameraTrack]);
    setStatusFunc(true);
    return true;
  }

  // Target channel unpublish
  async function TARGET_VOLUME_DOWN(setStatusFunc: Function) {
    if (!client) return;
    const asnwer2 = await client.unpublish();
    setStatusFunc(false);
    return true;
  }
  //----------------------------------------------------------//

  // STUDENT channel publish
  async function STUDENT_VOLUME_UP(setStatusFunc: Function) {
    if (!client) return;
    const [microphoneTrack, cameraTrack] = await createLocalTracks({AEC: false, AGC: true, ANS: true, encoderConfig: {bitrate: 128, sampleRate: 48000, stereo: false}},{});
    (window as any).STUDENT_AUDIO_OUTPUT = microphoneTrack;
    const asnwer2 = await client.publish([microphoneTrack, cameraTrack]);
    setStatusFunc(true);
    return true;
  }

  // STUDENT channel unpublish
  async function STUDENT_VOLUME_DOWN(setStatusFunc: Function) {
    if (!client) return;
    const asnwer2 = await client.unpublish();
    setStatusFunc(false);
    return true;
  }
  //----------------------------------------------------------//


  //SPEAKER_PUBLISH
  

  // relay channel volume changing
  async function CHANGE_VOLUME_LEVEL(volume: number, relayChannel:any) {
    if (!client) return;
    /*
    if ((window as any).TRACK_RELAY_INPUT.length!==0) {
      try {
        await (window as any)?.TRACK_RELAY_INPUT[relayChannel]?.setVolume(volume);
      } catch (e) {
        console.log('volume error');
      }
    }*/
    return;
  }
  
  /* * *
  * MUTING VOLUME
  */

  //SELF-MUTING
  async function muteSelf(e: any, clientuid: string | number | null, option: string, muteFunc: Function, bool: boolean, setRelayKey:Function, relayKey:number) {
    if (!clientuid) return;
    if (bool)
    {
      if (option==="TARGET") {
       await (window as any)?.TARGET_AUDIO_OUTPUT?.setEnabled(false);
      }
      if (option==="CHAT") {
       await (window as any)?.audioTrackChat?.setEnabled(false);
      }
    }
    else
    {
      if (option==="TARGET") {
        await (window as any)?.TARGET_AUDIO_OUTPUT?.setEnabled(true);
      }
      if (option==="CHAT") {
        await (window as any)?.audioTrackChat?.setEnabled(true);
        setRelayKey((relayKey:number) => relayKey+1);
      }
    }
    muteFunc(bool);
  }

  //TURN-OFF/ON USER'S VIDEO
  async function turnOffVideo(e: any, clientuid: string | number | null, muteFunc: Function, bool: boolean, setUserVideoKeyFunc:Function, userVideoKey:number) {
    if (!clientuid) return;
    if (!bool)
    {
        await (window as any)?.videoTrack?.setEnabled(false);
        setUserVideoKeyFunc((userVideoKey:number) => userVideoKey+1);
    }
    else
    {
        await (window as any)?.videoTrack?.setEnabled(true);
        setUserVideoKeyFunc((userVideoKey:number) => userVideoKey+1);
    }
    muteFunc(bool);
  }
  
  //SELF-ENTERING
  async function muteEntering(e: any, clientuid: string | number | null) {
    localAudioTrack?.stop();
  }

  // Mute everyone in the channel
  async function muteEveryone() {
    if (!client) return;
    {/* Set voulume to 0*/}
    client.remoteUsers.forEach(user => {
      user.audioTrack?.setVolume(0);
    })
  }

  // Unmute everyone in the channel
  async function UnmuteEveryone() {
    if (!client) return;
    {/* Set voulume to 0*/}
    client.remoteUsers.forEach(user => {
      user.audioTrack?.setVolume(100);
    })
  }

  // Start stream
  async function startStreamFunc() {
    if (!client) return;
  }

  //MUTE REMOTE USER
  async function muteRemoteUser(e: any, userid: string | number) {
    if (!client) return;
    if (muteRemoteUsers.includes(userid)) {
      {/* Delete user from muted*/}
      const newMutedUsersArray = muteRemoteUsers.filter(item => item !== userid);
      setmuteRemoteUsers(newMutedUsersArray);

      {/* Set voulume to 100*/}
      client.remoteUsers.forEach(user => {
        if (user.uid===userid) user.audioTrack?.setVolume(100);
      })
    } else {
      {/* Add user to muted*/}
      setmuteRemoteUsers([...muteRemoteUsers, userid]);

      {/* Set voulume to 0*/}
      client.remoteUsers.forEach(user => {
        if (user.uid===userid) user.audioTrack?.setVolume(0);
      })
    }
  }
  
  //LEAVING THE CHANNEL
  async function leave(setExitFunc: Function) {
    try {
      setRemoteUsers([]);
      setJoinState(false);
      await client?.unpublish();
      await client?.leave();
      setExitFunc(true);
    } catch(e) {
      console.log('----------------------');
      console.log('Leaving error - ');
      console.log(e);
      console.log('----------------------');
    }
  }

  //client changes
  useEffect(() => {
    if (!client) return;
    let bufferVariable:any = undefined;
    setRemoteUsers(client.remoteUsers);

    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      
      //subscribe only to chat and to speaker (relay)
      if (
        (user.uid!==client.uid && (roomType==='chatRoom' || roomType==='speaker'))
        ||
        (roomType==='relay' && user.uid!==client.uid)
        ||
        (roomType==='target' && user.uid!==client.uid)
      ) {
        if (roomType==='relay') 
        {
          (window as any).TRACK_RELAY_INPUT[RoomNumber] = await client.subscribe(user, mediaType)
        }
        else 
          await client.subscribe(user, mediaType);
      }
      // toggle rerender while state of remoteUsers changed.
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }

    // TEST //
    const handleStreamAdded = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await client.subscribe(user, mediaType);
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }
    // TEST //
    
    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }

    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }

    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }

    const handleConnectionStateChange = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers(remoteUsers => Array.from(client.remoteUsers));
    }

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);
    client.on("stream-added", handleStreamAdded);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-joined', handleUserJoined);
      client.off('user-left', handleUserLeft);
    };
  }, [client]);

  return {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    muteSelf,
    turnOffVideo,
    startStreamFunc,
    muteEntering,
    muteRemoteUser,
    muteEveryone,
    UnmuteEveryone,
    join_speaker,
    join_relay,
    join_target,
    TARGET_VOLUME_UP,
    TARGET_VOLUME_DOWN,
    STUDENT_VOLUME_UP,
    STUDENT_VOLUME_DOWN,
    CHANGE_VOLUME_LEVEL,
    remoteUsers,
  };
}