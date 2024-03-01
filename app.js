'use strict';

let trs;
let buttons;
let timeoutID; // lo metto fuori dalla funzione gestione_bottone() così che ha una scope globale ed è accessibile da tutti
let alert1 = document.querySelector('.alert')
let variabile_localStorage = JSON.parse(localStorage.getItem('esami'));
let array_esami = variabile_localStorage ? variabile_localStorage : [];


class Esame {
    constructor(data, esame, crediti, voto) {
        this.data = dayjs(data);
        this.esame = esame;
        this.crediti = crediti;
        this.voto = voto;
    };
};

function aggiorna_tabella() {
    return document.querySelectorAll('tbody tr'); // seleziona tutti i tr della tabella
};

function aggiorna_bottoni() {
    return document.querySelectorAll('button');
};

function aggiungi_riga_esame() {
    let dataInput = document.querySelector('#dataInput');
    let esameInput = document.querySelector('#esameInput');
    let creditiInput = document.querySelector('#creditiInput');
    let votoInput = document.querySelector('#votoInput');
    // console.log(dataInput.value);
    let esame = new Esame(dataInput.value, esameInput.value, creditiInput.value, votoInput.value);
    let nuovo_tr = document.createElement('tr');
    for (let key in esame) {
        let nuovo_td = document.createElement('td');
        if (key === 'data') {
            nuovo_td.textContent = esame[key].format('DD/MM/YYYY');          
        } else {
        nuovo_td.textContent = esame[key];
        };
        nuovo_tr.appendChild(nuovo_td);
    };

    let nuovo_bottone = document.createElement('td')
    nuovo_bottone.innerHTML = '<button class="btn btn-danger">X</button>'
    nuovo_tr.appendChild(nuovo_bottone);
    buttons = document.querySelectorAll('button');
    
    nuovo_bottone.addEventListener('click', () => {
        gestione_bottone(nuovo_tr);
    });
    
    trs[trs.length - 1].before(nuovo_tr);

    array_esami.push(esame);
    localStorage.setItem('esami', JSON.stringify(array_esami));

    dataInput.value = '';
    esameInput.value = '';
    creditiInput.value = '';
    votoInput.value = '';
    
};

function gestione_bottone(...args) {

     // quando gestione_bottone() viene chiamata con 2 argomenti da dentro bottoni_esistenti_nel_html()
    let button = args[0];
    let indice_button = args[1];
    // quando gestione_bottone() viene chiamata con 1 argomento da dentro aggiungi_riga_esame()
    let nuovo_tr = args[0];

    let button_inserisci = document.querySelector('#submitButton'); // OPPURE button_inserisci = buttons[buttons.length-1]; 
    
    if (button === button_inserisci) {
        aggiungi_riga_esame();
        clearTimeout(timeoutID);
        alert1.classList.add('alert-success');
        alert1.classList.remove('alert-no-visible', 'alert-danger');
        alert1.textContent = 'Inserimento avvenuto con successo!'
        timeoutID = setTimeout(() => {
            alert1.classList.add('alert-no-visible');
            timeoutID = null;
        }, 1600);

    } else {

        if (timeoutID) {
            args.length === 2 ? trs[indice_button].remove() : nuovo_tr.remove();
            array_esami.splice(indice_button, 1);
            localStorage.setItem('esami', JSON.stringify(array_esami));
            clearTimeout(timeoutID);
            alert1.classList.remove('alert-success');
            alert1.classList.add('alert-no-visible', 'alert-danger');
            alert1.textContent = 'Eliminazione avvenuta con successo!'   
            setTimeout(() => {
                alert1.classList.remove('alert-no-visible');
            }, 50);
            timeoutID = setTimeout(() => {
                alert1.classList.add('alert-no-visible');
                timeoutID = null;
            }, 1650);

        } else {
            args.length === 2 ? trs[indice_button].remove() : nuovo_tr.remove();
            array_esami.splice(indice_button, 1);
            localStorage.setItem('esami', JSON.stringify(array_esami));
            clearTimeout(timeoutID);  
            alert1.classList.remove('alert-no-visible', 'alert-success');
            alert1.classList.add('alert-danger');
            alert1.textContent = 'Eliminazione avvenuta con successo!'
            timeoutID = setTimeout(() => {
                alert1.classList.add('alert-no-visible');
                timeoutID = null;
            }, 1600);
        };        
    };
};

function bottoni_esistenti_nel_html() {

    trs = aggiorna_tabella();
    buttons = aggiorna_bottoni();

    buttons.forEach((button, indice_button) => {
        
        button.addEventListener('click', () => {
            gestione_bottone(button, indice_button);
        });

    });
};

bottoni_esistenti_nel_html();

function costruisci_tabella(esami) {
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    for (let esame of esami) {
        let nuovo_tr = document.createElement('tr');
        
        let td_data = document.createElement('td');
        let td_esame = document.createElement('td');
        let td_crediti = document.createElement('td');
        let td_voto = document.createElement('td');

        esame.data = dayjs(esame.data); // converto la data in un oggetto dayjs quando lo recupero dal localStorage
        td_data.textContent = esame.data.format('DD/MM/YYYY');        
        td_esame.textContent = esame.esame;
        td_crediti.textContent = esame.crediti;
        td_voto.textContent = esame.voto;
    
        nuovo_tr.appendChild(td_data);
        nuovo_tr.appendChild(td_esame);
        nuovo_tr.appendChild(td_crediti);
        nuovo_tr.appendChild(td_voto);

        let td_bottone_elimina = document.createElement('td')
        td_bottone_elimina.innerHTML = '<button class="btn btn-danger">X</button>'
        nuovo_tr.appendChild(td_bottone_elimina);

        tbody.appendChild(nuovo_tr);
    };
    let tr_aggiungi_nuova_riga = document.createElement('tr')
    tr_aggiungi_nuova_riga.innerHTML = 
    `
    <td><input id="dataInput" class="form-control" type="date"></td>
    <td><input id="esameInput" class="form-control" type="text"></td>
    <td><input id="creditiInput" class="form-control" type="text" size="2"></td>
    <td><input id="votoInput" class="form-control" type="text" size="3"></td>
    <td><button id="submitButton" type=submit class="btn btn-success">+</button></td>
    `
    tbody.appendChild(tr_aggiungi_nuova_riga);
    bottoni_esistenti_nel_html();
};

function sort_by_date() {
    let data_sort = document.querySelector('#dataSort');
    let flag = true;
    data_sort.addEventListener('click', (event) => {
        event.preventDefault(); 
        
        if (flag) {
            // al primo click ordina per data in ordine crescente
            let tabella_aggiornata = [...aggiorna_tabella()].slice(0, -1);
            let esami = []
            tabella_aggiornata.forEach((riga) => {
                let data = (riga.children[0].textContent).split('/');
                data = `${data[2]}-${data[1]}-${data[0]}`;  
                esami.push(new Esame(data, riga.children[1].textContent, riga.children[2].textContent, riga.children[3].textContent));
            });
            esami.sort((a, b) => a.data - b.data);
            array_esami = esami;
            localStorage.setItem('esami', JSON.stringify(esami));
            costruisci_tabella(esami);
            flag = false;
            
        } else {
            // al secondo click ordina per data in ordine decrescente, poi riparte con il primo click, ovvero in ordine crescente e così via
            let tabella_aggiornata = [...aggiorna_tabella()].slice(0, -1);
            let esami = []
            tabella_aggiornata.forEach((riga) => {
                let data = (riga.children[0].textContent).split('/');
                data = `${data[2]}-${data[1]}-${data[0]}`;  
                esami.push(new Esame(data, riga.children[1].textContent, riga.children[2].textContent, riga.children[3].textContent));
            });
            esami.sort((a, b) => b.data - a.data);
            array_esami = esami;
            localStorage.setItem('esami', JSON.stringify(array_esami));
            costruisci_tabella(esami);
            flag = true;
        }
            
    });
};

sort_by_date();

if (array_esami.length > 0) {
    costruisci_tabella(array_esami);
}