//----KONFIGURACIJA----//

//----React/ReactDOM----//
import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotifikacija = (props) => {
    //----Metode----//

    // Slanje obavijesti prema tipu dobivene obavijesti
    useEffect(() => {
        // ako ima nekih novih obavijesti
        if (props.obavijesti.length > 0) {
            // dobavi zadnju i provjeri tip, te šalji prikladnu Toast obavijest
            let zadnjaPoslanaObavijest = props.obavijesti[props.obavijesti.length - 1];

            if (zadnjaPoslanaObavijest.tipObavijesti === "NOVA_PORUKA") {
                toast.dark(`Nove poruke na kanalu ${zadnjaPoslanaObavijest.imeKanala}`, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    color: "blue"
                });
            }

            else if (zadnjaPoslanaObavijest.tipObavijesti === "NOVA_OBAVIJESNA_PORUKA") {
                toast(`Nova obavijest na kanalu ${zadnjaPoslanaObavijest.imeKanala}`, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    color: "blue"
                });
            }

            else if (zadnjaPoslanaObavijest.tipObavijesti === "KORISNIK_IZBACEN") {
                toast.error(`Izbačeni ste s kanala ${zadnjaPoslanaObavijest.imeKanala}`, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    color: "blue"
                });
            }
        }
    }, [props.obavijesti]);

    return (
        <div>
            <ToastContainer />
        </div>
    );
}

export default ToastNotifikacija;