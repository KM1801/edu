import React, { useContext } from "react";
import css from "./button_screen.module.scss";
import MainContext from "../main_context";

const Button_screen = ({}) => {
  const contextData: any = useContext(MainContext);
  return (
    <>
      <a
        className={css.pointer}
        href={void 0}
        onClick={(e) => {
          contextData.startScreenSharing();
        }}
      >
        <div className={css.flex_column}>
          <img
            className={
              contextData.SourceType === "screen"
                ? `
          ${css.icon_button}
          `
                : `
          ${css.icon_button}
          `
            }
            src={
              contextData.SourceType === "screen"
                ? "https://rsi.exchange/wp-content/uploads/2021/02/screen_sharing_active.svg"
                : "https://rsi.exchange/wp-content/uploads/2021/02/screen_sharing.svg"
            }
          />
          <div
            className={
              contextData.SourceType === "screen"
                ? `
          ${css.red_back}
          `
                : `
          ${css.font_white}
          `
            }
          >
            Screen
          </div>
        </div>
      </a>
    </>
  );
};

export default Button_screen;