'use strict';

module.exports = function(app) {
  var words = require('./puzzle.json');

  app.dataSources.db.automigrate('Crossword', function(err) {
    if (err) throw err;
    app.models.Crossword.find(function(err, crosswords) {
      if (err) throw err;
      console.log("Found " + crosswords.length + " existing crosswords");
      if(!crosswords.length) {
        app.models.Crossword.create({
          fromCache: false,
          words: words,
        }, function (err, crossword) {
          if (err) throw err;
          console.log('Model created: \n', crossword);
        });
      }
    });
  });
};
