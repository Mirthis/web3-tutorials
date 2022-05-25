import React, { useEffect, useState } from "react";
import { ConnectButton, Modal } from "web3uikit";
import logo from "./images/Moralis.png";
import Coin from "./components/Coin";
import { abouts } from "./about";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";
import "./App.css";

const App = () => {
  const [btc, setBtc] = useState(70);
  const [eth, setEth] = useState(90);
  const [link, setLink] = useState(55);
  const [modalPrice, setModalPrice] = useState(55);
  const [visible, setVisible] = useState(false);
  const [modalToken, setModalToken] = useState();
  const web3Api = useMoralisWeb3Api();
  const { Moralis, isInitialized } = useMoralis();

  const getRatio = async (ticker, setPerc) => {
    const Votes = Moralis.Object.extend("Votes");
    const query = new Moralis.Query(Votes);
    query.equalTo("ticker", ticker);
    query.descending("createdAt");
    const result = await query.first();
    const up = Number(result.attributes.up);
    const down = Number(result.attributes.down);
    const ratio = Math.round((up / (up + down)) * 100);
    setPerc(ratio);
  };

  useEffect(() => {
    if (isInitialized) {
      getRatio("BTC", setBtc);
      getRatio("ETH", setEth);
      getRatio("LINK", setLink);

      const createLiveQuery = async () => {
        const query = new Moralis.Query("Votes");
        const subscription = await query.subscribe();
        subscription.on("update", (object) => {
          if (object.attributes.ticker === "LINK") {
            getRatio("LINK", setLink);
          } else if (object.attributes.ticker === "ETH") {
            getRatio("ETH", setEth);
          } else if (object.attributes.ticker === "BTC") {
            getRatio("BTC", setBtc);
          }
        });
      };
      createLiveQuery();
    }
  }, [isInitialized, getRatio, Moralis.Query]);

  useEffect(() => {
    async function fetchTokenPrice() {
      const options = {
        address:
          abouts[abouts.findIndex((x) => x.token === modalToken)].address,
      };
      const price = await web3Api.token.getTokenPrice(options);
      setModalPrice(price.usdPrice.toFixed(2));
    }

    if (modalToken) {
      fetchTokenPrice();
    }
  }, [modalToken, web3Api.token]);

  return (
    <>
      <div className="header">
        <div className="logo">
          <img src={logo} alt="logo" height="50px" />
          Sentiment
        </div>
        <ConnectButton />
      </div>
      <div className="instructions">
        Where do you think this token are going? Up or down?
      </div>
      <div className="list">
        <Coin
          perc={btc}
          setPerc={setBtc}
          token="BTC"
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
        <Coin
          perc={eth}
          setPerc={setEth}
          token="ETH"
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
        <Coin
          perc={link}
          setPerc={setLink}
          token="LINK"
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
      </div>
      <Modal
        isVisible={visible}
        onCloseButtonPressed={() => setVisible(false)}
        hasFooter={false}
        title={modalToken}
      >
        <div>
          <span stlye={{ color: "white" }}>{`Price: `}</span>
          {modalPrice}
        </div>
        <div>
          <span stlye={{ color: "white" }}>{`About`}</span>
        </div>
        <div>
          {modalToken &&
            abouts[abouts.findIndex((x) => x.token === modalToken)].about}
        </div>
      </Modal>
    </>
  );
};

export default App;
