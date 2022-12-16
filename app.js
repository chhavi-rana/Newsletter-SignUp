const express = require('express');
const bodyParser = require("body-parser")
const https = require('https');
const mailchimp = require("@mailchimp/mailchimp_marketing");
require('dotenv').config()

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/" + "signUp.html");
});

app.post("/", function(req, res){
    // console.log(req.body.FirstName);
    // console.log(req.body.LastName);
    // console.log(req.body.dateOfBirth);
    // console.log(req.body.emailId);
    // console.log(req.body.contactNumber);
    // console.log(req.body.inlineRadioOptions);

    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const email = req.body.emailId;
    
    const listId = "53cdb2b641";

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsondata = JSON.stringify(data);
    console.log(jsondata);

    const url = "https://us21.api.mailchimp.com/3.0/lists/53cdb2b641";
    

    const options = {
        method: "POST",
        auth: "chhavi:" + process.env.API_KEY +""
    }

    const request = https.request(url, options, function(response){
        response.on("data", function(data){
            console.log(JSON.parse(data));
            
        })
        
        if(response.statusCode == 200){
            res.sendFile(__dirname + "/" + "success.html")
        }else{
            res.sendFile(__dirname + "/" + "failure.html")
        }
    });

    request.write(jsondata);
    request.end();
});

app.post("/failure.html", function(req, res){
    res.redirect("/")
});


app.listen(process.env.PORT || 3000, function(){
    console.log("Server running at 3000");
});

