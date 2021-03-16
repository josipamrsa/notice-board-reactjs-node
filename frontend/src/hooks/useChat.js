//----KONFIGURACIJA----//
import { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:3001";  // ne znam još hoće li ostati ovaj url 

//----DOGAĐAJI----//
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";                        // Događaj nove poruke
const NEW_MESSAGE_NOTIFICATION_EVENT = "newMessageNotification";        // Događaj obavijesti o novoj poruci
const USER_EJECTED_FROM_CHANNEL_EVENT = "userEjectedNotification";      // Događaj obavijesti o izbacivanju korisnika

const useChat = (kratkoIme, idKorisnika) => {
    //----Stanja----//
    
    const [poruke, postaviPoruke] = useState([]);               // Prijenos poruka među korisnicima
    const [obavijesti, postaviObavijesti] = useState([]);       // Slanje obavijesti izbačenim korisnicima
    const socketRef = useRef();                                 // Perzistira do kraja životnog ciklusa aplikacije

    //----WebSocket komunikacija----//

    // Stvaranje WebSocket veze
    useEffect(() => {
        socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
            query: {
                soba: kratkoIme
            }
        });

        // Osluškivanje nove poruke
        socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (poruka) => {
            const nadolazecaPoruka = { ...poruka };
            postaviPoruke((poruke) => [...poruke, nadolazecaPoruka]);
            console.log(nadolazecaPoruka);
        });

        // Osluškivanje izbacivanja korisnika
        socketRef.current.on(USER_EJECTED_FROM_CHANNEL_EVENT, (obavijest) => {
            const nadolazecaObavijest = { ...obavijest };
            if (nadolazecaObavijest.kratkoIme === kratkoIme && idKorisnika === nadolazecaObavijest.korisnik) {
                postaviObavijesti((obavijesti) => [...obavijesti, nadolazecaObavijest]);
                console.log(nadolazecaObavijest);
            }
        });

        // Micanje reference nakon prekida veze
        return () => { socketRef.current.disconnect(); }
    }, [kratkoIme]);


    //----Metode----//

    // Slanje poruke - svim korisnicima sobe i slanje obavijesti pretplatnicima
    const saljiPoruku = (poruka) => {
        const { obavijesna, sadrzaj, autor, datum, kanal, imeKanala } = poruka;
        socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
            obavijesna,
            sadrzaj,
            autor,
            datum,
            socketId: socketRef.current.id
        });
        socketRef.current.emit(NEW_MESSAGE_NOTIFICATION_EVENT, {
            kanal,
            korisnik: autor.id,
            imeKanala,
            tipObavijesti: obavijesna ? "NOVA_OBAVIJESNA_PORUKA" : "NOVA_PORUKA"
        });
    };

    // Slanje obavijesti o izbačenom korisniku
    const izbaciKorisnika = (kanal, korisnik, imeKanala, kratkoIme) => {
        socketRef.current.emit(USER_EJECTED_FROM_CHANNEL_EVENT, {
            kanal,
            korisnik,
            imeKanala,
            kratkoIme,
            tipObavijesti: "KORISNIK_IZBACEN"
        });
    }

    return { 
        poruke, 
        obavijesti, 
        postaviPoruke, 
        saljiPoruku, 
        izbaciKorisnika 
    };
}

export default useChat;