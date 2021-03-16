//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import * as Icon from 'react-feather';

// Servisi
import kanalServis from '../../services/dostupniKanali';

const DostupniKanali = (props) => {
    //----Stanja----//
    const prijavljeni = JSON.parse(localStorage.getItem("korisnik"));   // Je li trenutni korisnik prijavljen + token
    const [odabranaGrupa, postaviOdabranuGrupu] = useState("0");        // Odabrana grupa za filtriranje kanala
    const dostupneGrupe = props.grupe;                                  // Sve studijske grupe u bazi podataka

    //----Metode----//

    // Pretplata na kanale (i micanje)
    const upravljanjePretplatom = (id, korisnik, ukloni) => {
        kanalServis.upravljajPretplatom(id, korisnik, ukloni)
            .then((response) => {
                kanalServis.dohvatiKanale(korisnik)
                    .then((response) => {
                        props.postaviPretplate(response.pretplate);
                        props.postaviKanale(response.pregled);
                    });
            })
            .catch((err) => {
                props.postaviGresku(err.data.error ||
                    `${err.data.greska} (${err.data.detaljno})`);
            });
    };

    // Promjena grupe za filtriranje
    const promijeniGrupu = (e) => {
        postaviOdabranuGrupu(e.target.value);
    }

    return (
        <div>
            <div className="kanal-info-container">
                <h1>Moje pretplate</h1>
                {
                    props.pretplate.length === 0 ?
                        <div className="no-channel">{"Niste trenutno pretplaćeni ni na jedan kanal."}</div> :
                        <ul>
                            {/*
                                Za Link se može slati u obliku objekta s
                                parametrima koje želimo proslijediti korištenjem state                       
                            */}

                            {props.pretplate.map((ka) => (
                                <li key={ka.kratkoIme}>

                                    <Link to={
                                        prijavljeni ?
                                            {
                                                pathname: `/${ka.kratkoIme}`,
                                                state: {
                                                    ime: props.korisnik.ime,
                                                    imeKanala: ka.ime,
                                                    idKanala: ka.id,
                                                    vlasnik: ka.vlasnik,
                                                    idKorisnika: props.korisnik.id,
                                                    razina: props.korisnik.razina,
                                                    token: prijavljeni.token
                                                }
                                            } : { pathname: "/login" }}>
                                        {ka.ime} ({ka.tipKanala})
                                    </Link>

                                    <button
                                        title="Ukloni pretplatu"
                                        onClick={() => { upravljanjePretplatom(ka.id, props.korisnik.id, true) }}>
                                        <Icon.UserMinus />
                                    </button>

                                </li>
                            ))}
                        </ul>
                }
            </div>

            <div className="kanal-info-container">
                <h1>Pregled kanala</h1>
                <select
                    defaultValue={odabranaGrupa}
                    onChange={promijeniGrupu}>

                    <option value="0">Sve grupe</option>
                    {dostupneGrupe.map((grupa) => (
                        <option
                            key={grupa.id}
                            value={grupa.id}>
                            {grupa.smjer}
                            ({grupa.kratkiNaziv}) - {grupa.razina}
                        </option>
                    ))}
                </select>

                {
                    props.kanali.length === 0 ?
                        <div className="no-channel">{"Nema kanala za prikazati."}</div> :
                        <ul>
                            {props.kanali
                                .filter(
                                    // dakle ako je odabrana grupa prikazuje sve kanale vezane za tu grupu
                                    // a ako grupa nije odabrana ("0") onda prikazuje sve
                                    (k) => k.grupe.includes(odabranaGrupa) || odabranaGrupa === "0")
                                .map((ka) => (
                                    <li key={ka.kratkoIme}>
                                        {/*
                                        Korisnik bi se trebao pretplatiti na kanal ukoliko želi sudjelovati u razgovoru
                                        */}

                                        {ka.ime} ({ka.tipKanala})

                                        <button
                                            title="Pretplati se"
                                            onClick={() => { upravljanjePretplatom(ka.id, props.korisnik.id, false) }}>
                                            <Icon.UserPlus />
                                        </button>
                                    </li>
                                ))}
                        </ul>
                }
            </div>
        </div>
    );
}

export default DostupniKanali;