let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('*', function(req, res) {
	req.applicationModule = 'p3/app/p3app';
	res.render('p3app', {title: 'PATRIC', request: req, response: res});
});

module.exports = router;
