const mongoose = require('./backend/node_modules/mongoose');
const bluebird = require('bluebird');
const helmet = require('helmet');
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const user  = require('./backend/model/user/user-router');
const auth = require('./backend/auth');
const rql = require('./rql.js');
const hello = require('./backend/hello/index');
const authUtils = require('./backend/auth/authUtils');
let fs = require('fs-extra');
if (config.get('signing_PEM')) {
        let f = config.get('signing_PEM');
        if (f.charAt(0) !== '/') {
                f = __dirname + '/' + f;
        }
        try {
                console.log('Filename: ', f);
                SigningPEM =   fs.readFileSync(f);
              if (SigningPEM) { console.log('Got PEM File'); }
        } catch (err) {
                console.log('Could not find PEM File: ', f, err);
        }
}
app.use('/auth', auth);
app.use('/hello', hello);
app.get('/rql', rql.findUserRql);
app.use('/user', authUtils.ensureAuthenticated, user);
app.use('/userutil/', express.static(path.join(__dirname, 'public/userutil/')));
mongoose.Promise = bluebird;
mongoose.connect(config.get('MONGO_DB_URI'), {
  useMongoClient: true
});
// Handle rejected promises globally
app.use((req, res, next) => {
  process.on('unhandledRejection', (reason, promise) => {
    /* istanbul ignore next */
    next(new Error(reason));
  });
  next();
});
