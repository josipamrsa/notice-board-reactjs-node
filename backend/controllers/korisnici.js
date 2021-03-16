//----KONFIGURACIJA----//

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Za enkodiranje/dekodiranje šifre korisnika
const korisniciRouter = require('express').Router();
const Korisnik = require('../models/korisnik');

//----METODE----//

// Dohvat svih korisnika
korisniciRouter.get('/', async (req, res) => {
    const korisnici = await Korisnik.find({});
    res.json(korisnici);
});

// Unos novog korisnika - registracija
korisniciRouter.post('/', async (req, res) => {
    const sadrzaj = req.body;
    const runde = 10;
    const passHash = await bcrypt.hash(sadrzaj.lozinka, runde);

    const korisnik = new Korisnik({
        email: sadrzaj.adresa,
        passHash: passHash,
        ime: sadrzaj.ime,
        prezime: sadrzaj.prezime,
        razina: sadrzaj.razina,
        pretplate: [],
        vlasnistvo: []
    });

    const spremljeniKorisnik = await korisnik.save();
    res.json(spremljeniKorisnik);
});

// Verifikacija ulogiranog korisnika
korisniciRouter.get('/verify', async (req, res) => {
    const podatak = req.body;
    const token = dohvatiToken(req);
    const dekToken = jwt.verify(token, process.env.SECRET);

    if (!token || !dekToken.id) {
        return res.status(401).json({ error: 'Dobiveni token je neispravan ili više ne postoji!' });
    }

    const korisnik = await Korisnik.findById(dekToken.id);
    
    if (!korisnik) {
        return res.status(401).json({ error: 'Nepostojeći korisnik!' });
    }

    res.json(korisnik);
});

//----POMOCNE METODE----//

// Dohvat tokena iz konfiguracije
const dohvatiToken = req => {
    const auth = req.get('authorization');
    if (auth && auth.toLowerCase().startsWith('bearer')) {
        return auth.substring(7);
    }
    return null;
}

module.exports = korisniciRouter;