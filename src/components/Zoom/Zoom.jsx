import { useState } from "react";
import "./style.css";
function Zoom({ src, showButton }) {
  const [zoom, setZoom] = useState(false);
  const handleZoom = () => {
    setZoom(!zoom);
  };
  return (
    <>
      {zoom && (
        <>         
          <div onClick={handleZoom} className="zoom-container">
          </div>
          <img src={src} alt="" className="zoom" />
        </>
      )}

      {!showButton ? (
        <img onClick={handleZoom} src={src} alt="" />
      ) : (
        <h3 className="btn btn-warning" onClick={handleZoom}>Zoom</h3>
      )}
    </>
  );
}

export default Zoom;
