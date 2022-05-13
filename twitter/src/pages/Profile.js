import React from "react";
import "./Profile.css";
import { defaultImgs } from "../defaultimgs";
import { Link } from "react-router-dom";
import { useMoralis } from "react-moralis";
import TweetInFeed from "../components/TweetInFeed";

const Profile = () => {
  const { Moralis } = useMoralis();
  const user = Moralis.User.current();

  return (
    <>
      <div className="pageIdentify">Profile</div>
      <img
        className="profileBanner"
        src={user.attributes.banner || defaultImgs[1]}
        alt="banner"
      />
      <div className="pfpContainer">
        <img
          className="profilePFP"
          src={user.attributes.pfp || defaultImgs[0]}
          alt="avatar"
        />
        <div className="profileName">{user.attributes.username}</div>
        <div className="profileWallet">{`${user.attributes.ethAddress.slice(
          0,
          4
        )}...${user.attributes.ethAddress.slice(30)}`}</div>
        <Link to="/settings">
          <div className="profileEdit">Edit profile</div>
        </Link>
        <div className="profileBio">{user.attributes.bio}</div>
        <div className="profileTabs">
          <div className="profileTab">Your Tweets</div>
        </div>
      </div>
      <TweetInFeed profile={true} />
    </>
  );
};

export default Profile;
