import React, { useState, useRef } from "react";
import "./Home.css";
import { defaultImgs } from "../defaultimgs";
import { TextArea, Icon, Input } from "web3uikit";
import TweetInFeed from "../components/TweetInFeed";

const Home = () => {
  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState();

  const onImageClick = () => {
    inputFile.current.click();
  };

  const changeHandler = (event) => {
    const img = event.target.files[0];
    setSelectedFile(URL.createObjectURL(img));
  };

  return (
    <>
      <div className="pageIdentify">Home</div>
      <div className="content">
        <div className="profileTweet">
          <img src={defaultImgs[0]} className="profilePic" alt="profile" />
        </div>
        <div className="tweetBox">
          <TextArea
            label=""
            name="tweetTxArea"
            value="GM World"
            type="text"
            width="95%"
          ></TextArea>
          {selectedFile && (
            <img src={selectedFile} className="tweetImg" alt="tweet" />
          )}
          <div className="imgOrTweet">
            <div className="imgDiv" onClick={onImageClick}>
              <Input
                type="file"
                name="file"
                ref={inputFile}
                onChange={changeHandler}
                style={{ display: "none" }}
              />
              <Icon size={20} fill="#1DA1F2" svg="image" />
            </div>
            <div className="tweetOptions">
              <div className="tweet">Tweet</div>
              <div className="tweet" style={{ backgroundColor: "#8247e5" }}>
                <Icon fill="#ffffff" size={20} svg="matic" />
              </div>
            </div>
          </div>
        </div>
        <TweetInFeed profile={false} />
      </div>
    </>
  );
};

export default Home;
