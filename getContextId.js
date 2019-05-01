const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const request = require('request');

var getContext = (token_id,call) => {
    request({
      url: 'https://api.api.ai/v1/contexts?sessionId=tabby_cat',
      qs: {access_token: 'EAALm6QPGCWwBAHLhBOAs1T7ZBWblYzBOU7dRnc8ZBfwp2orw9hZCZBrtGOFUzZA96wusev3KH8Sw46hlH9swZBohjLbbfwDP3bDA6TNinldaQXhfJGurCsKBaWcM0iHTAsevWR5VmSG3NAHRHnpvaazhGAG79ct9nqax1kOyA6OgZDZD'},
      Accept: 'application/js',
      ContentType: 'application/json',
      Authorization: 'Bearer ' + token_id,
      method: 'GET'
      }, (error, response, body) => {
        if (response.statusCode == 200) {
          console.log(JSON.stringify(body));
          return call(body);
        }  if (error) {
            console.log('Error sending message: ', error);
          } else if (response.body.error) {
            console.log('Error: ', response.body.error);
            }
      }
    )
}

module.exports = getContext;
