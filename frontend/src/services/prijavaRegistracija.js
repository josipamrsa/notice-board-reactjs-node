//----KONFIGURACIJA----//
import axios from 'axios';
const loginUrl = 'http://localhost:3001/api/login';
const registerUrl = 'http://localhost:3001/api/korisnici';

//----METODE----//
const prijava = async podaci => {
    const odgovor = await axios.post(loginUrl, podaci).catch((err) => { throw err.response; });;
    return odgovor.data;
};

const registracija = async podaci => {
    const odgovor = await axios.post(registerUrl, podaci).catch((err) => { throw err.response; });;
    return odgovor.data;
};

export default { prijava, registracija };