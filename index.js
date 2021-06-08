const express = require("express")
const app = express()
app.use(express.json())
const cors = require("cors")
app.use(cors())
var nodemailer = require('nodemailer')
var hbs = require('nodemailer-express-handlebars')
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var fs = require('fs');
let port = process.env.PORT || 6000

app.get("/", (req, res) => {
    res.send('App Started')
    console.log('App Started');
})

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: '404mkhacks@gmail.com',
//         pass: 'Meiy@#799'
//     }
// })

// transporter.use('compile', hbs({
//     viewEngine: 'express-handlebars',
//     viewPath: './templates/'
// }))

//POST::sendMail
// app.post("/sendMail", (req, res) => {
//     console.log(req.body.email)
//         // Mailer options
//     var mailOptions = {
//         from: '404mkhacks@gmail.com',
//         to: req.body.email,
//         subject: 'Mailer',
//         text: req.body.email,
//         template: 'tempCheck'
//             //html: '<b>Hello Mei</b>'
//     };
//     transporter.sendMail(mailOptions, function(error, info) {
//         if (error) {
//             res.send("Error: " + info)
//             console.log(error);
//         } else {
//             res.send('Email sent ✔ : ' + info.response)
//             console.log('Email sent ✔ : ' + info.response);
//         }
//     });
// })
var readHTMLFile = function(path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function(err, html) {
        if (err) {
            throw err;
            callback(err);
        } else {
            callback(null, html);
        }
    });
};
smtpTransport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: '404mkhacks@gmail.com',
        pass: 'Meiy@#799'
    }
}));
//POST - SendCallLetter
app.post("/SendCallLetter", (req, res) => {
    console.log(req.body.name)
    readHTMLFile(__dirname + '/templates/template.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            "Applicant": req.body.name
        }
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: '404mkhacks@gmail.com',
            to: req.body.email,
            subject: 'Welcome to CB',
            //text: req.body.email,
            html: htmlToSend,
            attachments: [{
                filename: 'OfferLetter.pdf',
                path: __dirname + '/assets/OfferLetter.pdf',
                contentType: 'application/pdf'
            }]
        };
        smtpTransport.sendMail(mailOptions, function(error, response) {
            if (error) {
                res.send("Error: " + info)
                console.log(error)
                callback(error)
            } else {
                res.send('Email sent ✔ : ' + response.response)
                console.log('Email sent ✔ : ' + response.response);
            }
        });
    });
})


//Port Specification
app.listen(port)
console.log("App runs at ", port)