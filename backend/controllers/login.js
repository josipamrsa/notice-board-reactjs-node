//----KONFIGURACIJA----//

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const Korisnik = require('../models/korisnik');
const korisniciRouter = require('./korisnici');

//----METODE----//

// Login korisnika u aplikaciju
loginRouter.post('/', async (req, res) => {
    const podaci = req.body;

    const korisnik = await Korisnik.findOne({ email: podaci.adresa });
    const lozinkaOk = korisnik === null ? false : await bcrypt.compare(podaci.lozinka, korisnik.passHash);

    if (!(korisnik && lozinkaOk)) {
        return res.status(401).json({
            error: 'Neispravni podaci - email adresa ili lozinka!'
        });
    }

    const userToken = {
        ime: korisnik.ime,
        id: korisnik.id
    }
    
    const token = jwt.sign(userToken, process.env.SECRET);

    res.status(200).send({
        token,
        email: korisnik.email,
        ime: korisnik.ime
    });
});

module.exports = loginRouter;