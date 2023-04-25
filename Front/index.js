const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'public', 'html'));

app.use('/node_modules', express.static(__dirname + '/node_modules'));

// Serve Bootstrap files
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

// Serve front-end files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/dashboard', function(req, res) {
    res.render('dashboard');
  });

// Start server
app.listen(3000, function() {
    console.log('Server is listening on port 3000');
});