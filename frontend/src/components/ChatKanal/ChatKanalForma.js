//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React, { useEffect, useState } from 'react';
import { Link, Redirect } from "react-router-dom";
import * as Icon from 'react-feather';
import useChat from '../../hooks/useChat';

//----Pomoćne komponente----//
import Modalni from '../Containeri/Modalni';

//----Komponente----//
import ChatPoruke from './ChatPoruke';
import ChatZaglavlje from './ChatZaglavlje';
import UnosNovePoruke from './UnosNovePoruke';

//----Pomoćne komponente----//
import UpravljanjeKanalom from './Upravljanje/UpravljanjeKanalom';
import ToastNotifikacija from '../Containeri/ToastNotifikacija';
import DatumFilter from '../Containeri/DatumFilter';
import ErrHandler from '../Containeri/ErrHandler';

//----Servisi----//
import chatServis from '../../services/chatKomunikacija';

//----Stilovi----//
import '../../styles/chat-prozor.css';

// Za potrebe testiranja
const isTestEnv = process.env.NODE_ENV === 'test';

const ChatKanalForma = (props) => {
    //----Stanja----//

    const [sadrzajPoruke, postaviSadrzajPoruke] = useState("");     // Za unos nove poruke
    const [obavijesna, postaviObavijesnu] = useState(false);        // Je li poruka obavijest ili obična
    const [postavke, postaviPostavke] = useState(false);            // Je li modul postavki otvoren
    const [kanalInfo, postaviKanalInfo] = useState({});             // Informacije o kanalu
    const [datumFilter, postaviDatumFilter] = useState("");         // Filtriranje poruka po datumu
    const [greska, postaviGresku] = useState("");                   // Svojstvo za error handler komponentu

    const { kratkoIme } = props.match.params;                       // Ime chat kanala

    const imeSudionika = props.location.state.ime;                  // Ime koje će se prikazivati uz poruku
    const punoImeKanala = props.location.state.imeKanala;           // Za prikaz imena samog kanala
    const idKorisnika = props.location.state.idKorisnika;           // Korisnički podaci - id korisnika
    const razina = props.location.state.razina;                     // Korisnička razina
    const vlasnik = props.location.state.vlasnik;                   // ID vlasnika kanala
    const token = props.location.state.token;                       // Token trenutnog korisnika

    // ili dodati prvo dohvat iz baze podataka ili onemogućiti 
    // unos jednakih vrijednosti (vjerojatnija opcija)
    // treba kasnije za poruke da se zna gdje će se učitavati
    const idKanala = props.location.state.idKanala;                 // ID kanala za učitavanje poruka

    // Svojstva i metode iz useChat hooka
    const {
        poruke,
        obavijesti,
        postaviPoruke,
        saljiPoruku,
        izbaciKorisnika
    } = useChat(kratkoIme, idKorisnika);

    //----Metode----//

    // Dohvat prijašnjih poruka i provjera korisnika
    useEffect(() => {
        chatServis.ucitajPorukeZaKanal(idKanala, token)
            .then((response) => {
                postaviPoruke(response.data);
                chatServis.ucitajInfoOKanalu(idKanala, token)
                    .then((response) => {
                        postaviKanalInfo(response.data);
                    }).catch((err) => {
                        postaviGresku(err.data.error ||
                            `${err.data.greska} (${err.data.detaljno})`);
                    });
            }).catch((err) => {
                postaviGresku(err.data.error ||
                    `${err.data.greska} (${err.data.detaljno})`);
            });

    }, [postavke, token]);

    // Kontrolirani unos - input za unos teksta poruke
    const promjenaNovaPoruka = (e) => {
        postaviSadrzajPoruke(e.target.value);
    }

    // Kontrolirani unos - postavljanje obavijesti na kanal
    const promjenaObavijesna = (e) => {
        console.log(e.target);
        postaviObavijesnu(e.target.checked);
    }

    // Slanje nove poruke svim prisutnim korisnicima
    const posaljiNovuPoruku = (e) => {
        e.preventDefault();

        let nova = {
            obavijesna: obavijesna,
            sadrzaj: sadrzajPoruke,
            autor: { ime: imeSudionika, id: idKorisnika },
            kanal: idKanala,
            imeKanala: kanalInfo.ime,
            datum: new Date()
        };

        // prvo šalje novu poruku prema bazi za spremanje, a tek onda dijeli
        // tu poruku s ostalim korisnicima
        chatServis.stvoriNovuPoruku(idKanala, nova, token)
            .then((response) => {
                saljiPoruku(nova);
            }).catch((err) => {
                postaviGresku(err.data.error ||
                    `${err.data.greska} (${err.data.detaljno})`);
            });;

        postaviSadrzajPoruke("");
    }

    // Otvaranje i zatvaranje postavki
    const otvoriPostavke = () => {
        postaviPostavke(true);
    };

    const zatvoriPostavke = (oznaka) => {
        postaviPostavke(oznaka);
    }

    return (
        <div className="glavna-forma-chp">
            { (token || isTestEnv) ?
                <div>
                    <ToastNotifikacija obavijesti={obavijesti} />

                    <ChatZaglavlje>
                        <div className="chat-zaglavlje-naslov">
                            <h1>{punoImeKanala}</h1>
                        </div>

                        <div className="chat-zaglavlje-kontrole">
                            <button
                                title="Postavke"
                                onClick={otvoriPostavke}>
                                <Icon.Settings size={32} />
                            </button>

                            <Link to="/nadzorna">
                                <Icon.XCircle size={32} />
                            </Link>
                        </div>
                    </ChatZaglavlje>

                    <Modalni
                        otvori={postavke}
                        zatvori={(postavke) => zatvoriPostavke(postavke)}>

                        <UpravljanjeKanalom
                            token={token}
                            kanalInfo={kanalInfo}
                            korisnik={idKorisnika}
                            chatServis={chatServis}
                            razina={razina}
                            izbaciKorisnika={izbaciKorisnika} />

                    </Modalni>

                    <ErrHandler
                        greska={greska}
                        postaviGresku={postaviGresku} />

                    <div className="chat-forma">

                        <DatumFilter
                            datumFilter={datumFilter}
                            postaviDatumFilter={postaviDatumFilter} />

                        <ChatPoruke poruke={poruke} filter={datumFilter} />

                        <UnosNovePoruke
                            korisnik={idKorisnika}
                            razina={razina}
                            vlasnik={vlasnik}
                            sadrzajPoruke={sadrzajPoruke}
                            obavijesna={obavijesna}
                            postaviSadrzajPoruke={postaviSadrzajPoruke}
                            postaviObavijesnu={promjenaObavijesna}
                            posaljiNovuPoruku={posaljiNovuPoruku}
                            promjenaNovaPoruka={promjenaNovaPoruka} />

                    </div>

                </div> :
                <Redirect to='/login' />
            }
        </div>
    );
}

export default ChatKanalForma;