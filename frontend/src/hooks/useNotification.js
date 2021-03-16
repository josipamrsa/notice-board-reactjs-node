//----KONFIGURACIJA----//
import { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:3001";  // ne znam još hoće li ostati ovaj url

//----DOGAĐAJI----//
const NEW_MESSAGE_NOTIFICATION_EVENT = "newMessageNotification";        // Događaj obavijesti o novoj poruci
const USER_EJECTED_FROM_CHANNEL_EVENT = "userEjectedNotification";      // Događaj obavijesti o izbacivanju korisnika

const useNotification = (idKorisnika, pretplate) => {
    //----Stanja----//

    const [obavijesti, postaviObavijesti] = useState([]);   // Obavijesti s pretplaćenih kanala
    const pretplateId = 
        typeof(pretplate) === "string" ? 
        pretplate : 
        pretplate.map(p => p.id);                           // ID-ovi pretplatnih kanala (maknuti provjeru za jedan?)

    const socketRef = useRef();                             // Perzistira do kraja životnog ciklusa aplikacije

    //----WebSocket konfiguracija----//
    
    // Stvaranje WebSocket veze
    useEffect(() => {
        socketRef.current = socketIOClient(SOCKET_SERVER_URL);
        
        // Osluškivanje obavijesti za nove poruke
        socketRef.current.on(NEW_MESSAGE_NOTIFICATION_EVENT, (obavijest) => {
            const nadolazecaObavijest = { ...obavijest };
            if (idKorisnika !== nadolazecaObavijest.korisnik && pretplateId.includes(nadolazecaObavijest.kanal)) {
                postaviObavijesti((obavijesti) => [...obavijesti, nadolazecaObavijest]);
            }
        });

        // Osluškivanje obavijesti za izbačenog korisnika
        socketRef.current.on(USER_EJECTED_FROM_CHANNEL_EVENT, (obavijest) => {
            const nadolazecaObavijest = { ...obavijest };
            if (idKorisnika === nadolazecaObavijest.korisnik && pretplateId.includes(nadolazecaObavijest.kanal)) {
                postaviObavijesti((obavijesti) => [...obavijesti, nadolazecaObavijest]);
            }
        });

        // Micanje reference nakon prekida veze
        return () => { socketRef.current.disconnect(); }
    }, [idKorisnika, pretplate]);

    return { obavijesti };
}

export default useNotification;