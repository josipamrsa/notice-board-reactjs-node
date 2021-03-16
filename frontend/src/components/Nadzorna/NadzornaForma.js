//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import * as Icon from 'react-feather';
import useNotification from '../../hooks/useNotification';

//----Komponente----//
import DostupniKanali from './DostupniKanali';                          // Modul prikaza pretplata i dostupnih kanala
import Zaglavlje from './Zaglavlje';                                    // Modul za prikaz informacija o korisniku i opcija

//----Pomoćne komponente----//
import Modalni from '../Containeri/Modalni';                            // Modalni prozor otvaranja postavki
import KarticniPrikaz from './Upravljanje/KarticniPrikaz';              // "Kartični" prikaz na komponenti postavki
import DodavanjeKanala from './Upravljanje/DodavanjeKanala';            // Modul za dodavanje kanala u bazu
import UpravljanjeKanalima from './Upravljanje/UpravljanjeKanalima';    // Modul za ažuriranje i brisanje kanala
import ToastNotifikacija from '../Containeri/ToastNotifikacija';
import ErrHandler from '../Containeri/ErrHandler';

//----Servisi----//
import kanalServis from '../../services/dostupniKanali';
import nadzornaServis from '../../services/nadzornaPloca';

//----Stilovi----//
import '../../styles/nadzorna-ploca.css';

const NadzornaForma = (props) => {
    //----Stanja----//

    // postavlja se na [] umjesto null jer se učita ovo prije nego useEffect hook... ima efekta
    const [dostupniKanali, postaviDostupneKanale] = useState([]);           // Za dohvat dostupnih kanala za pretplatu
    const [pretplate, postaviPretplate] = useState([]);                     // Za dohvat svih pretplata (i vlasničkih kanala)

    const prijavljeniKorisnik = props.korisnik;                             // Props dohvaćen iz App.js - prijavljeni
    const [podaciKorisnik, postaviPodatke] = useState([]);                  // Provjera prijavljenog korisnika
    const [razina, postaviRazinu] = useState("");                           // Provjera razine korisnika (kod prikaza opcija)

    const [postavke, postaviPostavke] = useState(false);                    // Je li modul postavki otvoren
    const [greska, postaviGresku] = useState("");                           // Za ErrorHandler komponentu - što će prikazati
    const [kartica, postaviKarticu] = useState(true);                       // Kartični prikaz u modalnom prozoru
    const [grupe, postaviGrupe] = useState([]);                             // Studijske grupe

    let history = useHistory();                                             // Prebacivanje između glavnih modula
    
    // Dodati u bazu ili localStorage da perzistira?
    const { obavijesti } = useNotification(podaciKorisnik.id, pretplate);   // Hvatanje obavijesti s pretplaćenih kanala 

    //----Metode----//

    // Provjera i dohvat informacija o ulogiranom korisniku
    // Provjerit će korisnički token, a potom dohvatiti informacije o korisniku i njegove kanale
    // (pretplate, dostupne kanale, te ovisno o razini korisnika i vlasničke kanale)
    useEffect(() => {
        nadzornaServis.postaviToken(prijavljeniKorisnik.token);
        nadzornaServis.dohvatiPodatkeOKorisniku()
            .then((response) => {

                postaviPodatke(response);
                postaviRazinu(response.razina);

                kanalServis.dohvatiKanale(response.id)
                    .then((response) => {
                        postaviPretplate(response.pretplate);
                        postaviDostupneKanale(response.pregled);
                    });

                kanalServis.dohvatiGrupe()
                    .then((response) => {
                        postaviGrupe(response.data);
                    });
            })
            .catch((err) => {
                console.log(err.message);
                alert("Sesija neispravna - molimo prijavite se ponovno.");
            });
    }, [postavke, prijavljeniKorisnik.token]); // Da se ažurira na zatvaranju postavki

    // Otvaranje i zatvaranje postavki
    const otvoriPostavke = () => {
        postaviPostavke(true);
        postaviKarticu(true);
    };

    const zatvoriPostavke = (oznaka) => {
        postaviPostavke(oznaka);
    }

    // Odjava korisnika i povratak na modul prijave
    const odjava = () => {
        localStorage.removeItem('korisnik');
        props.odjava();
        history.push('/login');
    }

    return (
        <div className="glavna-forma-np">
            { prijavljeniKorisnik.token ?
                <div>
                    <ToastNotifikacija obavijesti={obavijesti} />

                    <Zaglavlje korisnik={podaciKorisnik}>

                        <button 
                            onClick={otvoriPostavke} 
                            title="Upravljaj kanalima"
                            className="btn-postavke">
                            <Icon.Settings size={28} />
                        </button>

                        <button 
                            onClick={odjava} 
                            title="Odjava iz aplikacije"
                            className="btn-odjava">
                            <Icon.Power size={28} />
                        </button>

                    </Zaglavlje>

                    <Modalni
                        className="modalni-prozor"
                        otvori={postavke}
                        zatvori={(postavke) => zatvoriPostavke(postavke)}>

                        <KarticniPrikaz
                            kartica={kartica}
                            postaviKarticu={postaviKarticu} />

                        {kartica ?

                            <DodavanjeKanala
                                grupe={grupe}
                                korisnik={podaciKorisnik}
                                razina={razina} /> :

                            <UpravljanjeKanalima
                                grupe={grupe}
                                korisnik={podaciKorisnik}
                                razina={razina} />
                        }

                    </Modalni>

                    <ErrHandler 
                        greska={greska}
                        postaviGresku={postaviGresku} />

                    <DostupniKanali
                        prijavljeniKorisnik={prijavljeniKorisnik.token}
                        korisnik={podaciKorisnik}
                        kanali={dostupniKanali}
                        pretplate={pretplate}
                        grupe={grupe}
                        postaviKanale={postaviDostupneKanale}
                        postaviPretplate={postaviPretplate}
                        postaviGresku={postaviGresku} />
                </div> :
                <div>
                    <Redirect to="/login" />
                </div>
            }
        </div>
    );
};

export default NadzornaForma;