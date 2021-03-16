const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Kanal = require('../models/kanal');
const Poruka = require('../models/poruka');
const pomocne = require('./pomocne');

// Simulacija API-ja
const api = supertest(app);

beforeEach(async () => {
    pomocne.generiraniKorisnici = await pomocne.postaviKorisnike();
    const { nastavnik, student } = pomocne.generiraniKorisnici;

    const kanal = {
        ime: "Kanal s porukama",
        kratkoIme: "KSP",
        tipKanala: "Vježbe",
        vlasnik: nastavnik._id,
        grupe: [],
        pretplate: [nastavnik._id, student._id],
        poruke: []
    }

    pomocne.generiraniKanal = await pomocne.postaviKanal(kanal);

    pomocne.spremljenePoruke = await pomocne.postaviPoruke(
        pomocne.generiraniKorisnici,
        pomocne.generiraniKanal
    );
});

describe('Operacije s porukama', () => {
    test('poruke poslane na odredjeni kanal se dohvacaju', async () => {
        const kanal = pomocne.generiraniKanal;

        const { nastavnik } = pomocne.generiraniKorisnici;
        const token = await pomocne.loginKorisnika(nastavnik.email, "nastavnicka");

        // 1. napisi novu funkcionalnost
        // 2. napisi test za funkcionalnost
        // 3. test padne
        // 4. ...bug je bio u testu
        // 5. ...BUG JE BIO U TESTU

        const odgovor = await api
            .get(`/api/poruke/${kanal._id}`)
            .set('Authorization', `bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('poruka se moze poslati na kanal', async () => {
        const { student } = pomocne.generiraniKorisnici;
        const token = await pomocne.loginKorisnika(student.email, "studentska");

        const poruka = {
            obavijesna: false,
            sadrzaj: "My name's Jeff",
            datum: new Date(Date.now()),
            autor: { id: student._id, ime: student.ime }
        };

        const odgovor = await api
            .post(`/api/poruke/${pomocne.generiraniKanal._id}`)
            .set('Authorization', `bearer ${token}`)
            .send(poruka)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('nastavnik - vlasnik kanala moze slati poruke s oznakom obavijesti', async () => {
        const { nastavnik } = pomocne.generiraniKorisnici;
        const token = await pomocne.loginKorisnika(nastavnik.email, "nastavnicka");

        const poruka = {
            obavijesna: true,
            sadrzaj: "British devs be like () => innit()",
            datum: new Date(Date.now()),
            autor: {
                id: nastavnik._id,
                ime: nastavnik.ime
            }
        };

        const odgovor = await api
            .post(`/api/poruke/${pomocne.generiraniKanal._id}`)
            .set('Authorization', `bearer ${token}`)
            .send(poruka)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('osoba koja nije pretplatnik kanala ne moze slati poruke na kanal', async () => {
        const novi = await pomocne.postaviJednogKorisnika();
        const token = await pomocne.loginKorisnika(novi.email, "lazna2");

        const poruka = {
            obavijesna: false,
            sadrzaj: "If a potato can become vodka, I can become a web developer!",
            datum: new Date(Date.now()),
            autor: { id: novi._id, ime: novi.ime }
        };

        const odgovor = await api
            .post(`/api/poruke/${pomocne.generiraniKanal._id}`)
            .set('Authorization', `bearer ${token}`)
            .send(poruka)
            .expect(405)
            .expect('Content-Type', /application\/json/);
    });
});

describe('Validacija ispravnosti poruke', () => {
    test('poruka mora biti velicine od minimalno jednog znaka', async () => {
        const { student } = pomocne.generiraniKorisnici;
        const token = await pomocne.loginKorisnika(student.email, "studentska");

        const poruka = {
            obavijesna: false,
            sadrzaj: "",
            datum: new Date(Date.now()),
            autor: { id: student._id, ime: student.ime }
        };

        const odgovor = await api
            .post(`/api/poruke/${pomocne.generiraniKanal._id}`)
            .set('Authorization', `bearer ${token}`)
            .send(poruka)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const greska = JSON.parse(odgovor.res.text);
        expect(greska.ime).toEqual("ValidationError");
    });

    test('ukoliko je podatak o obavijesti prazan, imat ce default vrijednost false', async () => {
        const { nastavnik } = pomocne.generiraniKorisnici;
        const token = await pomocne.loginKorisnika(nastavnik.email, "nastavnicka");

        const poruka = {
            obavijesna: "",
            sadrzaj: "Ova poruka će proći",
            datum: new Date(Date.now()),
            autor: { id: nastavnik._id, ime: nastavnik.ime }
        };

        const odgovor = await api
            .post(`/api/poruke/${pomocne.generiraniKanal._id}`)
            .set('Authorization', `bearer ${token}`)
            .send(poruka)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const poslana = await Poruka.findOne(
            {
                chatKanal: pomocne.generiraniKanal._id,
                sadrzaj: "Ova poruka će proći"
            });

        expect(poslana.obavijesna).toEqual(false);
    });
});

describe('Upravljanje korisnicima na kanalu', () => {
    test('detalji o kanalu se ucitavaju', async () => {
        const { student } = pomocne.generiraniKorisnici;
        const token = await pomocne.loginKorisnika(student.email, "studentska");

        const odgovor = await api
            .get(`/api/poruke/kanal/${pomocne.generiraniKanal._id}`)
            .set('Authorization', `bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('korisnik - vlasnik (nastavnik) moze obrisati pretplatnike s kanala', async () => {
        const { nastavnik, student } = pomocne.generiraniKorisnici;
        const token = await pomocne.loginKorisnika(nastavnik.email, "nastavnicka");

        const odgovor = await api
            .delete(`/api/poruke/korisnik/${student._id}`)
            .set('Authorization', `bearer ${token}`)
            .send({
                vlasnik: nastavnik._id,
                kanal: pomocne.generiraniKanal._id
            })
            .expect(204);
    });

    test('korisnik koji nije vlasnik kanala ne moze micati pretplatnike s kanala', async () => {
        const { nastavnik, student } = pomocne.generiraniKorisnici;
        const token = await pomocne.loginKorisnika(student.email, "studentska");

        const odgovor = await api
            .delete(`/api/poruke/korisnik/${nastavnik._id}`)
            .set('Authorization', `bearer ${token}`)
            .send({
                vlasnik: student._id,
                kanal: pomocne.generiraniKanal._id
            })
            .expect(405);
    });

    test('nije moguce izbaciti korisnika iz kanala ako on nije pretplatnik kanala', async () => {
        const { nastavnik } = pomocne.generiraniKorisnici;
        const token = await pomocne.loginKorisnika(nastavnik.email, "nastavnicka");

        const novi = await pomocne.postaviJednogKorisnika();

        const odgovor = await api
            .delete(`/api/poruke/korisnik/${novi._id}`)
            .set('Authorization', `bearer ${token}`)
            .send({
                vlasnik: nastavnik._id,
                kanal: pomocne.generiraniKanal._id
            })
            .expect(405);
    });
});

afterAll(() => {
    mongoose.connection.close();
});

