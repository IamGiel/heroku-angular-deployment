const express = require("express");
const path = require("path");
// const app = express();

const cors = require("cors");
const { json } = require("body-parser");
const fs = require("fs");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const parse = require("csv-parse/lib/sync");
const res = require("express/lib/response");
const axios = require("axios");

const app = express().use(cors()).use(json());
app.use(express.static(__dirname + "/dist/heroku-angular"));
app.get("/home", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/heroku-angular/index.html"));
});
const schema = buildSchema(fs.readFileSync("./schema/schema.graphql", "utf8"));
const characters = parse(
  fs.readFileSync("./kaggle-csv-files/characters.csv", "utf8"),
  {
    columns: true,
  }
);
const species = parse(
  fs.readFileSync("./kaggle-csv-files/species.csv", "utf8"),
  {
    columns: true,
  }
);
const categories = parse(
  fs.readFileSync(
    "./kaggle-csv-files/MMD_Data_Capture_Sheet_25th_Nov_2021_Final.csv",
    "utf8"
  ),
  {
    columns: true,
  }
);
const root = {
  characters: (args) => {
    return {
      count: characters.length,
      characters: characters.slice(args.offset, args.offset + args.limit),
    };
  },
  character: (args) => {
    return characters.find((ch) => ch.name === args.name);
  },
  species: (args) => {
    return species.find((ch) => ch.name === args.name);
  },
  // categories: (args) => {
  //   let result = categories.slice(args.offset, args.offset + args.limit);
  //   let output = returnMatch(result, args);
  //   // let final = result
  //   //   .filter((f, i) => {
  //   //     console.log(i);
  //   //     // console.log(f["Name of Sub Category"]),
  //   //     // console.log(f["Actual Period"]),
  //   //     // console.log(f["Market Overview"]),
  //   //     // console.log(f["Name of Category"]),
  //   //     // console.log(f["Guidance"]),
  //   //     // console.log(f["Grade ID"]),
  //   //     // console.log(f["Grade"]),
  //   //     // console.log(f["Region"]),
  //   //     // console.log(f["Price Point "]),
  //   //     // console.log(f["Currency"]),
  //   //     // console.log(f["Unit"]);
  //   //     console.log("==================== end ===============");

  //   //   })

  //   //   .map((k, i) => {
  //   //     // console.log("THESE K after filter >>>>>> ", k);
  //   //     return {
  //   //       Name_of_Sub_Category: k["Name of Sub Category"],
  //   //       Actual_Period: k["Actual Period"],
  //   //       Market_Overview: k["Market Overview"],
  //   //       Name_of_Category: k["Name of Category"],
  //   //       Guidance: k["Guidance"],
  //   //       Grade_ID: k["Grade ID"],
  //   //       Grade: k["Grade"],
  //   //       Region: k["Region"],
  //   //       Price_Point: k["Price Point "],
  //   //       Currency: k["Currency"],
  //   //       Unit: k["Unit"],
  //   //     };
  //   //   });
  //   return {
  //     count: output.length,
  //     category: output,
  //   };
  // },
  categories: (args) => {
    console.log("line 91 args", args);
    let result = categories.slice(args.offset, args.offset + args.limit);

    let final = result
      .filter((cat) => {
        const fields = {
          guidance: "Guidance",
          Grade_ID: "Grade ID",
          name: "Name of Sub Category",
          period: "Actual Period",
          region: "Region",
          grade: "Grade",
        };
        // console.log(Object.entries(fields));
        // [
        //   [ 'guidance', 'Guidance' ],
        //   [ 'Grade_ID', 'Grade ID' ],
        //   [ 'name', 'Name of Sub Category' ],
        //   [ 'period', 'Actual Period' ]
        // ]
        return Object.entries(fields).every(([key, value]) => {
          // args[key] is the user input
          // console.log("args[key] ", args[key], "cat[value] ", cat[value]);
          if (
            args[key] &&
            args[key].toLowerCase().trim() !== cat[value].toLowerCase().trim()
          ) {
            if (args[key] === cat[value]) {
              console.log("check same ? ", args[key], cat[value]);
            }
            return false;
          }
          return true;
        });
      })
      .map((k, i) => {
        // console.log("THESE K after filter >>>>>> ", k["Region"]);
        return {
          Name_of_Sub_Category: k["Name of Sub Category"],
          Actual_Period: k["Actual Period"],
          Market_Overview: k["Market Overview"],
          Name_of_Category: k["Name of Category"],
          Guidance: k["Guidance"],
          Grade_ID: k["Grade ID"],
          Grade: k["Grade"],
          Region: k["Region"],
          Price_Point: k["Price Point "],
          Currency: k["Currency"],
          Unit: k["Unit"],
        };
      });

    console.log(final.length);

    return {
      count: final.length,
      category: final,
    };
  },
  categories2: (args) => {
    console.log("line 91 args", args);
    let result = categories.slice(args.offset, args.offset + args.limit);

    let final = result
      .filter((cat) => {
        const fields = {
          guidance: "Guidance",
          Grade_ID: "Grade ID",
          name: "Name of Sub Category",
          period: "Actual Period",
          region: "Region",
          grade: "Grade",
        };
        // console.log(Object.entries(fields));
        // [
        //   [ 'guidance', 'Guidance' ],
        //   [ 'Grade_ID', 'Grade ID' ],
        //   [ 'name', 'Name of Sub Category' ],
        //   [ 'period', 'Actual Period' ]
        // ]
        return Object.entries(fields).every(([key, value]) => {
          // args[key] is the user input
          // console.log("args[key] ", args[key], "cat[value] ", cat[value]);
          if (
            args[key] &&
            args[key].toLowerCase().trim() !== cat[value].toLowerCase().trim()
          ) {
            if (args[key] === cat[value]) {
              console.log("check same ? ", args[key], cat[value]);
            }
            return false;
          }
          return true;
        });

        // if (args.guidance && args.guidance !== cat.Guidance) {
        //   return false;
        // }

        // if (args.Grade_ID && args.Grade_ID !== cat["Grade ID"]) {
        //   return false;
        // }

        // if (args.name && args.name !== cat["Name of Sub Category"]) {
        //   return false;
        // }

        // if (args.period && args.period !== cat["Actual Period"]) {
        //   return false;
        // }

        // return true;

        // if (
        //   !args.guidance &&
        //   !args.Grade_ID &&
        //   cat["Name of Sub Category"].toLowerCase().trim() ===
        //     args.name.toLowerCase().trim() &&
        //   cat["Actual Period"].toLowerCase().trim() ===
        //     args.period.toLowerCase().trim()
        // ) {
        //   console.log("scena A");
        //   return cat;
        // }

        // if (
        //   args.guidance &&
        //   !args.Grade_ID &&
        //   cat["Name of Sub Category"].toLowerCase().trim() ===
        //     args.name.toLowerCase().trim() &&
        //   cat["Actual Period"].toLowerCase().trim() ===
        //     args.period.toLowerCase().trim() &&
        //   args.guidance === cat["Guidance"]
        // ) {
        //   console.log("scena B-a");
        //   return cat;
        // }

        // if (
        //   !args.guidance &&
        //   args.Grade_ID &&
        //   cat["Name of Sub Category"].toLowerCase().trim() ===
        //     args.name.toLowerCase().trim() &&
        //   cat["Actual Period"].toLowerCase().trim() ===
        //     args.period.toLowerCase().trim() &&
        //   args.Grade_ID === cat["Grade ID"]
        // ) {
        //   console.log("scena B-b");
        //   return cat;
        // }

        // if (
        //   args.guidance &&
        //   args.Grade_ID &&
        //   cat["Name of Sub Category"].toLowerCase().trim() ===
        //     args.name.toLowerCase().trim() &&
        //   cat["Actual Period"].toLowerCase().trim() ===
        //     args.period.toLowerCase().trim() &&
        //   args.Grade_ID === cat["Grade ID"] &&
        //   args.guidance === cat["Guidance"]
        // ) {
        //   console.log("scena B-b");
        //   return cat;
        // }
      })
      .map((k, i) => {
        // console.log("THESE K after filter >>>>>> ", k["Region"]);
        return {
          Name_of_Sub_Category: k["Name of Sub Category"],
          Actual_Period: k["Actual Period"],
          Market_Overview: k["Market Overview"],
          Name_of_Category: k["Name of Category"],
          Guidance: k["Guidance"],
          Grade_ID: k["Grade ID"],
          Grade: k["Grade"],
          Region: k["Region"],
          Price_Point: k["Price Point "],
          Currency: k["Currency"],
          Unit: k["Unit"],
        };
      });

    console.log(final.length);

    return {
      count: final.length,
      category: final,
    };
  },
  category: (args) => {
    return finArr.find((ch) => ch.name === args.name);
  },
};

// ABi training
// addUtterance("can you give the price for a lawyer in UK?", "skillPrice");
// trainBot("what is the price of corn in india?");

function addUtterance(utterance, intentName) {
  var raw = JSON.stringify({
    applicationName: "PriceCostInfo",
    intentName: intentName,
    intentType: "TEXT",
    kbId: "PgrzMKQsHIq0PkkBzCxqN",
    utteranceText: utterance,
  });

  const headers = {
    "Content-Type": "application/json",
    Authorization:
      "AAABogECAQB4lO5qrMbBPYllyByB6U98HpyJ7eWikC9ICFdAdnZ+Co8BEfAIXqvl78az3io5atIoPgAAAWgwggFkBgkqhkiG9w0BBwagggFVMIIBUQIBADCCAUoGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMWAXfsfjIWH2DTBQgAgEQgIIBGylez8PbYhQd007eiuOgATchng1MHqEYqhLZMv4v6rxFI49LJJITtW/uYfumlq+OPlSXoAsMA70RbzrwFvhQO6faC8yWul9YYFQU04ZA/Ttqgs78WF2wzEWVBhmCDpnjW99+J4eoQLfzzRcWH5dmsgZKGoVORaVidKs90KkBAHeYdLovwOkAuCnXoRB44hcFQTE1geJil+/R65Trc7LuSI5I1MK7F/tQ6odYr2C2dYvkz2Xt9VcTUhK4FQ5cmxVwmZwPs+laHTGA0kdIdVO6F301Z77AoQMmSxsJRswbYLr4sq/M5X4Vh2odckwceoILXxpLpZ98ZFAp73sNR4cRfZhot0qBRjSb+0sfuIOjH29aIFRJeHNqAQZvpnIAAAFFZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk52ZFc1MFNXUWlPaUl4T1dGaE5EVmtaUzB4T0RNMExUUXhPV1l0T1RWa1pTMDVOVFV6Tm1ZellqazVOREFpTENKMWMyVnlTV1FpT2lJMk5UTmlNRFEzWmkwMU5tRTNMVFEwTVRjdFlUUXhOQzFrWkRKa1lqUXlOR1prWkRJaUxDSnliMnhsSWpvaVFVUk5TVTRpTENKaGRYUm9WRzlyWlc0aU9pSm1OalJpTjJOaE9DMWpOak5oTFRSa1pUa3RPRGRrTXkweE9XTTJNVEUzT0RNeE1EWWlMQ0pwWVhRaU9qRTJNemcwTURjMk9ERjkuX05TVmNTTmo4UGN5ajRIUlVGc2IxY3JCN01HRkFKTUVDcnpDNzlCY3ZyOA==",
  };
  const api_url = "https://nlu.staging.api.onereach.ai/knowledge-base/pair";

  axios
    .post(api_url, raw, {
      headers: headers,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}
function trainBot(utterance) {
  let data = JSON.stringify({
    appId: "4597897d-addf-46cd-9849-87a123cf7e26",
    kbId: "PgrzMKQsHIq0PkkBzCxqN",
    q: utterance,
  });

  let config = {
    method: "post",
    url: "https://nlu.staging.api.onereach.ai/meaning/test",
    headers: {
      Authorization:
        "AAABogECAQB4lO5qrMbBPYllyByB6U98HpyJ7eWikC9ICFdAdnZ+Co8BEfAIXqvl78az3io5atIoPgAAAWgwggFkBgkqhkiG9w0BBwagggFVMIIBUQIBADCCAUoGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMWAXfsfjIWH2DTBQgAgEQgIIBGylez8PbYhQd007eiuOgATchng1MHqEYqhLZMv4v6rxFI49LJJITtW/uYfumlq+OPlSXoAsMA70RbzrwFvhQO6faC8yWul9YYFQU04ZA/Ttqgs78WF2wzEWVBhmCDpnjW99+J4eoQLfzzRcWH5dmsgZKGoVORaVidKs90KkBAHeYdLovwOkAuCnXoRB44hcFQTE1geJil+/R65Trc7LuSI5I1MK7F/tQ6odYr2C2dYvkz2Xt9VcTUhK4FQ5cmxVwmZwPs+laHTGA0kdIdVO6F301Z77AoQMmSxsJRswbYLr4sq/M5X4Vh2odckwceoILXxpLpZ98ZFAp73sNR4cRfZhot0qBRjSb+0sfuIOjH29aIFRJeHNqAQZvpnIAAAFFZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk52ZFc1MFNXUWlPaUl4T1dGaE5EVmtaUzB4T0RNMExUUXhPV1l0T1RWa1pTMDVOVFV6Tm1ZellqazVOREFpTENKMWMyVnlTV1FpT2lJMk5UTmlNRFEzWmkwMU5tRTNMVFEwTVRjdFlUUXhOQzFrWkRKa1lqUXlOR1prWkRJaUxDSnliMnhsSWpvaVFVUk5TVTRpTENKaGRYUm9WRzlyWlc0aU9pSm1OalJpTjJOaE9DMWpOak5oTFRSa1pUa3RPRGRrTXkweE9XTTJNVEUzT0RNeE1EWWlMQ0pwWVhRaU9qRTJNemcwTURjMk9ERjkuX05TVmNTTmo4UGN5ajRIUlVGc2IxY3JCN01HRkFKTUVDcnpDNzlCY3ZyOA==",
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data, null, 4));
      return JSON.stringify(response.data, null, 4);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// trainBot("nylon prices in japan");
// add synonyms to categoryList
function addSynonyms() {
  let listEntities = [
    {
      name: "CategoryListEntity",
      subLists: [
        {
          canonicalForm: "Beverage Cans",
          list: ["beverage can"],
        },
        {
          canonicalForm: "Copper and Copper Semis",
          list: [],
        },
      ],
    },
  ];
}

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

// app.listen(process.env.PORT || 8080, () => {
//   console.log("running in port ", 8080);
// });
app.listen(4000);
