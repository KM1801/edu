import React, { useContext } from "react";
import css from "./button_record.module.scss";
import MainContext from "../main_context";

const Button_record = ({}) => {
  const contextData: any = useContext(MainContext);
  return (
    <>
      <a
        className={css.pointer}
        href={void 0}
        onClick={(e) => {
          contextData.setDispatchRecording(!contextData.DispatchRecording)
        }}
        >
        <div className={css.flex_column}>
          <img
            className={`${css.icon_button}`}
            src={
              contextData.DispatchRecording
                ? "https://rsi.exchange/wp-content/uploads/2021/02/rec_active.svg"
                : "https://rsi.exchange/wp-content/uploads/2021/02/rec.svg"
            }
          />
          <div
            className={
              contextData.DispatchRecording
                ? `
          ${css.red_back}
          `
                : `
          ${css.font_white}
          `
            }
          >
           {contextData.DispatchRecording ? "Stop" : "Record"}
          </div>
        </div>
      </a>
    </>
  );
};

export default Button_record;
