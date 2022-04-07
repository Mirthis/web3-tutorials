import React from "react";
import { Logo } from "../images/Netflix";
import {
  ConnectButton,
  Icon,
  Tab,
  TabList,
  Button,
  Modal,
  useNotification,
} from "web3uikit";
import { movies } from "../helpers/library";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMoralis } from "react-moralis";
import "./Home.css";

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState();
  const [myMovies, setMyMovies] = useState();
  const { isAuthenticated, Moralis, account } = useMoralis();
  const dispatch = useNotification();

  useEffect(() => {
    async function fetchMylist() {
      await Moralis.start({
        serverUrl: "https://oquwhuigfw9w.usemoralis.com:2053/server",
        appId: "cIhi7s9yU9wMx99R9lNUZOBVCMTgXpWsSDP7xMOy",
      });
      const theList = await Moralis.Cloud.run("getMyList", { addrs: account });
      console.log(theList);
      const filteredMovies = movies.filter((m) => theList.indexOf(m.Name) > -1);
      console.log(filteredMovies);
      setMyMovies(filteredMovies);
    }

    fetchMylist();
  }, [account, Moralis]);

  const handleNewNotification = () => {
    dispatch({
      type: "error",
      message: "Please connect your crypto wallet",
      title: "Not authenticated",
      position: "topL",
    });
  };

  const handleAddNotification = () => {
    dispatch({
      type: "success",
      message: "Movie added to list",
      title: "Success",
      position: "topL",
    });
  };

  return (
    <>
      <div className="logo">
        <Logo />
      </div>
      <div className="connect">
        <Icon fill="#ffffff" size={24} svg="bell" />
        <ConnectButton />
      </div>
      <div className="topBanner">
        <TabList defaultActiveKey={1} tabStyle="bar">
          <Tab tabKey={1} tabName="Movies">
            <div className="scene">
              <img
                src={movies[0].Scene}
                alt={movies[0].Name}
                className="sceneImg"
              />
              <img
                src={movies[0].Logo}
                alt={movies[0].Name}
                className="sceneLogo"
              />
              <p className="sceneDesc">{movies[0].Description}</p>
              <div className="playButton">
                <Button
                  icon="chevronRightX2"
                  text="Play"
                  theme="secondary"
                  type="button"
                />
                <Button
                  icon="plus"
                  text="Add to My List"
                  theme="translucent"
                  type="button"
                />
              </div>
            </div>

            <div className="title">Movies</div>
            <div className="thumbs">
              {movies &&
                movies.map((e, i) => {
                  return (
                    <img
                      key={e.Name + "" + i}
                      src={e.Thumnbnail}
                      alt={e.Name + " thunmnail"}
                      className="thumbnail"
                      onClick={() => {
                        setSelectedFilm(e);
                        setVisible(true);
                      }}
                    />
                  );
                })}
            </div>
          </Tab>
          <Tab tabKey={2} tabName="Series" isDisabled={true}></Tab>
          <Tab tabKey={3} tabName="MyList">
            <div className="ownListContent">
              <div className="title">Your Library</div>
              {myMovies && isAuthenticated ? (
                <div className="ownThumbs">
                  {myMovies.map((e, i) => {
                    return (
                      <img
                        key={e.Name + "" + i}
                        src={e.Thumnbnail}
                        alt={e.Name + " thunmnail"}
                        className="thumbnail"
                        onClick={() => {
                          setSelectedFilm(e);
                          setVisible(true);
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="ownThumb">
                  You need to auhtenticate to see your list
                </div>
              )}
            </div>
          </Tab>
        </TabList>
        {selectedFilm && (
          <div className="modal">
            <Modal
              onCloseButtonPressed={() => setVisible(false)}
              isVisible={visible}
              hasFooter={false}
              width="1000px"
            >
              <div className="modelContent">
                <img
                  src={selectedFilm.Scene}
                  alt={selectedFilm.Name}
                  className="modalImg"
                />
                <img
                  src={selectedFilm.Logo}
                  alt={selectedFilm.Name}
                  className="modalLogo"
                />
                <div className="modalPlayButton">
                  {isAuthenticated ? (
                    <>
                      <Link to="/player" state={selectedFilm.Movie}>
                        <Button
                          icon="chevronRightX2"
                          text="Play"
                          theme="secondary"
                          type="button"
                        />
                      </Link>
                      <Button
                        icon="plus"
                        text="Add to My List"
                        theme="translucent"
                        type="button"
                        onClick={async () => {
                          await Moralis.Cloud.run("updateMyList", {
                            addrs: account,
                            newFav: selectedFilm.Name,
                          });
                          setMyMovies(myMovies.concat(selectedFilm));
                          handleAddNotification();
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        icon="chevronRightX2"
                        text="Play"
                        theme="secondary"
                        type="button"
                        onClick={handleNewNotification}
                      />
                      <Button
                        icon="plus"
                        text="Add to My List"
                        theme="translucent"
                        type="button"
                        onClick={handleNewNotification}
                      />
                    </>
                  )}
                </div>
                <div className="movieInfo">
                  <div className="description">
                    <div className="details">
                      <span>{selectedFilm.Year}</span>
                      <span>{selectedFilm.Duration}</span>
                    </div>
                    {selectedFilm.Description}
                  </div>
                  <div className="detailedInfo">
                    Genre:
                    <span className="deets">{selectedFilm.Genre}</span>
                    <br />
                    Actors:
                    <span className="deets">{selectedFilm.Actors}</span>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
