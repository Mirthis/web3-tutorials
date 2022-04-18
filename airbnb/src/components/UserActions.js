import React from "react";
import { useMoralis } from "react-moralis";
import { ConnectButton } from "web3uikit";
import config from "../utils/config";
import AddRental from "./AddRental";
import User from "./User";

const UserActions = () => {
  const { account } = useMoralis();

  return (
    <div className="lrContainers">
      {account && account === config.CONTRACT_OWNER && <AddRental />}
      {account && account !== config.CONTRACT_OWNER && (
        <User account={account} />
      )}
      <ConnectButton />
    </div>
  );
};

export default UserActions;
