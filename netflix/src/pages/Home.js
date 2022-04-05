import React from "react";
import { Logo } from "../images/Netflix";
import { ConnectButton, Icon, Tab, TabList, Button, Modal } from "web3uikit";
import { movies } from "../helpers/library";
import { useState } from "react";
import "./Home.css";

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState();

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
          <Tab tabKey={3} tabName="MyList"></Tab>
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
                <div className="movieInfo">
                  <div className="description">
                    <div className="details">
                      <span>{selectedFilm.Year}</span>
                      <span>{selectedFilm.Duration}</span>
                    </div>
                    {selectedFilm.Description}
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
