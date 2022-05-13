import React, { useRef, useState, useEffect } from "react";
import { Input } from "web3uikit";
import "./Settings.css";
import { defaultImgs } from "../defaultimgs";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

const Settings = () => {
  const [pfps, setPfps] = useState([]);
  const [selectedPFP, setSelectedPFP] = useState();
  const inputFile = useRef(null);
  const [selectedFile, setSelectedFile] = useState(defaultImgs[1]);
  const [theFile, setTheFile] = useState();
  const [username, setUsername] = useState();
  const [bio, setBio] = useState();
  const { Moralis, isAuthenticated, account } = useMoralis();
  const Web3Api = useMoralisWeb3Api();

  const onBannerClick = () => {
    inputFile.current.click();
  };

  const changeHandler = (event) => {
    const img = event.target.files[0];
    setTheFile(img);
    setSelectedFile(URL.createObjectURL(img));
  };

  const saveEdits = async () => {
    const User = Moralis.Object.extend("_User");
    const query = new Moralis.Query(User);
    const myDetails = await query.first();

    if (bio) {
      myDetails.set("bio", bio);
    }

    if (username) {
      myDetails.set("username", username);
    }

    if (theFile) {
      const data = theFile;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      myDetails.set("banner", file.ipfs());
    }

    if (selectedPFP) {
      myDetails.set("pfp", selectedPFP);
    }

    await myDetails.save();
    window.location.reload();
  };

  const resolveLink = (url) => {
    if (!url || !url.includes("ipfs://")) return url;
    return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
  };

  useEffect(() => {
    const fetcNFTs = async () => {
      const options = {
        chain: "mumbai",
        address: account,
      };

      console.log(options);
      const mumbaiNFTs = await Web3Api.account.getNFTs(options);
      console.log(mumbaiNFTs);
      const images = mumbaiNFTs.result.map((res) =>
        resolveLink(JSON.parse(res.metadata)?.image)
      );
      setPfps(images);
    };

    fetcNFTs();
  }, [isAuthenticated, account, Web3Api.account]);

  return (
    <>
      <div className="pageIdentify">Profile</div>
      <div className="settingsPage">
        <Input
          label="Name"
          name="nameChange"
          width="100%"
          labelBgColor="#141d26"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label="Bio"
          name="bioChange"
          width="100%"
          labelBgColor="#141d26"
          onChange={(e) => setBio(e.target.value)}
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
            <input
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
