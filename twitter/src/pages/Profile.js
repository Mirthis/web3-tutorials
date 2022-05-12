import React from "react";
import "./Profile.css";
import { defaultImgs } from "../defaultimgs";
import { Link } from "react-router-dom";
import TweetInFeed from "../components/TweetInFeed";

const Profile = () => {
  return (
    <>
      <div className="pageIdentify">Profile</div>
      <img className="profileBanner" src={defaultImgs[1]} alt="banner" />
      <div className="pfpContainer">
        <img className="profilePFP" src={defaultImgs[0]} alt="avatar" />
        <div className="profileName">Andrea</div>
        <div className="profileWallet">dw3213123</div>
        <Link to="/settings">
          <div className="profileEdit">Edit profile</div>
        </Link>
        <div className="profileBio">blab w qwf wfqw dwdw wdd wdqw </div>
        <div className="profileTabs">
          <div className="profileTab">Your Tweets</div>
        </div>
      </div>
      <TweetInFeed profile={true} />
    </>
  );
};

export default Profile;
