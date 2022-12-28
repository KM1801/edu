import React, { useContext } from "react";
import MainContext from "../main_context";

const Volume_host = ({}) => {
  const contextData: any = useContext(MainContext);
  return (
    <>
      <div style={{display:"flex", flexDirection:"column"}}>
          <div style={{color:"white", "fontSize":"120%"}}>Teacher volume:</div>
          <input style={{"padding":"0", "border":"0"}} type="range" min="0" max="100" step="1" value={contextData.StudentVolume} onChange={(e)=>
            {
              contextData.SetStudentVolume(parseInt(e.target.value))
            }}/>
          <div style={{color:"white", "fontSize":"120%"}}>Student volume:</div>
          <input style={{"padding":"0", "border":"0"}} type="range" min="0" max="100" step="1" value={contextData.mainVolume} onChange={(e)=>
            {
              contextData.SetMainVolume(parseInt(e.target.value))
          }}/>
      </div>
    </>
  );
};

export default Volume_host;
