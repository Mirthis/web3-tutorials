import React from "react";
import { Icon, Modal, Form, useNotification } from "web3uikit";
import { useState } from "react";
import { useWeb3ExecuteFunction } from "react-moralis";
import config from "../utils/config";

function AddRental({ account }) {
  const [isVisible, setVisible] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();
  const dispatch = useNotification();

  const handleSubmit = (data) => {
    console.log("Submitting");
    console.log(data);

    const values = data.reduce(
      (obj, cur) => ({ ...obj, [`${cur.inputName}`]: cur.inputResult }),
      {}
    );

    values["Max Guests"] = Number(values["Max Guests"]);
    values["Price per day"] = Number(values["Price per day"]);
    values["datesBooked"] = [];

    createRental(...Object.values(values));
  };

  const handleSuccess = () => {
    dispatch({
      type: "success",
      message: `Rental property added. It may take few minutes to show up, due to blockchain syncing time`,
      title: "Booking succesful",
      position: "topL",
    });
    setVisible(false);
  };

  const handleError = (msg) => {
    dispatch({
      type: "error",
      message: msg,
      title: "Rental creation failed!",
      position: "topL",
    });
  };

  const createRental = async function (
    name,
    city,
    lat,
    long,
    unoDescription,
    dosDescription,
    imgUrl,
    maxGuests,
    pricePerDay,
    datesBooked = []
  ) {
    const options = {
      contractAddress: config.CONTRACT_ADDRESS,
      functionName: "addRentals",
      abi: [
        {
          inputs: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "city",
              type: "string",
            },
            {
              internalType: "string",
              name: "lat",
              type: "string",
            },
            {
              internalType: "string",
              name: "long",
              type: "string",
            },
            {
              internalType: "string",
              name: "unoDescription",
              type: "string",
            },
            {
              internalType: "string",
              name: "dosDescription",
              type: "string",
            },
            {
              internalType: "string",
              name: "imgUrl",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "maxGuests",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "pricePerDay",
              type: "uint256",
            },
            {
              internalType: "string[]",
              name: "datesBooked",
              type: "string[]",
            },
          ],
          name: "addRentals",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      params: {
        name,
        city,
        lat,
        long,
        unoDescription,
        dosDescription,
        imgUrl,
        maxGuests,
        pricePerDay,
        datesBooked,
      },
      //msgValue: Moralis.Units.ETH(dayPrice * arr.length),
    };

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        handleSuccess();
      },
      onError: (error) => {
        handleError(error);
      },
    });
  };

  return (
    <>
      <div onClick={() => setVisible(true)} className="addRentalsButton">
        <Icon fill="#eb4e5f" size={20} svg="plus" />
      </div>

      <Modal
        onCloseButtonPressed={() => setVisible(false)}
        hasFooter={false}
        title="Add a new rental"
        isVisible={isVisible}
      >
        <Form
          buttonConfig={{
            text: "Create Rental",
            theme: "primary",
          }}
          data={[
            {
              inputWidth: "100%",
              name: "Name",
              type: "text",
              validation: {
                required: true,
              },
              value: "",
            },
            {
              inputWidth: "100%",
              name: "City",
              type: "text",
              validation: {
                required: true,
              },
              value: "",
            },
            {
              name: "Latitude",
              type: "text",
              // type: "number",
              validation: {
                // numberMax: 90,
                // numberMin: -90,
                required: true,
              },
              value: "",
            },
            {
              name: "Longitude",
              type: "text",
              // type: "number",
              validation: {
                // numberMax: 180,
                // numberMin: -180,
                required: true,
              },
              value: "",
            },
            {
              inputWidth: "100%",
              name: "Description 1",
              type: "text",
              validation: {
                required: true,
              },
              value: "",
            },
            {
              inputWidth: "100%",
              name: "Description 2",
              type: "text",
              validation: {
                required: true,
              },
              value: "",
            },
            {
              inputWidth: "100%",
              name: "Image URL",
              type: "text",
              validation: {
                required: true,
              },
              value: "",
            },
            {
              inputWidth: "100%",
              name: "Max Guests",
              type: "number",
              validation: {
                required: true,
              },
              value: "",
            },
            {
              inputWidth: "100%",
              name: "Price per day",
              type: "number",
              validation: {
                required: true,
              },
              value: "",
            },
          ]}
          onSubmit={(obj) => handleSubmit(obj.data)}
        />
      </Modal>
    </>
  );
}

export default AddRental;
