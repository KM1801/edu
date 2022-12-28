import React, { useContext } from 'react';
import css from './pre_call.module.scss';
import './small.css'
import MainContext from '../main_context';
import Webcam from "react-webcam";
import Languages_choice from "../languages_choice/languages_choice";



window.visualiser_bool = true;


const PreCall = ({
                     systemReq,
                     setHide,
                     display,
                     currentChannel,
                     TokenGet,
                     setChannelFunc,
                     setnickName,
                     nickName,
                     roomData,
                     langMode
                 }) => {
    const contextData = useContext(MainContext);

    let systemReqText;
    if (systemReq) {
        systemReqText = " Your browser is supported.";
    } else {
        systemReqText = " Your browser is NOT fully supported.";
    }

    const [deviceId, setDeviceId] = React.useState({});
    const [devices, setDevices] = React.useState([]);
    const [CameraIsNotPluggedIn, setCameraIsNotPluggedIn] = React.useState(false);
    const [Browser, setBrowser] = React.useState(false);
    const [ClickedToShow, setClickedToShow] = React.useState(false);

    const handleDevices = React.useCallback(
        mediaDevices => setDevices(mediaDevices.filter(device => device.kind === "videoinput")),
        [setDevices]
    );

    React.useEffect(
        () => {
            navigator.mediaDevices.enumerateDevices().then(handleDevices);
        },
        [handleDevices]
    );



    if (roomData.length===0) return (<h1>Loading..</h1>);


    return (
        <>
            <div className={css.wrapper} id={css.page_precall}>
                <div className={css.conference_name}>{contextData.conferenceName}</div>
                <div className={css.ag_main}>
                    <div className={`${css.columns} ${css.ag_container}`}>
                        <div className={css.column}>
                            <div key={Math.random()} className={css.ag_info}>
                                <div className={css.ag_info_footer}>
                                    <div className={css.name_field}>
                                        <div className={css.caption}>Your name:</div>
                                        <input
                                            id="INPUT_FIELD_PRE"
                                            className={css.input_field}
                                            value={nickName}
                                            autoFocus
                                            maxLength="15"
                                            onChange={e=>{setnickName((e.target).value.replace(/[0-9]/g, ''))}}/>
                                    </div>
                                    <a onClick={(e)=> {
                                        if (devices.length===0){
                                            setCameraIsNotPluggedIn(true);
                                            return;
                                        }
                                        if (Browser) {
                                            setHide(true);
                                            clearInterval(window.temerVisualiser);
                                            window.visualiser_bool = false;
                                            window.FIRST_TARGET_CHANNEL=currentChannel;
                                        } else {
                                            return
                                        }
                                    }} id={css.quickJoinBtn} className={`${css.ag_rounded} ${css.button}`}>
                                        <span>Join</span>
                                    </a>
                                </div>
                                <Languages_choice
                                    setChannelFunc={setChannelFunc}
                                    currentLangChannel={currentChannel}
                                    setId={"langChoice_ENTRY"}
                                    number={0}
                                    roomData={roomData}
                                    relayKey={langMode}
                                />
                            </div>
                        </div>
                        <div className={css.column}>
                            <div className={css.ag_cards}>
                                <section className={css.ag_card} id={css.videoCard}>
                                    <div className={css.ag_card_header}>
                        <span>
                        <i className={`${css.ag_icon} ${css.ag_icon_video_24}`}></i>
                        </span>
                                        <span>Video</span>
                                    </div>
                                    <div className={css.ag_card_tip}>
                                        Please make sure your video is visible in the window below. If you are using any video conferencing platform at the same time
                                        (Zoom, BlueJeans, MS Teams etc.), please disable your video in the platform in question before joining the virtual booth!
                                    </div>
                                    <div className={css.ag_card_tip} style={{color:"#F36C44"}}>{CameraIsNotPluggedIn ? "Please check your webcam and close any other applications that might be using it, then reload the page." : void 0}</div>
                                    <div className={css.ag_card_tip} style={{color:"#F36C44"}}>{!Browser ? "Current browser is not supported. Please use Chrome." : void 0}</div>

                                    <h4>All devices</h4>
                                    <div className={css.ag_card_body}>
                                        <div className={css.result}>
                                            {devices.map((device, key) => (
                                                <div key={key} className={css.video_check}>
                                                    <Webcam audio={true} videoConstraints={{ deviceId: device.deviceId }} />
                                                    <div style={{marginTop: "10px"}}>
                                                        {device.label || `Device ${key + 1}`}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>


                        <div className={css.column} style={{"margin":"0 0 0 10px"}}>
                            <div className={css.ag_cards}>
                                <section className={css.ag_card} id={css.audioCard}>
                                    {/* CHOOSE DEVICES PART */}
                                    <div id="container">
                                        <div style={{"display": "inline-block", "margin": "0 0 1em 0"}}>
                                            <label htmlFor="audioSource">Audio input source: </label><select style={{"width":"100%"}} id="audioSource"></select>
                                        </div>
                                        <div style={{"display": "inline-block", "margin": "0 0 1em 0"}}>
                                            <label htmlFor="audioOutput">Audio output destination: </label><select style={{"width":"100%"}} id="audioOutput"></select>
                                        </div>
                                        <div style={{"display": "inline-block", "margin": "0 0 1em 0"}}>
                                            <label htmlFor="videoSource">Video source: </label><select style={{"width":"100%"}} id="videoSource"></select>
                                        </div>
                                        <h4>Current device</h4>
                                        <video style={{"width":"90%", "height":"auto"}} id="video" playsInline autoPlay></video>
                                    </div>
                                </section>

                                {/* Audio checking */}
                                <section className={css.ag_card} id={css.audioCard}>
                                    <div className={css.ag_card_header}>
                        <span>
                        <i className={`${css.ag_icon} ${css.ag_icon_audio_24}`}></i>
                        </span>
                                        <span>Audio</span>
                                    </div>
                                    <div className={css.ag_card_tip}>
                                        Produce sounds to check if the mic works.
                                    </div>
                                    <div className={css.ag_card_body}>
                                        <div className={css.initial}>
                                            <div className={`${css.select} ${css.ag_select}`}>
                                            </div>
                                            <div className={css.ag_audio_test}>
                            <span>
                            <i className={`${css.ag_icon} ${css.ag_icon_audio_24}`}></i>
                            </span>
                                                <div
                                                    onClick={()=> {
                                                        setClickedToShow(true);
                                                        onLoadFunction();
                                                    }}
                                                    className={
                                                        ClickedToShow
                                                            ? `${css.display_none}`
                                                            :
                                                            void 0
                                                    }
                                                    style={{"cursor":"pointer","fontSize":"16px", "border":"1px solid grey"}}>Click to check mic</div>
                                                <div style={{"color":"white", "fontSize":"15px"}} id="db_number"></div>
                                                {/* MIC visualisation */}
                                                <progress id={css.volume} className={`${css.progress} ${css.is_small} ${css.is_info}`} value="0" max="100"></progress>
                                            </div>
                                            <canvas style={{"width":"300px", "height":"10px"}} id="voice_visualisation_1"/>
                                        </div>
                                        <div className={css.result}></div>
                                    </div>
                                </section>

                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </>
    )
}
export default PreCall;
