import React from "react";
import { useMoralis } from "react-moralis";
import "./Sidebar.css";
import { Icon } from "web3uikit";
import { defaultImgs } from "../defaultimgs";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { Moralis } = useMoralis();
  const user = Moralis.User.current();

  return (
    <>
      <div className="siderContent">
        <div className="menu">
          <div className="details">
            <Icon fill="#ffffff" size={33} svg="twitter" />
          </div>
          <Link to="/" className="link">
            <div className="menuItems">
              <Icon fill="#ffffff" size={33} svg="list" />
              Home
            </div>
          </Link>

          <Link to="/profile" className="link">
            <div className="menuItems">
              <Icon fill="#ffffff" size={33} svg="user" />
              Profile
            </div>
          </Link>

          <Link to="/settings" className="link">
            <div className="menuItems">
              <Icon fill="#ffffff" size={33} svg="cog" />
              Settings
            </div>
          </Link>
        </div>

        <div className="details">
          <img
            className="profilePic"
            src={user.attributes.pfp || defaultImgs[0]}
            alt="avatar"
          />
          <div className="profile">
            <div className="who">{user.attributes.username}</div>
            <div className="accWhen">{`${user.attributes.ethAddress.slice(
              0,
              4
            )}...${user.attributes.ethAddress.slice(30)}`}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
