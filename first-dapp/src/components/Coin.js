import React, { useEffect, useState } from "react";
import { useWeb3ExecuteFunction, useMoralis } from "react-moralis";
import { Button } from "web3uikit";
import config from "../utils/config";
import "./Coin.css";

function Coin({ perc, setPerc, token, setModalToken, setVisible }) {
  const [color, setColor] = useState();
  const contractProcessor = useWeb3ExecuteFunction();
  const { isAuthenticated } = useMoralis();

  const vote = async (voteUp) => {
    if (!isAuthenticated) {
      alert("Need to be authenticated to vote");
      return;
    }
    const options = {
      contractAddress: config.CONTRACT_ADDRESS,
      functionName: "vote",
      abi: [
        {
          inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          name: "tickersArray",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "string", name: "_ticker", type: "string" },
            { internalType: "bool", name: "_vote", type: "bool" },
          ],
          name: "vote",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      params: {
        _ticker: token,
        _vote: voteUp,
      },
    };

    await contractProcessor.fetch({
      params: options,
      onSucces: () => {
        console.log("vote succesfull");
      },
      onError: (error) => {
        alert(error);
      },
    });
  };

  useEffect(() => {
    if (perc < 50) {
      setColor("#c43d08");
    } else {
      setColor("green");
    }
  }, [perc]);

  return (
    <>
      <div>
        <div className="token">{token}</div>
        <div className="circle" style={{ boxShadow: `0 0 20px ${color}` }}>
          <div
            className="wave"
            style={{
              marginTop: `${100 - perc}%`,
              boxShadow: `0 0 20px ${color}`,
              backgroundColor: `${color}`,
            }}
          ></div>
          <div className="percentage">{perc}%</div>
        </div>

        <div className="votes">
          <Button
            text="Up"
            type="button"
            theme="primary"
            onClick={() => vote(true)}
          />
          <Button
            text="Down"
            type="button"
            theme="colored"
            color="red"
            onClick={() => vote(false)}
          />
        </div>
        <div className="votes">
          <Button
            text="INFO"
            type="button"
            theme="translucent"
            onClick={() => {
              setModalToken(token);
              setVisible(true);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Coin;
