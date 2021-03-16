//----MIDDLEWARE----//

// Lista gresaka za ErrorHandler
const ERR_HANDLER = [
    {
        errIme: "CastError",
        status: 400,
        errPoruka: "Krivi format ID parametra!"
    },

    {
        errIme: "ValidationError",
        status: 400,
        errPoruka: "Pogreška pri validaciji!"
    },

    {
        errIme: "JsonWebTokenError",
        status: 401,
        errPoruka: "Neispravni token!"
    },
];

const infoPoruka = (req, res, next) => {
    console.log('Metoda:', req.method);
    console.log('Putanja:', req.path);
    console.log('Tijelo poruke: ', req.body);
    console.log('==============');
    next();
}

// Ukoliko korisnik dospije tamo gdje nije trebao dospjeti
const nepoznataRuta = (req, res) => {
    res.status(404).send({ error: 'Putanja ne postoji!' });
};

const errorHandler = (err, req, res, next) => {
    // Dohvati tip greške
    const error = ERR_HANDLER.find(e => e.errIme === err.name);

    // Ako postoji, vrati taj objekt
    if (error) {    
        return res.status(error.status).send({
            ime: error.errIme,
            greska: error.errPoruka,
            detaljno: err.message
        });
    }

    // Ako ne, provjeriti kakva greška dolazi, te može li se
    // potencijalno ubaciti u listu grešaka
    else {
        return res.status(500).send({
            ime: err.name,
            greska: "Nepoznata greska!",
            detaljno: err.message
        });
    }

    next(err);
};

module.exports = {nepoznataRuta, errorHandler, infoPoruka}