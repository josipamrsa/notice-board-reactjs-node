//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';

const Zaglavlje = (props) => {
    //----Stanja----//
    
    const [pozdrav, postaviPozdrav] = useState("");                             // Pozdrav korisniku
    const imeKorisnika = `${props.korisnik.ime} ${props.korisnik.prezime}`;     // Ime i prezime prijavljenog korisnika

    //----Metode----//

    // Odredi pozdrav prema dobu dana (osim ako se netko ne prijavljuje u Americi, ne znam
    // kakav će pozdrav dobiti)
    const odrediPozdrav = () => {
        const trenutniSat = new Date().getHours();

        // žao mi je unaprijed...
        let noviPozdrav = ((trenutniSat >= 6) && (trenutniSat < 12)) ? 
            {
                sadrzaj: "Dobro jutro",
                ikonica: <Icon.Sunrise size={28} />
            } : 
            ((trenutniSat >= 12) && (trenutniSat < 19)) ? 
                {
                    sadrzaj: "Dobar dan",
                    ikonica: <Icon.Sun size={28} />
                } : 
                {
                    sadrzaj: "Dobra večer",
                    ikonica: <Icon.Sunset size={28} />
                };

        return noviPozdrav;
    }

    useEffect(() => {
        postaviPozdrav(odrediPozdrav());
    }, []);

    return (
        <div className="header-nadzorna">
            <div className="korisnik-info">
                {pozdrav.ikonica} 
                <h2>{`${pozdrav.sadrzaj}, ${imeKorisnika}!`}</h2>
            </div>
            <div className="opcije">{props.children}</div>
        </div>
    );
}

export default Zaglavlje;