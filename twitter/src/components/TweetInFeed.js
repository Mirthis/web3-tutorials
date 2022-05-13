import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import "./TweetInFeed.css";
import { defaultImgs } from "../defaultimgs";
import { Icon } from "web3uikit";

const TweetInFeed = ({ profile }) => {
  const [tweetArr, setTweetArr] = useState();
  const { Moralis, account } = useMoralis();

  useEffect(() => {
    const getTweets = async () => {
      try {
        const Tweets = Moralis.Object.extend("Tweets");
        const query = new Moralis.Query(Tweets);
        if (profile) {
          query.equalTo("tweeterAcc", account);
        }
        const results = await query.find();
        setTweetArr(results);
        console.log(results);
      } catch (error) {
        console.error(error);
      }
    };
    getTweets();
  }, [profile, Moralis.Object, Moralis.Query, account]);

  return (
    <>
      {tweetArr
        ?.map((tweet, i) => (
          <div key={i} className="feedTweet">
            <img
              src={tweet.attributes.tweeterPfp || defaultImgs[0]}
              alt="avatar"
              className="profilePic"
            />
            <div className="completeTweet">
              <div className="who">
                {tweet.tweeterUserName}
                <div className="accWhen">{`${tweet.attributes.tweeterAcc.slice(
                  0,
                  4
                )}...${tweet.attributes.tweeterAcc.slice(30)} -
              ${tweet.attributes.createdAt.toLocaleString("en-us", {
                month: "short",
              })}
              ${tweet.attributes.createdAt.toLocaleString("en-us", {
                day: "numeric",
              })}`}</div>
              </div>
              <div className="tweetContent">
                {tweet.attributes.tweetTxt}
                {tweet.attributes.tweetImg && (
                  <img
                    src={tweet.attributes.tweetImg}
                    className="tweetImg"
                    alt="tweet"
                  />
                )}
              </div>
              <div className="interactions">
                <div className="interactionNums">
                  <Icon fill="#3f3f3f" size={20} svg="messageCircle" />
                </div>
                <div className="interactionNums">
                  <Icon fill="#3f3f3f" size={20} svg="star" />
                  15
                </div>
                <div className="interactionNums">
                  <Icon fill="#3f3f3f" size={20} svg="matic" />
                </div>
              </div>
            </div>
          </div>
        ))
        .reverse()}
    </>
  );
};

export default TweetInFeed;
