import React, { useState, useRef } from "react";
import "./Home.css";
import { defaultImgs } from "../defaultimgs";
import { TextArea, Icon } from "web3uikit";
import TweetInFeed from "../components/TweetInFeed";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

const Home = () => {
  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState();
  const [theFile, setTheFile] = useState();
  const [tweet, setTweet] = useState();
  const { Moralis } = useMoralis();
  const user = Moralis.User.current();
  const contractProcessor = useWeb3ExecuteFunction();

  const onImageClick = () => {
    inputFile.current.click();
  };

  const changeHandler = (event) => {
    const img = event.target.files[0];
    setTheFile(img);
    setSelectedFile(URL.createObjectURL(img));
  };

  const maticTweet = async () => {
    if (!tweet) return;

    let img;
    if (theFile) {
      const data = theFile;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      img = file.ipfs();
    } else {
      img = "No Img";
    }

    let options = {
      contractAddress: "0x8f0415C4f080D90F31382d099bB3b0E35dd890A4",
      functionName: "addTweet",
      abi: [
        {
          inputs: [
            {
              internalType: "string",
              name: "tweetTxt",
              type: "string",
            },
            {
              internalType: "string",
              name: "tweetImg",
              type: "string",
            },
          ],
          name: "addTweet",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      params: { tweetTxt: tweet, tweetImg: img },
      msgValue: Moralis.Units.ETH(1),
    };

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => saveTweet(),
      onError: (error) => console.error(error.data.messaage),
    });
  };

  const saveTweet = async () => {
    if (!tweet) return;

    const Tweets = Moralis.Object.extend("Tweets");
    const newTweet = new Tweets();

    newTweet.set("tweetTxt", tweet);
    newTweet.set("tweeterPfp", user.attributes.pfp);
    newTweet.set("tweeterAcc", user.attributes.ethAddress);
    newTweet.set("tweeterUserName", user.attributes.username);

    if (theFile) {
      const data = theFile;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      newTweet.set("tweetImg", file.ipfs());
    }

    await newTweet.save();
    window.location.reload();
  };

  return (
    <>
      <div className="pageIdentify">Home</div>
      <div className="content">
        <div className="profileTweet">
          <img
            src={user.attributes.pfp || defaultImgs[0]}
            className="profilePic"
            alt="profile"
          />
        </div>
        <div className="tweetBox">
          <TextArea
            label=""
            name="tweetTxArea"
            value="GM World"
            type="text"
            width="95%"
            onChange={(e) => setTweet(e.target.value)}
          ></TextArea>
          {selectedFile && (
            <img src={selectedFile} className="tweetImg" alt="tweet" />
          )}
          <div className="imgOrTweet">
            <div className="imgDiv" onClick={onImageClick}>
              <input
                type="file"
                name="file"
                ref={inputFile}
                onChange={changeHandler}
                style={{ display: "none" }}
              />
              <Icon size={20} fill="#1DA1F2" svg="image" />
            </div>
            <div className="tweetOptions">
              <div className="tweet" onClick={saveTweet}>
                Tweet
              </div>
              <div
                className="tweet"
                onClick={maticTweet}
                style={{ backgroundColor: "#8247e5" }}
              >
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
