//----KONFIGURACIJA----//
import axios from 'axios';
const channelUrl = 'http://localhost:3001/api/kanali';
const groupUrl = 'http://localhost:3001/api/grupe';

//----METODE----//
const dohvatiKanale = async id => {
    const odgovor = await axios.get(channelUrl)
        .catch((err) => { throw err.response });;

    const pretplate = odgovor.data.filter(kanal => {
        if (kanal.pretplate.includes(id)) return kanal;
    });

    const pregled = odgovor.data.filter(kanal => {
        if (!kanal.pretplate.includes(id)) return kanal;
    });

    return ({ pretplate, pregled });
};

const dohvatiVlastiteKanale = async id => {
    const odgovor = await axios.get(`${channelUrl}/${id}`)
        .catch((err) => { throw err.response });
    return odgovor;
}

const dohvatiGrupe = async () => {
    const odgovor = await axios.get(groupUrl)
        .catch((err) => { throw err.response });
    return odgovor;
};

const stvoriNoviKanal = async noviKanal => {
    const odgovor = await axios.post(channelUrl, noviKanal)
        .catch((err) => { throw err.response });
    return odgovor;
};

const obrisiKanal = async (id, korisnik) => {
    const odgovor = await axios.delete(`${channelUrl}/${id}`, {
        data: {
            idKorisnika: korisnik
        }
    })
        .catch((err) => { throw err.response });
    return odgovor;
}

const azurirajKanal = async (id, azuriraniKanal) => {
    const odgovor = await axios.put(`${channelUrl}/update/${id}`, azuriraniKanal)
        .catch((err) => { throw err.response });
    return odgovor;
}

const upravljajPretplatom = async (idKanala, idKorisnika, zaUkloniti) => {
    const odgovor = await axios.put(`${channelUrl}/${idKanala}`,
        {
            id: idKorisnika,
            ukloni: zaUkloniti
        }).catch((err) => { throw err.response; });
    return odgovor;
};

export default {
    dohvatiKanale,
    dohvatiVlastiteKanale,
    dohvatiGrupe,
    stvoriNoviKanal,
    obrisiKanal,
    azurirajKanal,
    upravljajPretplatom
};