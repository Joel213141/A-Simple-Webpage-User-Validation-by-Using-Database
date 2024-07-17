
var express = require('express');

var app = express();
var sqlite3 = require('sqlite3').verbose();

// persistent file database "myDB".
var db = new sqlite3.Database('playerDB');

//now any files in public are routed
app.use(express.static('public'));

//Here we are configuring express to use body-parser as middle-ware.
app.use(express.urlencoded({ extended: false }));

// REST endpoint for posting a new user
app.post('/users', function (req, res, next) {
    let name = req.body.name;
    let thepass = req.body.password;
    let html='';
    let exist =false;

    html += '<!doctype html><html lang="en">';
    html += '<head>';
    html += '<title>Bootstrap Express/SQLite3 Demo</title>';
    html += '<meta charset="utf-8">';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">';
    html += '<link rel="stylesheet"';
    html += '  href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"';
    html += '  integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"';
    html += '  crossorigin="anonymous">';
    html += '</head>';
    db.all('SELECT * FROM User', function (err, rows) {
        if (err) {
            return console.error(err.message);
        }
        else {
            rows.forEach(function (row) {
                if (name ==row.username && thepass == row.password) {

                    html += '<body><div class="container">';
                    html += '<h3> Login Successful </h3>';
                    html += '<p> Thank you <strong>' + row.fullname + '</strong> (username : <strong>'+ row.username + '</strong>) your login has been successful.' + '</p>';
                    html += '<p> Our record shows that you have purhased a total of <strong>' + (row.instore + row.delivered) + '</strong> pizzas from dkin Pizza. </p>'; 
                    html += '<div><p> Your purchase breakdowns are:</p>';
                    html += '<ul>';
                    html += '<li>INSTORE = <strong>'+ row.instore + '</strong></li>';
                    html += '<li>DELIVERED = <strong>'+ row.delivered + '</strong></li>';
                    html += '<li>VOUCHERS = <strong>'+ row.vouchers + '</strong></li></ul>';
                    html += '<p> Have a great day! </p>';
                    html += '</div></body>';
                    html += '</html>';
                    exist = true;
                }
            
            })

        }

        if(exist == false) {
            html += '<body><div class="container">';
            html += '<h3> Login Failed </h3>';
            html += '<p> The <em>username </em> and <em> password </em> does not match our record.';
            html += '</div></body>';
            html += '</html>';
        }
        res.send(html);
    })
})


    // REST endpoint for getting all user data
    app.get('/users', function (req, res) {
        let html = '';

        // Display a web page table

        html += '<!doctype html><html lang="en">';
        html += '<head>';
        html += '<title>Bootstrap Express/SQLite3 Demo</title>';
        html += '<meta charset="utf-8">';
        html += '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">';
        html += '<link rel="stylesheet"';
        html += '  href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"';
        html += '  integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"';
        html += '  crossorigin="anonymous">';
        html += '</head>';

        html += '<body><div class="container">';
        html += '<h3> The User Information Table </h3>';
        html += '<table class="table">';
        html += '<thead class="thead-dark"><tr>';
        html += '<th>Name</th><th>Title</th><th>Comment</th><th>Email</th>';
        html += '<tr></thead><tbody>';
        // Retrieve data from table User on the server 
        // and display it in a web page table structure
        db.all('SELECT * FROM User', function (err, rows) {
            if (err) {
                return console.error(err.message);
            }
            if (rows.length === 0) {
                console.log("Array is empty!")
                html += '<tr><td colspan="4"> No data found </td></tr>';
            } else {
                rows.forEach(function (row) {
                    html += '<tr>';
                    html += '<td>' + row.password + '</td>';
                    html += '<td>' + row.username + '</td>';
                    html += '<td>' + row.instore + '</td>';
                    html += '<td>' + row.delivered + '</td></tr>';
                });
            }

            html += '</tbody></table>';
            html += '</div>';
            html += '</body></html>';
            res.send(html);
        })
    })

    // create a Node.js server that listens on port 3000.
    app.listen(3000, function () {
        console.log('App listening on port 3000!');
        console.log('To quit press Ctrl + C');
    })