//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import * as Icon from 'react-feather';

//----Komponente----//
import PrijavaRegistracija from './components/PrijavaRegistracija/PrijavaRegistracijaForma';    // Login/registracija
import NadzornaForma from './components/Nadzorna/NadzornaForma';                                // Nadzorna ploča (Dashboard)
import ChatKanalForma from './components/ChatKanal/ChatKanalForma';                             // Modul chat prozora

//----Stilovi----//
import Teme from './styles/themes/teme';

// Bilježenje ili učitavanje spremljene teme aplikacije
const promijeniTemu = (novaTema, cb) => {
    const nova = novaTema === "skolska" ? Teme.skolska : Teme.pmf;
    // kako bi se CSS varijable učitale u sam dokument (stil dokumenta),
    // postavljamo za svaki style element (CSS) ključ (ime CSS varijable)
    // i vrijednost za tu varijablu
    Object.keys(nova).map(key => {
        const value = nova[key];
        document.documentElement.style.setProperty(key, value);
    });
    cb(); // odmah postavimo i trenutnu temu
}

const App = () => {
    //----Stanja----//
    const [tema, postaviTemu] = useState("pmf");              // Što će biti trenutna tema
    const [korisnik, postaviKorisnika] = useState(null);      // State za cijelog korisnika

    //----Metode----//

    // Postavljanje prijavljenog korisnika u LocalStorage
    const authLocalStorage = (k) => {
        postaviKorisnika(k);
        if (k) { localStorage.setItem("korisnik", JSON.stringify(k)); }
    }

    // Odjava korisnika iz aplikacije
    const odjavaKorisnika = () => {
        postaviKorisnika(null);
    }

    // Promjena teme na temelju korisničkog odabira
    const toggleTema = (e) => {
        const novaTema = e.target.value;
        localStorage.setItem("tema", novaTema);
        postaviTemu(novaTema);
        promijeniTemu(novaTema, () => postaviTemu(novaTema));
    }

    // Postavljanje trenutne teme pri učitavanju (ili iz localStorage ili pmf temu)
    useEffect(() => {
        const trenutna = localStorage.getItem("tema") || "pmf";
        promijeniTemu(trenutna, () => postaviTemu(trenutna));
    }, []);

    //----Navigacija----//
    return (
        <div>
            <Router>
                <Switch>
                    { /* Exact path - uzima točno tu putanju, za razliku od klasičnog path parametra */}
                    <Route exact path='/'>
                        <Redirect to='/nadzorna' />
                    </Route>

                    <Route exact path='/login'>
                        <PrijavaRegistracija
                            korisnik={korisnik}
                            korisnikUlogiran={(korisnik) => authLocalStorage(korisnik)} />
                    </Route>

                    {
                        // ako se upravo ulogirao ili se vraća u aplikaciju bez odjave (ostaje spremljen)
                        (korisnik || JSON.parse(localStorage.getItem("korisnik"))) ?
                            <Route exact path='/nadzorna'>
                                <NadzornaForma
                                    korisnik={korisnik ? korisnik : JSON.parse(localStorage.getItem("korisnik"))}
                                    odjava={odjavaKorisnika} />
                            </Route> :
                            <Redirect to='/login' />
                    }

                    {
                        // ako se upravo ulogirao ili se vraća u aplikaciju bez odjave (ostaje spremljen)
                        (korisnik || JSON.parse(localStorage.getItem("korisnik"))) ?
                            <Route exact path="/:kratkoIme" component={ChatKanalForma} /> : <Redirect to='/login' />
                    }

                </Switch>
            </Router>
            
            {/* Odabir teme */}
            <div className="odabir-teme">
                <h4><Icon.Droplet size={14} /> Tema</h4>
                <label>
                    <input type="radio" value="skolska" name="tema" onChange={toggleTema} /> Školska
                </label>

                <label>
                    <input type="radio" value="pmf" name="tema" onChange={toggleTema} /> PMF
                </label>
            </div>

        </div>
    );
};

export default App;

