import React, { useContext } from "react";
import css from "./button_mic_all.module.scss";
import MainContext from "../main_context";

const Button_mic_all = ({}) => {
  const contextData: any = useContext(MainContext);
  return (
    <>
      <a
        className={css.pointer}
        href={void 0}
        onClick={(e) => {
          //afer clcking we change stream status
          if (contextData.streamStart) {
            contextData.setCurrentStreamerFunc('');
            //unpublish stream
            contextData.target_client.TARGET_VOLUME_DOWN(contextData.setStreamStartFunc);
          } else {
            contextData.setCurrentStreamerFunc(contextData.client.uid);
            contextData.target_client.TARGET_VOLUME_UP(contextData.setStreamStartFunc);
          }
        }}
      >
        <div className={css.flex_column}>
          <img
            className={`${css.icon_button}`}
            src={
              contextData.streamStart
                ? "https://rsi.exchange/wp-content/uploads/2021/02/mic_active.svg"
                : "https://rsi.exchange/wp-content/uploads/2021/02/mic.svg"
            }
          />
          <div
            className={
              contextData.streamStart
                ? `
          ${css.red_back}
          `
                : `
          ${css.font_white}
          `
            }
          >
           {contextData.secretName ? "To all": "Mic"}
          </div>
        </div>
      </a>
    </>
  );
};

export default Button_mic_all;
