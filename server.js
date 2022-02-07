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
const test_data = {
  data: [
    { name: "Joe", age: 29 },
    { name: "Casper", age: 45 },
  ],
};
console.log("server js talking.. ");

function normedLuis_Date(date_string, whichTime) {
  // console.log(`${date_string}`); // 2020-01-01
  let os = `${date_string}`; // format for luis date new Date("YYYY", "MM", -29)
  let date_result;
  if (whichTime == "parsedValue") {
    alert("parsedValue");
    let month = os.substring(4, 7);
    let year = os.substring(11, 15);
    let ds = `${year}-${month}-21`;
    // console.log("ds for luis date ", ds);
    date_result = new Date(ds);
  } else if (whichTime == "timex") {
    alert("timex"); // format for luis date new Date("YYYY", "11", -29)
    let month = os.substring(5, 7);
    let year = os.substring(0, 4);
    // console.log(month, year);
    date_result = new Date(parseInt(year), parseInt(month), -29);

    // console.log(date_result);
  }

  return date_result;
  return date_result.getTime();
}
function normedDBDate(db_date) {
  // console.log("dbdate", db_date); // format for db date --> new Date("Month YYYY")
  let year = parseInt(db_date.substring(4, 6));
  let month = db_date.substring(0, 3); // 3 char month abbreviations July = Jul
  // console.log(month, year, "format we want: ", `new Date("Month YYYY")`);
  let res;
  // case 21 for 20 20s
  // case 19 for 20 10s
  // case 07 for 20 00s
  // case 00 for 20 00s
  // case 99 for 19 00s
  // case 89 for 19 00s
  // return `20${year}`;

  if (year <= 99 && year >= 50) {
    // prepend 19 to year
    res = `19${year}`;
  }
  if (year <= 50) {
    // prepend 19 to year
    res = `20${year}`;
  }
  // console.log("dbdate before output = ", `${month} and ${res}`);
  let output = new Date(`${month}, ${res}`);
  // console.log(output.getTime);

  return `${output}`;
}

const root = {
  test_data: (args) => {
    console.log(args, test_data);
    return test_data.data.find((ch) => ch.name == args.name);

    return args;
  },
  characters: (args) => {
    console.log(characters);
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
  categories: (args) => {
    // console.log("line 91 args", args);
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
          daterange: "",
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
          // console.log(key, value);
          if (
            args[key] &&
            args[key].toLowerCase().trim() !== cat[value].toLowerCase().trim()
          ) {
            return false;
          } else {
            if (key == "daterange") {
              console.log("daterange ! ", args[key], cat[value]);
              // root.categoriesv2(args);
            }
            return true;
          }
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
  categoriesv2: (args) => {
    console.log("categoriesv2 ", args);
    console.log(JSON.parse(args.daterange));
    let start = new Date(JSON.parse(args.daterange).start);
    let end = new Date(JSON.parse(args.daterange).end);
    let dbdate;

    let result = categories.slice(args.offset, args.offset + args.limit);
    // console.log(result);

    // should return a range of dates given by args start and end
    let list = result
      .filter((k) => {
        dbdate = new Date(normedDBDate(k["Actual Period"]));
        // console.log(
        //   "start ",
        //   new Date(start),
        //   "end ",
        //   new Date(end),
        //   "dbdate ",
        //   new Date(dbdate)
        // );
        let isWithinRange = dbdate <= end && dbdate >= start;
        let isNameMatched =
          args.name.toLowerCase().trim() ==
          k["Name of Sub Category"].toLowerCase().trim();
        let isRegionMatched =
          args.region.toLowerCase().trim() == k["Region"].toLowerCase().trim();

        // if (!isWithinRange) {
        //   return false;
        // }
        if (!isNameMatched) {
          return false;
        } else if (!isRegionMatched) {
          return false;
        } else if (!isWithinRange) {
          return false;
        }
        return true;
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

    console.log({
      count: list.length,
      category: list,
    });
    return {
      count: list.length,
      category: list,
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
// app.listen(4000);
app.listen(process.env.PORT || 4000);

// console.log(luisdate_start, luisdate_end)
// console.log(new Date(luisdate_start).getTime(), new Date(luisdate_end).getTime())
// let start:any = new Date(luisdate_start).getTime()
// let end:any = new Date(luisdate_end).getTime();
// let range_of_dates_requested = this.periodList.filter((k:any)=> {
//   let convertedTime = new Date(k).getTime();
//   return convertedTime >= start && convertedTime <= end;
// })
// console.log(range_of_dates_requested)

// if(this.periodList.indexOf(`${luisdate_start}`) === 0){
//   const monthNames = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "July",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];
//   console.log(monthNames[new Date(`${luisdate_start}`).getMonth()], new Date(`${luisdate_start}`).getFullYear());
//   let month = monthNames[new Date(`${luisdate_start}`).getMonth()];
//   let year = `${new Date(`${luisdate_start}`).getFullYear()}`.substring(2,4)
//   date_reconstruct = `${month}-${year}`;
//   console.log(date_reconstruct)
// }
