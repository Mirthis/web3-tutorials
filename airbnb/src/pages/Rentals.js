import React, { useState, useEffect } from "react";
import "./Rentals.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo from "../images/airbnbRed.png";
import { Button, Icon, useNotification } from "web3uikit";
import RentalsMap from "../components/RentalsMap";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import UserActions from "../components/UserActions";
import config from "../utils/config";

const Rentals = () => {
  const { state: searchFilters } = useLocation();
  const [highlight, setHighLight] = useState();
  const [coordinates, setCoordinates] = useState([]);
  const { Moralis, account } = useMoralis();
  const [rentalsList, setRentalsList] = useState([]);
  const contractProcessor = useWeb3ExecuteFunction();
  const dispatch = useNotification();

  const handleSuccess = () => {
    dispatch({
      type: "success",
      message: `Nice! You are going to ${searchFilters.destination}!!`,
      title: "Booking succesful",
      position: "topL",
    });
  };

  const handleError = (msg) => {
    dispatch({
      type: "error",
      message: msg,
      title: "Booking Failed",
      position: "topL",
    });
  };

  const handleNoAccount = () => {
    dispatch({
      type: "error",
      message: "You need to connect your wallet to book a rental",
      title: "Booking Failed",
      position: "topL",
    });
  };

  useEffect(() => {
    async function fetchRentalList() {
      const Rentals = Moralis.Object.extend("Rentals");
      const query = new Moralis.Query(Rentals);
      query.equalTo("city", searchFilters.destination);
      query.greaterThanOrEqualTo("maxGuests_decimal", searchFilters.guests);

      const result = await query.find();

      const coords = [];
      result.forEach((e) => {
        coords.push({ lat: e.attributes.lat, lng: e.attributes.long });
      });
      setRentalsList(result);
      setCoordinates(coords);
    }
    fetchRentalList();
  }, [searchFilters, Moralis.Query, Moralis.Object]);

  const bookRental = async function (start, end, id, dayPrice) {
    for (
      var arr = [], dt = new Date(start);
      dt <= end;
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt).toISOString().slice(0, 10));
    }

    const options = {
      contractAddress: config.CONTRACT_ADDRESS,
      functionName: "addDatesBooked",
      abi: [
        {
          inputs: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "string[]",
              name: "newBookings",
              type: "string[]",
            },
          ],
          name: "addDatesBooked",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ],
      params: {
        id,
        newBookings: arr,
      },
      msgValue: Moralis.Units.ETH(dayPrice * arr.length),
    };

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        handleSuccess();
      },
      onError: (error) => {
        handleError(error.data.message);
      },
    });
  };

  return (
    <>
      <div className="topBanner">
        <div>
          <Link to="/">
            <img className="logo" src={logo} alt="logo" />
          </Link>
        </div>
        <div className="searchReminder">
          <div className="filter">{searchFilters.destination}</div>
          <div className="vl" />
          <div className="filter">
            {`
            ${searchFilters.checkIn.toLocaleString("default", {
              month: "short",
            })}
            ${searchFilters.checkIn.toLocaleString("default", {
              day: "2-digit",
            })}
            -
            ${searchFilters.checkOut.toLocaleString("default", {
              month: "short",
            })}
            ${searchFilters.checkOut.toLocaleString("default", {
              day: "2-digit",
            })}       
            `}
          </div>
          <div className="vl" />
          <div className="filter">{searchFilters.guests} guests</div>
          <div className="searchButton">
            <Icon fill="#ffffff" size={20} svg="search" />
          </div>
        </div>
        <UserActions />
      </div>
      <hr className="line" />
      <div className="rentalsContent">
        <div className="rentalsContentL">
          Stays available for your destination
          {rentalsList &&
            rentalsList.map((e, i) => (
              <div key={e.attributes.lat + "" + e.attributes.long}>
                <hr className="line2" />
                <div className={highlight === i ? "rentalDivH" : "rentalDiv"}>
                  <img
                    className="rentalImg"
                    src={e.attributes.imgUrl}
                    alt="imag"
                  />
                  <div className="rentalInfo">
                    <div className="rentalTitle">{e.attributes.name}</div>
                    <div className="rentalDesc">
                      {e.attributes.unoDescription}
                    </div>
                    <div className="rentalDesc">
                      {e.attributes.dosoDescription}
                    </div>
                    <div className="bottomButton">
                      <Button
                        text="Stay Here"
                        onClick={() => {
                          if (account) {
                            bookRental(
                              searchFilters.checkIn,
                              searchFilters.checkOut,
                              e.attributes.uid_decimal.value.$numberDecimal,
                              Number(
                                e.attributes.pricePerDay_decimal.value
                                  .$numberDecimal
                              )
                            );
                          } else {
                            handleNoAccount();
                          }
                        }}
                      />
                    </div>
                    <div className="price">
                      <Icon fill="#808080" size={10} svg="matic" />
                      {e.attributes.pricePerDay} / Day{" "}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="rentalsContentR">
          <RentalsMap locations={coordinates} setHighLight={setHighLight} />
        </div>
      </div>
    </>
  );
};

export default Rentals;
