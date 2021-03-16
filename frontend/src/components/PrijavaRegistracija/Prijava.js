//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React from 'react';
import * as Icon from 'react-feather';

const Prijava = (props) => {
    return (
        <form onSubmit={props.prijava} className="forma-prijava">
            <h1>Prijava u sustav</h1>

            <input type="text" 
                    placeholder="Email adresa"
                    value={props.adresa}
                    onChange={props.promjenaMail} />

            <input type="password" 
                    placeholder="Lozinka" 
                    value={props.lozinka}
                    onChange={props.promjenaLozinka} />

            <button type="submit"><Icon.LogIn size={18} /> Prijava</button>
        </form>
    );
};

export default Prijava;