import React, { useContext } from "react";
import css from "./button_mic_to_student.module.scss";
import MainContext from "../main_context";

const Button_mic_to_student = ({}) => {
  const contextData: any = useContext(MainContext);
  return (
    <>
      <a
        className={css.pointer}
        href={void 0}
        onClick={async (e) => {
            //afer clcking we change stream status
            if (contextData.StreamStartOne) {
              //unpublish stream and leave
              await contextData.target_rtc_student.STUDENT_VOLUME_DOWN(contextData.setStreamStartOneFunc);
              await contextData.target_rtc_student?.leave(contextData.setExitStudentChannelFunc);
            } else {
              await contextData.target_rtc_student?.leave();
              await contextData.target_rtc_student.join_target(contextData.roomData[0][0],contextData.roomData[1][contextData.relayChannel], contextData.setExitStudentChannelFunc, contextData.roomData[2][contextData.relayChannel]);
              await contextData.target_rtc_student.STUDENT_VOLUME_UP(contextData.setStreamStartOneFunc);
            }
        }}
      >
        <div className={css.flex_column}>
          <img
            className={`${css.icon_button}`}
            src={
              contextData.StreamStartOne
                ? "https://rsi.exchange/wp-content/uploads/2021/02/mic_active.svg"
                : "https://rsi.exchange/wp-content/uploads/2021/02/mic.svg"
            }
          />
          <div
            className={
              contextData.StreamStartOne 
                ? `
          ${css.red_back}
          `
                : `
          ${css.font_white}
          `
            }
          >
           {"To student"}
          </div>
        </div>
      </a>
    </>
  );
};

export default Button_mic_to_student;
