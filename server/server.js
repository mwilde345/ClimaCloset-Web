const express = require('express');
const compression = require("compression");
const _app_folder = 'dist/climacloset';
const app = express();
// use this same port for making calls from the client side.
// in a real app, you make calls to the server with a custom endpoint. but for dev environment
// we just use different ports.
const port = 3000;
app.use(compression());
app.use(express.static(_app_folder));
// external api calls should be made by the server, not from the client side.
// suppose your domain is www.amine.com
// amine.com is the DNS name that points to a machine somewhere that is running code.
// suppose the code it is pointing to is this server.js file.
// navigating to amine.com/ gives us the index.html file because:
//  1. angular.json defines the index of the website as index.html. and we tell express to use the static files
//      contained in app_folder
//  2. that folder has the js files compiled by angular during ng build. thos js files know how to route requests, 
//      we don't need to do that here. let angular handle the routing for client pages
//      see https://jasonwatmore.com/post/2019/04/29/angular-7-tutorial-part-3-add-routing-multiple-pages
//  3. your index.html file has an <app-root> element that is being mounted from app.component.ts

// Let this express server handle the routing for api calls.
// So from your client page, your fetch calls should look like: 
/**
 * fetch('/api/test')
 * .then(data => console.log(data));
 */
// that way the server can take that request and call your special apis from the server side, it is more secure
// and also faster. to handle that request do something like:
app.get('/api/test', (req, res) => {
    // this logging statement shows up only on the running server host, not on the browser.
    console.log(`got this from the client ${req}`);
    // this is where you make your calls to external APIs.
    let myResponse = {
        importantStuff: "super cool data"
    };
    // Send the json data back to the front-end
    res.json(myResponse);
});
// make sure this goes at the end to catch all the non-existent routes
app.get('*', (req, res) => {
    res.send('Route does not exist');
});


app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
module.exports = app;