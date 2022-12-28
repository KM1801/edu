import React, { useContext } from "react";
import css from "./button_mic_mute.module.scss";
import MainContext from "../main_context";

const Button_mic_mute = ({}) => {
  const contextData: any = useContext(MainContext);
  return (
    <>
      <a
        className={css.pointer}
        href={void 0}
        onMouseDown={(e) => {
          contextData.muteSelf(e, contextData.client.uid, "TARGET", contextData.muteTargetFunc, true);
          }}
        onMouseUp={(e) => {
          contextData.muteSelf(e, contextData.client.uid, "TARGET", contextData.muteTargetFunc, false);
        }}
      >
        <div className={css.flex_column}>
          <img
            className={`${css.icon_button}`}
            src={
              contextData.muteTarget
                ? "https://rsi.exchange/wp-content/uploads/2021/02/mic_active.svg"
                : "https://rsi.exchange/wp-content/uploads/2021/02/mic.svg"
            }
          />
          <div
            className={
              contextData.muteTarget 
                ? `
          ${css.red_back}
          `
                : `
          ${css.font_white}
          `
            }
          >
           {"Mute"}
          </div>
        </div>
      </a>
    </>
  );
};

export default Button_mic_mute;
