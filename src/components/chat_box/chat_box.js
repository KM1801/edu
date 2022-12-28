import React, { useContext, useRef } from 'react';
import css from './chat_box.module.scss';
import {useState, useEffect} from 'react';
import io from 'socket.io-client';
 
const URL = "https://web-sockets-uy7atznzra-ey.a.run.app/";
let socket = io(URL, {secure: true});

const Chat_box = ({
  clientID,
  partnerIDs,
  setPartnerIDs,
  nickName,
  chatRoom,
  targetChannel,
  streamStart,
  setStreamStartFunc,
  showMain,
  setStreamer,
  currentStreamer,
  setActiveRelaysFunc,
  activeRelays,
  showChat,
  setBusyCabinsArray,
  setApplicationTerminate,
  DispatchRecording,
  setDispatchRecording,
  ExitByDemand,
  secretName,
  TerminateConference
  }) => {

  //after fetching room's name
  useEffect (() => {
    (async() => {

      console.log('-----------------');
      console.log('CURRENT CHAT ROOM');
      console.log('-----------------');
      console.log(chatRoom);
      console.log('-----------------');
      console.log('CURRENT CHAT ROOM');
      console.log('-----------------');
      if (chatRoom) {
        window.RoomW = chatRoom;
        serInRoom(true);
      }
    })()
  },
  [chatRoom]);

  const [ InRoom, serInRoom ] = useState(false);
  const [ messages, setMessages ] = useState([]);
  const [ localMsg, setLocalMsg ] = useState({});
  const [ chatTopMenu, setChatTopMenu ] = useState(0);
  const chatArea = useRef();
  
  //------------------------------------------------------//
  //-----------------Sending socket events----------------//
  //------------------------------------------------------//
  //enter the room
  useEffect (() => {
    (async()=> {
      if (showMain) {
        const windowRoom = window.RoomW;
        if (InRoom) {
          await socket.emit("exit", {});
        }
        //emiting new event - join room
        await socket.emit("join", {
          nickName,
          windowRoom,
          clientID
        });
        //get busy cabins from server (3 secs delay)
        setTimeout(function () {
          socket.emit("getBusyCabins", {clientID, windowRoom, nickName})
        }
        ,3000);
        socket.emit('createRoom', windowRoom);
    }
  })()
  }, [showMain, chatRoom])

  //change room 
 /* useEffect (() => {
    (async()=>{
      if (InRoom) {
        await socket.emit("exit", {});
        //emiting new event - join room
        await socket.emit("join", {
          nickName,
          windowRoom,
          clientID
        });
    }
  })()
  }, [changeRoom])
*/
  //start/stop streaming
  useEffect(() => {

    if (streamStart===true && clientID===currentStreamer) {
      const windowRoom = window.RoomW;
      socket.emit("streamingStart", {clientID, windowRoom, nickName, targetRoom:targetChannel});
    }

    if (streamStart===false && clientID) {
      const windowRoom = window.RoomW;
      socket.emit("streamingStop", {clientID, windowRoom, nickName, targetRoom:targetChannel});
    }

  }, [streamStart])

  //change streaming target 
  useEffect(() => {
  if (streamStart===true && clientID===currentStreamer) {
    const windowRoom = window.RoomW;
    socket.emit("streamingChanging", {clientID, windowRoom, nickName, targetRoom:targetChannel, prevRoom:window.prev_target_room});
   }
  }, [targetChannel])


  //TERMINATE THE CONFERENCE
  useEffect(()=>{
    if (TerminateConference) {
      socket.emit("DISPATCH_APPLICATION_TERMINATE",{UUID: window.RoomW.split('_')[1]});
      console.log('___________TERMINATING EVERYTHING_________________');
      console.log(window.RoomW.split('_')[1])
    }
  },[TerminateConference])

  //toggle recording (only for teacher)
  useEffect(() => {
    console.log('______________________________________');
    console.log('DispatchRecording- '+DispatchRecording)
    console.log('______________________________________');
    if (secretName) {
      const UUID = window.RoomW.split('_')[1];
      console.log('teacher has clicked the button TO START RECORDING')
      console.log('UUID='+UUID)
      socket.emit("DISPATCH_START_RECORDING", {UUID});
    }
  }, [DispatchRecording])
  
  //Message was sent
  useEffect (() => {
    if (localMsg.length>0) {
      ScrollToBottom();
      const {user, msg, Room} = localMsg[0];
      console.log('new message was sent');
      socket.emit("send", {user, msg, Room});
    }
  }, [localMsg])

  //exit by demand
  useEffect (() => {
    if (ExitByDemand) {
      //exit when conderence is terminated
      socket.emit("exit");
    }
  }, [ExitByDemand])

  //--------------------------------------//
  //Recieving socket events
  //--------------------------------------//
  useEffect (() => {
    //user joined 
    socket.on("update", function({msg, Room, streamer, clients, targetRooms}) {
      if (Room===window.RoomW) {
        setMessages(messages => [...messages, {user:'System', msg:msg, Room:window.RoomW }]);
        ScrollToBottom();
        setActiveRelaysFunc(targetRooms);
        //type checking - hello ts
        console.log(streamer);
        let resultStreamer;
        if (streamer!=='') {
          resultStreamer=parseInt(streamer);
        } else {
          resultStreamer='';
        }
        //set streamer
        setStreamer(resultStreamer);
        //set partners
        setPartnerIDs(clients);
        //start stream
        if (streamer!=='') {
          setStreamStartFunc(true);
        }
      }
    })

    //new target roooms 
    socket.on("newTargetRooms", function({targetRooms}) {
      setActiveRelaysFunc(targetRooms);
    })

    //start streaming
    socket.on("streamHasStarted", function({user, Room, nickName}) {
      if (Room===window.RoomW) {
        setMessages(messages => [...messages, {user:'System', msg:`${nickName} has started audio stream`, Room:window.RoomW }]);
        setStreamer(user);
        ScrollToBottom();
      }
    })

    //stop streaming
    socket.on("streamHasStopped", function({user, Room, nickName}) {
      if (Room===window.RoomW) {
        setMessages(messages => [...messages, {user:'System', msg:`${nickName} has stopped audio stream`, Room:window.RoomW }]);
        setStreamStartFunc(false);
        setStreamer('');
        ScrollToBottom();
      }
    })

    //new streaming target
    socket.on("streamHasChanged", function({user, Room, nickName, targetRooms}) {
      if (Room===window.RoomW) {
        setMessages(messages => [...messages, {user:'System', msg:`${nickName} has changed stream target`, Room:window.RoomW }]);
        setActiveRelaysFunc(targetRooms);
        ScrollToBottom();
      }
    })

    //message was sent
    socket.on("chat", function({user, msg, Room}) {
      if (Room===window.RoomW) {
        setMessages(messages => [...messages, {user:user, msg:msg, Room:window.RoomW }]);
        ScrollToBottom();
      }
    })

    //busy cabins recieving
    socket.on("busyCabins", function({clientID, Room, busyRooms, nickName}) {
      setBusyCabinsArray(busyRooms)
    })

    //APPLICATION_TERMINATE
    socket.on("APPLICATION_TERMINATE", function({UUID}) {
      console.log('--------------------------')
      console.log('application will be terminated')
      console.log('--------------------------')
      if (UUID==window.RoomW.split('_')[1]) {
        setApplicationTerminate(true);
        console.log('UUID='+UUID);
        console.log('window.RoomW.split("_")[1]='+window.RoomW.split('_')[1]);
      }
    })

    //RECORDING EVENT
    socket.on("START_RECORDING", function({UUID}) {
      console.log('--------------------------')
      console.log('recording has been started')
      console.log('--------------------------')
      if (UUID==window.RoomW.split('_')[1] && !secretName) {
        setDispatchRecording(DispatchRecording => !DispatchRecording);
      }
    })
  }, [socket])

  function ScrollToBottom () {
    let objDiv = document?.getElementById("chat");
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }

  return (
    <div className={showChat ? `${css.show_chat}` : `${css.hide_chat}`}>
      <div ref={chatArea} id="chat" className={css.chatArea}>
        {!chatTopMenu ?
          <ol className={css.chat} id="ol_chat_msgs">
          {messages.map(x => (
          <li className={x.user==='System' ? css.system : nickName===x.user ? css.self : css.remote} key={Math.random(10)}>
              <div className={css.msg}>
                <span>{x.user}:
                </span>
                <p>{x.msg}</p>
                <time>
                  {new Date().getHours()}:{new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes()}
                </time>
              </div>
          </li>))}
        </ol>
        :
        <div>Contact our support team</div>
        }
      </div>
      <div className={css.typing_block}>
        <textarea className={css.chat_input} onKeyPress={(e) => {
            if (e.key==='Enter' && e.target.value!=='') {
              setLocalMsg([{msg: e.target.value, user: nickName, Room:window.RoomW}]);
              setMessages([...messages, {msg: e.target.value, user: nickName, Room:window.RoomW}]);
              e.target.value='';
            }}} type="text" placeholder="Type here!" id="textarea" />
        <input className={css.send_button} 
        value="Send"
        type="button"
        onClick={(e) => {
          {/* Insert message if not null */}
          const textArea = document.getElementById('textarea').value;
            if (textArea!==''){
              setLocalMsg([{msg:textArea, user: nickName, Room:window.RoomW}]);
              setMessages([...messages, {msg: textArea, user: nickName, Room:window.RoomW}]);
              document.getElementById('textarea').value='';
            }
          }}
        />
      </div>
    </div>
  );
}

export default Chat_box;