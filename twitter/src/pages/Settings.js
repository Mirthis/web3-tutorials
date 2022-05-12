import React, { useRef, useState } from "react";
import { Input } from "web3uikit";
import "./Settings.css";
import pfp1 from "../images/pfp1.png";
import pfp2 from "../images/pfp2.png";
import pfp3 from "../images/pfp3.png";
import pfp4 from "../images/pfp4.png";
import pfp5 from "../images/pfp5.png";
import { defaultImgs } from "../defaultimgs";

const Settings = () => {
  const pfps = [pfp1, pfp2, pfp3, pfp4, pfp5];
  const [selectedPFP, setSelectedPFP] = useState();
  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState(defaultImgs[1]);

  const onBannerClick = () => {
    inputFile.current.click();
  };

  const changeHandler = (event) => {
    const img = event.target.files[0];
    setSelectedFile(URL.createObjectURL(img));
  };

  const saveEdits = () => {
    //
  };

  return (
    <>
      <div className="pageIdentify">Profile</div>
      <div className="settingsPage">
        <Input
          label="Name"
          name="nameChange"
          width="100%"
          labelBgColor="#141d26"
        />
        <Input
          label="Bio"
          name="bioChange"
          width="100%"
          labelBgColor="#141d26"
        />

        <div className="pfp">
          Profile Image (Your NFTs)
          <div className="pfpOptions">
            {pfps.map((pfp, i) => (
              <img
                src={pfp}
                alt="pfp"
                className={
                  selectedPFP === pfp ? "pfpOptionSelected" : "pfpOption"
                }
                key={i}
                onClick={() => setSelectedPFP(pfps[i])}
              />
            ))}
          </div>
        </div>

        <div className="pfp">
          Profile Banner
          <div className="pfpOptions">
            <img
              src={selectedFile}
              alt="banner"
              className="banner"
              onClick={onBannerClick}
            />
            <Input
              type="file"
              name="file"
              ref={inputFile}
              onChange={changeHandler}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="save" onClick={() => saveEdits()}>
          Save
        </div>
      </div>
    </>
  );
};

export default Settings;
