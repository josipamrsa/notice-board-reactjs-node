//----KONFIGURACIJA----//
import axios from 'axios';
const chatUrl = 'http://localhost:3001/api/poruke';

//----METODE----//
const postaviToken = novi => {
    return `bearer ${novi}`;
};

const ucitajPorukeZaKanal = async (id, token) => {
    const config = { headers: { Authorization: postaviToken(token) } };
    const odgovor = await axios.get(`${chatUrl}/${id}`, config)
        .catch((err) => { throw err.response; });
    return odgovor;
};

const ucitajInfoOKanalu = async (id, token) => {
    const config = { headers: { Authorization: postaviToken(token) } };
    const odgovor = await axios.get(`${chatUrl}/kanal/${id}`, config)
        .catch((err) => { throw err.response; });
    return odgovor;
}

const stvoriNovuPoruku = async (id, novaPoruka, token) => {
    const config = { headers: { Authorization: postaviToken(token) } };
    const odgovor = await axios.post(`${chatUrl}/${id}`, novaPoruka, config)
        .catch((err) => { throw err.response; });
    return odgovor;
};

const izbaciKorisnikaSKanala = async (id, korisnik, token) => {
    // kako prima samo url i config, treba ovako slati sve informacije za axios.delete
    const config = { 
        headers: { Authorization: postaviToken(token) },
        data: korisnik
    };

    const odgovor = await axios.delete(`${chatUrl}/korisnik/${id}`, config)
        .catch((err) => { throw err.response; });
    return odgovor;
}

export default {
    postaviToken,
    stvoriNovuPoruku,
    ucitajInfoOKanalu,
    ucitajPorukeZaKanal,
    izbaciKorisnikaSKanala
};
