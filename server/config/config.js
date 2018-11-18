//=================================
// PORT
//=================================
process.env.PORT = process.env.PORT || 3000;

//=================================
// ENVIRONMENT
//=================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=================================
// TOKEN EXPIRES
//=================================
//60segs * 60min * 24h * 30 days
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;

//=================================
// SEED TOKEN
//=================================
process.env.SEED = process.env.SEED || 'my-secret-dev';

//=================================
// DATABASE
//=================================
let urlDatabase;

if (process.env.NODE_ENV === 'dev') {
    urlDatabase = 'mongodb://localhost:27017/cafe';
} else {
    urlDatabase = process.env.MONGO_URI;
}

process.env.URLDB = urlDatabase;