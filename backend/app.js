//----KONFIGURACIJA----//
const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');

//----CONTROLLERI----//
const loginRouter = require('./controllers/login');
const korisniciRouter = require('./controllers/korisnici');
const kanaliRouter = require('./controllers/kanali');
const porukeRouter = require('./controllers/poruke');
const grupeRouter = require('./controllers/grupe');

//----MIDDLEWARE----//
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');

//----METODE----//
const spajanjeNaBazu = async () => {
    console.log("Cekam spajanje na bazu...");

    // S obzirom na postojanje biblioteke koja
    // upravlja asinkronim greškama, onda se bilo
    // kakva nova poruka šalje middleware funkciji
    // preko te biblioteke

    await mongoose.connect(config.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });

    console.log("Spojeni smo na bazu.");
}

spajanjeNaBazu();

app.use(cors());
app.use(express.json());
app.use(middleware.infoPoruka);

//----RUTE----//
app.use('/api/login', loginRouter);
app.use('/api/korisnici', korisniciRouter);
app.use('/api/kanali', kanaliRouter);
app.use('/api/poruke', porukeRouter);
app.use('/api/grupe', grupeRouter);

app.use(middleware.nepoznataRuta);
app.use(middleware.errorHandler);

module.exports = app;