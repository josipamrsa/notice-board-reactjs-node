const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Korisnik = require('../models/korisnik');
const Kanal = require('../models/kanal');
const Poruka = require('../models/poruka');

const porukeNaKanalu = [
    {
        obavijesna: true,
        sadrzaj: "Ovo je prva poruka na kanalu",
        datum: new Date(Date.now()),
    },

    {
        obavijesna: false,
        sadrzaj: "Ovo je obična poruka",
        datum: new Date(Date.now()),
    },

    {
        obavijesna: true,
        sadrzaj: "Ovo je obavijest",
        datum: new Date(Date.now()),
    },

    {
        obavijesna: false,
        sadrzaj: "Ovo je još jedna poruka na kanalu",
        datum: new Date(Date.now()),
    },

    {
        obavijesna: true,
        sadrzaj: "Ovo je još jedna poruka s oznakom obavijesti na kanalu",
        datum: new Date(Date.now()),
    },
];

let generiraniPrijavljeni = null;
let generiraniKorisnici = null;
let generiraniKanal = null;
let spremljenePoruke = null;

const postaviJednogKorisnika = async () => {
    const passHash = await bcrypt.hash('lazna2', 10);
    const korisnik = new Korisnik({
        email: "novilazni@mail.hr",
        passHash: passHash,
        ime: "Novi",
        prezime: "Lazni",
        razina: "student",
        pretplate: [],
        vlasnistvo: []
    });

    await korisnik.save();
    return korisnik;
}

const postaviKorisnike = async () => {
    await Korisnik.deleteMany({});

    const nastPassHash = await bcrypt.hash('nastavnicka', 10);
    const studPassHash = await bcrypt.hash('studentska', 10);

    const nastavnik = new Korisnik({
        email: "nastavnik@mail.hr",
        passHash: nastPassHash,
        ime: "Novi",
        prezime: "Nastavnik",
        razina: "nastavnik",
        pretplate: [],
        vlasnistvo: []
    });

    const student = new Korisnik({
        email: "student@mail.hr",
        passHash: studPassHash,
        ime: "Novi",
        prezime: "Student",
        razina: "student",
        pretplate: [],
        vlasnistvo: []
    });

    await nastavnik.save();
    await student.save();

    return { nastavnik, student };
};

const postaviKanal = async (testKanal) => {
    await Kanal.deleteMany({});
    const kanal = new Kanal(testKanal);
    await kanal.save();
    return kanal;
}

const postaviPoruke = async (korisnici, kanal) => {
    await Poruka.deleteMany({});
    const kanalPoruke = await Kanal.findById(kanal._id);

    const { nastavnik, student } = korisnici;
    
    const poruke = porukeNaKanalu.map(p => {
        return new Poruka({
            obavijesna: p.obavijesna,
            sadrzaj: p.sadrzaj,
            datum: p.datum,
            autor: p.obavijesna ? nastavnik._id : student._id,
            chatKanal: kanal._id
        });
    });

    // Zašto radi s normalnom petljom, a ne s array.forEach ja ne mogu objasnit

    // Baci grešku: ValidationError: Poruka validation failed: _id: Error, expected `_id` to be unique.
    // ????? zasto je naopako

    //poruke.forEach(async p => await p.save()); 

    // Ali ovo radi????
    for (let i = 0; i < poruke.length; i++) {
        kanalPoruke.poruke = kanalPoruke.poruke.concat(poruke[i]._id);
        await poruke[i].save();
    }

    await kanalPoruke.save();
    return poruke;
}

const loginKorisnika = async (adresa, pass) => {
    const korisnik = await Korisnik.findOne({email: adresa});
    
    const passPase = korisnik === null ? 
        false : await bcrypt.compare(pass, korisnik.passHash);

    if (!passPase) 
        return null;
    
    const userToken = {
        ime: korisnik.ime,
        id: korisnik._id
    };

    const token = jwt.sign(userToken, process.env.SECRET);
    return token;
}

module.exports = {
    porukeNaKanalu, generiraniPrijavljeni, generiraniKorisnici, generiraniKanal, spremljenePoruke,
    postaviJednogKorisnika, postaviKorisnike, postaviKanal, postaviPoruke, loginKorisnika
}