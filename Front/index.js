const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'public', 'html'));

app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/popper', express.static(__dirname + '/node_modules/popper.js/dist/umd/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));


app.use(express.static(path.join(__dirname, 'public')));

app.get('/dashboard', function(req, res) {
    res.render('dashboard');
  });

app.listen(PORT, function() {
    console.log('Server is listening on port 3000');
});