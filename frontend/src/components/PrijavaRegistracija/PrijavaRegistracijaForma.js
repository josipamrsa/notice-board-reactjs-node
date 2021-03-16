//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//----Komponente----//
import Prijava from './Prijava';
import Registracija from './Registracija';

//----Servisi----//
import loginServis from '../../services/prijavaRegistracija';

//----Stilovi----//
import '../../styles/prijava-registracija.css';

const PrijavaRegistracija = (props) => {
    //----Stanja----//
    const [promjena, postaviPromjenu] = useState(true);         // Koji će se modul prikazivati
    const [modul, postaviModul] = useState("Registracija");     // Koje ime će imati dugme koje prebacuje module

    const [adresa, postaviEmailAdresu] = useState('');          // State za e-mail adresu
    const [lozinka, postaviLozinku] = useState('');             // State za lozinku

    const [ime, postaviIme] = useState('');                     // State za ime korisnika
    const [prezime, postaviPrezime] = useState('');             // State za prezime korisnika
    const [razina, postaviRazinu] = useState('');               // State za razinu korisnika

    let history = useHistory();

    //----Metode---//

    useEffect(() => {
        localStorage.removeItem('korisnik');
        props.korisnikUlogiran(null);
    }, []);

    // Promjena iz forme prijave u formu registracije i obrnuto
    const promijeniModul = () => {
        postaviPromjenu(!promjena);
        postaviModul(promjena ? "Prijava" : "Registracija");
    }

    // Prijava korisnika u aplikaciju
    const zapocniPrijavu = async (e) => {
        e.preventDefault();
        try {
            const prijavljeni = await loginServis.prijava({ adresa, lozinka });
            props.korisnikUlogiran(prijavljeni);
  
            postaviEmailAdresu('');
            postaviLozinku('');

            history.push('/nadzorna'); 
            console.log(history.location);
        }

        catch (err) {
            alert(err.data.error ||
                `${err.data.greska} (${err.data.detaljno})`);
            console.log(err);
        }
    }

    // Registracija korisnika za aplikaciju
    const zapocniRegistraciju = async (e) => {
        e.preventDefault();
        try {
            await loginServis.registracija({ adresa, lozinka, ime, prezime, razina });

            alert("Uspješna registracija!");

            postaviPromjenu(true);
            postaviModul("Registracija"); // jer nakon uspješne prijave prebaciva na prijavu

            postaviEmailAdresu('');
            postaviLozinku('');
            postaviIme('');
            postaviPrezime('');
            postaviRazinu('');
        }

        catch (err) {
            alert(err.data.error ||
                `${err.data.greska} (${err.data.detaljno})`);
            console.log(err);
        }
    }

    return (
        <div className="glavna-forma-pr">
            <button 
                onClick={promijeniModul}
                className="dugme-modul">{modul}</button>
                
            { promjena ?
                <Prijava
                    prijava={zapocniPrijavu}
                    adresa={adresa}
                    lozinka={lozinka}
                    promjenaMail={({ target }) => postaviEmailAdresu(target.value)}
                    promjenaLozinka={({ target }) => postaviLozinku(target.value)} /> :
                <Registracija
                    registracija={zapocniRegistraciju}
                    adresa={adresa}
                    lozinka={lozinka}
                    ime={ime}
                    prezime={prezime}
                    razina={razina}
                    promjenaMail={({ target }) => postaviEmailAdresu(target.value)}
                    promjenaLozinka={({ target }) => postaviLozinku(target.value)}
                    promjenaIme={({ target }) => postaviIme(target.value)}
                    promjenaPrezime={({ target }) => postaviPrezime(target.value)}
                    promjenaRazine={({ target }) => postaviRazinu(target.value)} />
            }
        </div>
    );
};

export default PrijavaRegistracija;