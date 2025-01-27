// Create web server
// Create a route for the comments page
// Create a route for the comments form submission
// Create a route for the comments API

// Import modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

// Set up body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Set up static directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up comments file
const commentsFile = path.join(__dirname, 'data', 'comments.json');

// Set up comments API
app.get('/api/comments', (req, res) => {
  fs.readFile(commentsFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }

    res.json(JSON.parse(data));
  });
});

// Set up comments form submission
app.post('/comments', (req, res) => {
  const comment = req.body.comment;

  if (!comment) {
    res.status(400).send('Missing comment');
    return;
  }

  fs.readFile(commentsFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }

    const comments = JSON.parse(data);
    comments.push(comment);

    fs.writeFile(commentsFile, JSON.stringify(comments), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server error');
        return;
      }

      res.redirect('/comments');
    });
  });
});

// Set up comments page
app.get('/comments', (req, res) => {
  fs.readFile(commentsFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }

    const comments = JSON.parse(data);
    res.render('comments.ejs', { comments });
  });
});

// Start web server
const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
