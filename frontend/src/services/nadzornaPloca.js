//----KONFIGURACIJA----//
import axios from 'axios';
const userUrl = 'http://localhost:3001/api/korisnici/verify';

//----SVOJSTVA----//
let token = null;       // Token prijavljenog korisnika

//----METODE----//
const postaviToken = novi => {
    token = `bearer ${novi}`;
};

const dohvatiPodatkeOKorisniku = async () => {
    const config = { headers: {Authorization: token} };
    const odgovor = await axios.get(userUrl, config);
    return odgovor.data;
}

export default { postaviToken, dohvatiPodatkeOKorisniku };