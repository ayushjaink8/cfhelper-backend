// import axios from "axios";
const axios = require("axios");
const { CF_API_URL } = require("../config/constants");

// import { CF_API_URL } from "../config/constants";

async function sleep(timeInMilliSeconds) {
  return new Promise((resolve) => setTimeout(resolve, timeInMilliSeconds));
}

const makeCodeforcesRequest = async (config) => {
  let tries = 0;
  let errorMsg = null;
  while (tries < 5) {
    tries += 1;
    try {
      const data = await axios
        .request(config)
        .then((response) => {
          if (response.data && response.data.status === "OK") {
            return { status: "OK", data: response.data };
          } else {
            return {
              status: "FAILED",
              error:
                errorMsg || "Unable to fetch data. Codeforces API may be down.",
            };
          }
        })
        .catch((error) => {
          errorMsg = error.message.toString();
        });

      
      if (data.status && data.status === "OK") return data;
      await sleep(500);
    } catch (error) {
      errorMsg = error.message.toString();
    }
  }
  return {
    status: "FAILED",
    error: errorMsg || "Unable to fetch data. Codeforces API may be down.",
  };
};



function parseDeltas(data) {

  var results = [];

  for (var i = 0; i < data.result.length; i++) {
    var handle = data.result[i].handle;
    if(handle){
      var delta = data.result[i].newRating - data.result[i].oldRating;
      var rank = data.result[i].rank;
      var seed = data.result[i].seed;
  
      var res = {
        handle: handle,
        delta : parseInt(delta),
        seed : parseInt(seed),
        rank : parseInt(rank)
      };

      if(res) {
        results.push(res);
      }
    }
  }
  
  return results;
}

async function getDeltas(contestId, contestantsHandles) {

  if(!contestantsHandles==[]){
    contestantsHandles = ['ayushjaink8']
  }
  var herokuServerNew = "https://cf-predictor.herokuapp.com/";
  var pageNew = "GetPartialRatingChangesServlet?contestId=" + contestId + "&handles="+contestantsHandles.join(",");
  var serverNew = herokuServerNew + pageNew;

  const res = await makeCodeforcesRequest({
    method: "get",
    url: serverNew
  });

  if (res && res.status && res.status === "OK") {
    if(res.data.status && res.data.status === "FAIL"){
      return {
        status: "FAILED",
        error: "Contest ID is invalid."
      }
    }
    return parseDeltas(res.data);
  }
  if (res && res.error) {
    return {
      status: "FAILED",
      error: res.error,
    };
  }

  return {
    status: "FAILED",
    error: `Unable to fetch the data from the API.`,
  };

}


async function getAllDeltas(contestId) {

  if(!contestId){
    return {
      status: "FAILED",
      error: "Contest ID field should not be empty."
    }
  }

  var herokuServerOld = "https://cf-predictor-frontend.herokuapp.com/";
  var pageOld = "GetNextRatingServlet?contestId=" + contestId;
  var serverOld = herokuServerOld + pageOld;


  const res = await makeCodeforcesRequest({
    method: 'get',
    url: serverOld
  });

  if (res && res.status && res.status === "OK") {
    if(res.data.status && res.data.status === "FAIL"){
      return {
        status: "FAILED",
        error: "Contest ID is invalid."
      }
    }
    return {
      status: "OK",
      data: parseDeltas(res.data)
    }
  }
  if (res && res.error) {
    return {
      status: "FAILED",
      error: res.error,
    };
  }

  return {
    status: "FAILED",
    error: `Unable to fetch the data from the API.`,
  };
}


async function getContestList() {

  const res = await makeCodeforcesRequest({
    method: "get",
    url: CF_API_URL + '/contest.list/'
  });

  if (res && res.status && res.status === "OK") return res.data;
  if (res && res.error) {
    return {
      status: "FAILED",
      error: res.error,
    };
  }

  return {
    status: "FAILED",
    error: `Unable to fetch the data from the API.`,
  };
}



const predictRatingService = {
  getAllDeltas,
  getDeltas,
  getContestList
};

module.exports = predictRatingService
