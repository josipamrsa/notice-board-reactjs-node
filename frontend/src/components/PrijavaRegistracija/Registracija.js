//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React from 'react';
import * as Icon from 'react-feather';

const Registracija = (props) => {
        return (
                <form onSubmit={props.registracija} className="forma-registracija">
                        <h1>Registracija u sustav</h1>

                        <input type="text"
                                placeholder="Unesite vašu email adresu"
                                value={props.adresa}
                                onChange={props.promjenaMail} />

                        <input type="password"
                                placeholder="Unesite željenu lozinku"
                                value={props.lozinka}
                                onChange={props.promjenaLozinka} />

                        <input type="text"
                                placeholder="Unesite vaše ime"
                                value={props.ime}
                                onChange={props.promjenaIme} />

                        <input type="text"
                                placeholder="Unesite vaše prezime"
                                value={props.prezime}
                                onChange={props.promjenaPrezime} />

                        <div className="odabir-razina">
                                <h4>Ja sam...</h4>
                                <label>
                                        <input type="radio"
                                                name="razina"
                                                value="nastavnik"
                                                onChange={props.promjenaRazine} /> Nastavnik
                                </label>

                                <label>
                                        <input type="radio"
                                                name="razina"
                                                value="student"
                                                onChange={props.promjenaRazine} /> Student
                                </label>
                        </div>

                        <button type="submit"><Icon.UserPlus size={18} /> Registracija</button>
                </form>
        );
};

export default Registracija;