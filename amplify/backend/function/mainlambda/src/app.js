/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const axios = require("axios");
//const { get } = require("lodash");
// declare a new express app

const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/**********************
 * Example get method *
 **********************/

app.get("/item", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

app.get("/item/*", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

/****************************
 * Example post method *
 ****************************/

app.post("/flightoffers", function (req, res) {
  // Add your code here
  const { data, token } = req.body;
  console.log("data, token", data, token);
  // const trip = JSON.parse(data).trip;
  const config = {
    method: "post",
    url: "https://test.api.amadeus.com/v2/shopping/flight-offers",
    headers: {
      "Content-Type": "application/json",
      "X-HTTP-Method-Override": "GET",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };
  // @ts-ignore
  axios(config)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      {
        console.log("error", error.response);
        res.status(400).json(error.response.data);
      }
    });

  // res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

app.post("/flightofferpricing", function (req, res) {
  // Add your code here
  const { data, token } = req.body;
  console.log("data, token", data, token);
  // const trip = JSON.parse(data).trip;
  const config = {
    method: "post",
    url: "https://test.api.amadeus.com/v1/shopping/flight-offers/pricing?include=detailed-fare-rules&forceClass=false",
    headers: {
      "Content-Type": "application/json",
      "X-HTTP-Method-Override": "GET",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };
  // @ts-ignore
  axios(config)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      {
        console.log("error", error.response);
        res.status(400).json(error.response.data);
      }
    });

  // res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

app.post("/createorder", function (req, res) {
  // Add your code here
  const { data, token } = req.body;
  console.log("data, token", data, token);
  // const trip = JSON.parse(data).trip;
  const config = {
    method: "post",
    url: "https://test.api.amadeus.com/v1/booking/flight-orders",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };
  // @ts-ignore
  axios(config)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      {
        console.log("error", error.response);
        res.status(400).json(error.response.data);
      }
    });

  // res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

app.post("/item/*", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example put method *
 ****************************/

app.put("/item", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.put("/item/*", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example delete method *
 ****************************/

app.delete("/item", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.delete("/item/*", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
