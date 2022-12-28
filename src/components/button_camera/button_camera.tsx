import React, { useContext } from "react";
import css from "./button_camera.module.scss";
import MainContext from "../main_context";

const Button_camera = ({}) => {
  const contextData: any = useContext(MainContext);
  return (
    <>
      <a
        className={css.pointer}
        href={void 0}
        onClick={(e) => {
          contextData.startWebCamera();
        }}
      >
        <div className={css.flex_column}>
          <img
            className={
              contextData.SourceType === "web"
                ? `
          ${css.icon_button}
          `
                : `
          ${css.icon_button}
          `
            }
            src={
              contextData.SourceType === "web"
                ? "https://rsi.exchange/wp-content/uploads/2021/02/video_active.svg"
                : "https://rsi.exchange/wp-content/uploads/2021/02/video.svg"
            }
          />
          <div
            className={
              contextData.SourceType === "web"
                ? `
          ${css.red_back}
          `
                : `
          ${css.font_white}
          `
            }
          >
            Camera
          </div>
        </div>
      </a>
    </>
  );
};

export default Button_camera;
