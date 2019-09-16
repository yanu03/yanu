/**
 * Router
 * @param app
 */
module.exports = (app) => {
  app.get('/', (req, res) => {
    res.render('index.ejs', {
      title: ""
    });
  }).get('/intro', (req, res) => {
    res.render('intro.ejs', {
      title: "- Easy Order"
    });
  }).get('/speech-recognition', (req, res) => {
    res.render('speech-recognition/index.ejs', {
      title: "- 음성 인식"
    });
  })
};

