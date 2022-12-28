import React, { useContext, useState, useRef, useEffect } from 'react';
import css from './cabin_choice.module.scss';

const Cabin_choice = ({
  switch_channel,
  channel, 
  BusyCabinsArray
}) => {

  const [ActualChannel, setActualChannel] = useState(1);

  useEffect(()=>{
    const roomsNamesDigits = BusyCabinsArray.map(el=> el.room_name.charAt(1))
    setActualChannel(Math.max(...roomsNamesDigits)+1)
  }, [BusyCabinsArray])

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
  ]

  const arrayNamesCabins = [
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

  return (
    <div className={`${css.languages_choice}`} style={{"height":'370px', "border":"1px solid #6034c7", "borderRadius":"10px","zIndex":"9999"}}>
      {/* Header*/}
      <div style={{color: "white", textAlign: "center", fontWeight:"bold", marginTop: "10px",  backgroundColor:"#222"}}>Enter to</div>
        <div className={css.two_columns_wrap}>
        {/* Elements */}
          {/* Link to hall's cabin */}

          <a
            href={void 0} 
            key={0+'key'}
            onClick={async () =>
            {
              switch_channel(0);
            }
            }>
            <div key={0+'key'} className={
                (channel===0) ?
                `
                ${css.language_button_active}
                ${css.language_button}
                ${css.typography_medium}
                `
                :
                `
                `
                &&
                (channel!==0) ?
                `
                ${css.language_button}
                ${css.typography_medium}
                `
                :
                `
                `
            }
            >
            Зал
            </div>
          </a>


         {/* 1 cabin */}
          {channel===0 ?
          (
            <>
            <div style={{display:"flex"}}>
            <div >
            <a
              href={void 0}
              key={1+'key'}
              onClick={async() =>
              {
                switch_channel(1);
              }
              }>
              <div key={(1)+'key'} className={
                  (channel===(0+1)) ?
                  `
                  ${css.language_button_active}
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
                  &&
                  (channel!==(0+1)) ?
                  `
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
              }
              >
              В кабину {(0+1)}
              </div>
            </a>


              {/* 2 cabin */}
            <a
              href={void 0}
              key={2+'key'}
              onClick={async() =>
              {
                switch_channel(2);
              }
              }>
              <div key={(1)+'key'} className={
                  (channel===(0+2)) ?
                  `
                  ${css.language_button_active}
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
                  &&
                  (channel!==(0+2)) ?
                  `
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
              }
              >
              В кабину {(0+2)}
              </div>
            </a>

            {/* 3 cabin */}
            <a
              href={void 0}
              key={3+'key'}
              onClick={async() =>
              {
                switch_channel(3);
              }
              }>
              <div key={(3)+'key'} className={
                  (channel===(0+3)) ?
                  `
                  ${css.language_button_active}
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
                  &&
                  (channel!==(0+3)) ?
                  `
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
              }
              >
              В кабину {(0+3)}
              </div>
            </a>


            {/* 4 cabin */}
            <a
              href={void 0}
              key={4+'key'}
              onClick={async() =>
              {
                switch_channel(4);
              }
              }>
              <div key={(4)+'key'} className={
                  (channel===(0+4)) ?
                  `
                  ${css.language_button_active}
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
                  &&
                  (channel!==(0+4)) ?
                  `
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
              }
              >
              В кабину {(0+4)}
              </div>
            </a>

          
          
            {/* 5 cabin */}
            <a
              href={void 0}
              key={5+'key'}
              onClick={async() =>
              {
                switch_channel(5);
              }
              }>
              <div key={(5)+'key'} className={
                  (channel===(0+5)) ?
                  `
                  ${css.language_button_active}
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
                  &&
                  (channel!==(0+5)) ?
                  `
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
              }
              >
              В кабину {(0+5)}
              </div>
            </a>



            {/* 6 cabin */}
            <a
              href={void 0}
              key={6+'key'}
              onClick={async() =>
              {
                switch_channel(6);
              }
              }>
              <div key={(6)+'key'} className={
                  (channel===(0+6)) ?
                  `
                  ${css.language_button_active}
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
                  &&
                  (channel!==(0+6)) ?
                  `
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
              }
              >
              В кабину {(0+6)}
              </div>
            </a>
            </div>
            <div>
                  {/* 7 cabin */}
                  <a
              href={void 0}
              key={7+'key'}
              onClick={async() =>
              {
                switch_channel(7);
              }
              }>
              <div key={(7)+'key'} className={
                  (channel===(0+7)) ?
                  `
                  ${css.language_button_active}
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
                  &&
                  (channel!==(0+7)) ?
                  `
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
              }
              >
              В кабину {(0+7)}
              </div>
            </a>


            {/* 8 cabin */}
            <a
              href={void 0}
              key={8+'key'}
              onClick={async() =>
              {
                switch_channel(8);
              }
              }>
              <div key={(8)+'key'} className={
                  (channel===(0+8)) ?
                  `
                  ${css.language_button_active}
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
                  &&
                  (channel!==(0+8)) ?
                  `
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
              }
              >
              В кабину {(0+8)}
              </div>
            </a>


            {/* 9 cabin */}
            <a
              href={void 0}
              key={9+'key'}
              onClick={async() =>
              {
                switch_channel(9);
              }
              }>
              <div key={(9)+'key'} className={
                  (channel===(0+9)) ?
                  `
                  ${css.language_button_active}
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
                  &&
                  (channel!==(0+9)) ?
                  `
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
              }
              >
              В кабину {(0+9)}
              </div>
            </a>

            {/* 10 cabin */}
            <a
              href={void 0}
              key={10+'key'}
              onClick={async() =>
              {
                switch_channel(10);
              }
              }>
              <div key={(9)+'key'} className={
                  (channel===(0+10)) ?
                  `
                  ${css.language_button_active}
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
                  &&
                  (channel!==(0+10)) ?
                  `
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
              }
              >
              В кабину {0+10}
              </div>
            </a>

              {/* 11 cabin */}
              <a
              href={void 0}
              key={11+'key'}
              onClick={async() =>
              {
                switch_channel(11);
              }
              }>
              <div key={(11)+'key'} className={
                  (channel===(0+11)) ?
                  `
                  ${css.language_button_active}
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
                  &&
                  (channel!==(0+11)) ?
                  `
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
              }
              >
              В кабину {0+11}
              </div>
              
            </a>

              {/* 12 cabin */}
              <a
              href={void 0}
              key={12+'key'}
              onClick={async() =>
              {
                switch_channel(12);
              }
              }>
              <div key={(12)+'key'} className={
                  (channel===(0+12)) ?
                  `
                  ${css.language_button_active}
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
                  &&
                  (channel!==(0+12)) ?
                  `
                  ${css.language_button}
                  ${css.typography_medium}
                  `
                  :
                  `
                  `
              }
              >
              В кабину {0+12}
              </div>
            </a>

            </div>
            </div>
            </>
          )
          :
          <></>
        }
        </div>
    </div>
  )
}
export default Cabin_choice;