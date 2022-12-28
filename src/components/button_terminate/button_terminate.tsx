import React, { useContext } from "react";
import css from "./button_terminate.module.scss";
import MainContext from "../main_context";

const Button_terminate = ({}) => {
  const contextData: any = useContext(MainContext);
  return (
    <>
      <a
        className={css.pointer}
        href={void 0}
        onClick={(e) => {
          contextData.terminateTheConference();
      }}>
        <div className={css.flex_column}>
          <img
            className={`${css.icon_button}`}
            src={"https://rsi.exchange/wp-content/uploads/2021/02/cancel_red.svg"}
          />
          <div className={`${css.font_white}`}>
            Terminate
          </div>
        </div>
      </a>
    </>
  );
};

export default Button_terminate;