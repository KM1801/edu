import React, { useContext, useState, useRef, useEffect } from 'react';
import css from './languages_choice.module.scss';

const Languages_choice = ({
  currentLangChannel,
  setChannelFunc,
  PrevLangChannel,
  setPrevLangChannel,
  number,
  setId,
  roomData,
  activeRelays,
  osciloScopeStream,
  relayKey,
  roomChannel,
  secretName,
  BusyCabinsArray,
  setChannelFuncStudent,
  currentLangChannelStudent,
  setTeacherButton,
  ButtonPushed
}) => {

  const [relayKeyLocal, setRelayKeyLocal] = useState();

  let arrayNames;
  if (setId==='langChoice_RELAY') {
    arrayNames = [
      '',
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
    ]
  } else {
    arrayNames = [
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
    ]
  }

  //find name of the first student in the current room
  const findStudentName = (index, BusyCabinsArray) => {
    if (BusyCabinsArray?.length!==0 && BusyCabinsArray!==undefined) {
      const elementOfName =  BusyCabinsArray?.find(el => {
        //two-symbol room number
        let new_index="";
        if (index.length===1) {
          new_index = '0' + new_index;
        } else {
          new_index = index;
        }
        //find room 
        if (el.room_name.split('_')[0]==new_index)
          return el;
      });
      const nameOfTheStudent = elementOfName?.user_name;
      return nameOfTheStudent;
    }
    return '';
  }

  //show chosen room (violet)
  useEffect(() => {
    setChannel(currentLangChannel)
  }
  ,[currentLangChannel])

  useEffect(() => {
    setRelayKeyLocal(relayKey)
  }
  ,[relayKey])

  const [ channel, setChannel ] = useState(currentLangChannel);
  //trim languages literals
  let languages = [];
  let LANG_COUNT = 0;
  //CUSTOM TWEAKS FOR JP
  let uuidConf = roomData[5][0].split('_');
  let uuidConfString = uuidConf[1].toString();

  {
    // all rooms
    languages = roomData[1].map(element => {
      return element.split('_')[0]
    });
    
    LANG_COUNT = roomData[1].length;
    languages[roomData[1].length]="FLOOR";

    if (setId==='langChoice_ENTRY') {
      //only 'Hall' to entering
      languages = [...languages[0]];
      LANG_COUNT = 1;
    }
  }

  return (
    <>
        <div 
        id={setId}
        className={
        number===0 ?
        `
        ${css.languages_choice}
        `
        :
        ``
        ||
        number===1 ?
        `
        ${css.languages_choice}
        ${css.add_border}
        ${css.typography_purple}
        `
        :
        ``
        ||
        number===2 ?
        `
        ${css.languages_choice}
        ${css.add_border}
        ${css.typography_purple}
        `
        :
        ``
        }
        style={
          number===1 && currentLangChannelStudent===500 ?
          {"height":((LANG_COUNT-1*45)+625)+'px'}
          :
          {}
          ||
          number===1 ?
          {"height":((LANG_COUNT-1*45)+15)+'px'}
          :
          {}
          ||
          number===2 ?
          {"height":((LANG_COUNT-1*45)+115)+'px'}
          :
          {}
        }
        >
            {number===1 && setId!=='CabinChoice' && secretName ? <div style={{color: "white", textAlign: "center",fontWeight:"500", backgroundColor:"#222"}}>Listen to</div> : <></>}
            {number===1 && setId==='langChoice_RELAY' && !secretName ? <div style={{color: "white", textAlign: "center",fontWeight:"500", backgroundColor:"#222"}}>Listen to</div> : <></>}

            {number===1 && setId==='CabinChoice' && !secretName ? <div style={{color: "white", textAlign: "center",fontWeight:"500", backgroundColor:"#222"}}>Enter to</div> : <></>}
            {number===2 ? <div style={{color: "white", textAlign: "center",fontWeight:"500"}}>Target</div> : <></>}
            
            {languages.map((language, index) => 
                (index!==LANG_COUNT || (index===LANG_COUNT && number===1)) 
                ?
                <a 
                href={void 0} 
                key={language+Math.random(1)} 
                className={
                  language==='FLOOR' && setId==='langChoice_RELAY' ?
                  `${css.display_none}`
                  :
                  ``
                  ||
                  language==='00' && setId==='langChoice_RELAY' ?
                  `${css.display_none}`
                  :
                  ``
                  ||
                  index===0 && setId==='langChoice_RELAY' && secretName ?
                  `${css.display_none}`
                  :
                  ``
                  ||
                  currentLangChannelStudent===500 && setId==='langChoice_RELAY' && index===0?
                  `${css.display_none}`
                  :
                  ``
                }
                onClick={(e) =>
                {
                  if (setId==='langChoice_RELAY') {
                      /* *
                      * For teacher's room 
                      * */
                      //retrieve cabin's number from textContent of the button
                      const clickedCabinNumber = e.target.textContent.replace(/[^0-9]/g, '');

                      if (PrevLangChannel==clickedCabinNumber) {
                        //void channel
                        setChannelFunc(20);
                        //void channel
                        setChannelFuncStudent(20);
                        //set prev as channel
                        setPrevLangChannel(20);
                        //toggle boolean
                        setTeacherButton(false);
                      } else {
                        //current relay to listen
                        setChannelFunc(index);
                        //current student room (talk to)
                        setChannelFuncStudent(index);
                        //set prev as channel
                        setPrevLangChannel(index);
                        //toggle boolean
                        setTeacherButton(true);
                      }
                  } else {
                    /* *
                    * For pre_call room 
                    * */
                    //current relay to listen
                    setChannelFunc(index);
                    //current student room (talk to)
                    setChannelFuncStudent(index);
                  }
                }
                }>
                <div key={index}
                className={
                  (setId!=='langChoice_RELAY' ?
                    (
                    (channel===index) ?
                    `
                    ${css.language_button_active}
                    ${css.language_button}
                    ${css.typography_medium}
                    `
                    :
                    `
                    `
                    &&
                    (channel!==index) ?
                    `
                    ${css.language_button}
                    ${css.typography_medium}
                    `
                    :
                    `
                    `
                  )
                  :
                  (
                    (channel===index) ?
                    `
                    ${css.language_button_active}
                    ${css.language_button}
                    ${css.typography_medium}
                    `
                    :
                    `
                    `
                    &&
                    (channel!==index) ?
                   // (channel!==index || (channel===index && !ButtonPushed)) ?
                    `
                    ${css.language_button}
                    ${css.typography_medium}
                    `
                    :
                    `
                    `
                  )
                )
                }
                >  
                    <div className={
                        activeRelays?.find(x => x.split('_')[0]==(index.length===1 ? '0'+index : index)) ? `${css.active_dot}` : null
                    }>
                    </div>
                    {
                    //append student's name
                    findStudentName(index, BusyCabinsArray) && index!==0 ?
                    <div style={{fontWeight:"bold"}}>
                      ({index}){findStudentName(index, BusyCabinsArray)}
                    </div>
                    :
                    arrayNames[index]}
                    </div>
                </a>
                :
              <></>
            )}
        </div>
    </>
  );
}
export default Languages_choice;