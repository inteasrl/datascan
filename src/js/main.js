var amount = document.getElementById('count');
const presentazione = document.getElementById('presentazione')
const finale = document.getElementById('finale')
const lifin = document.getElementsByClassName('fin');
let profs = document.getElementsByClassName('prof')
var current = 0;

update();

function update() {
    amount.innerText = current.toLocaleString("en-US");
}

Array.from(lifin).forEach(f =>{

    f.addEventListener("click", () => {

        Array.from(lifin).forEach(d =>{
            d.classList.remove("finLi")
        })

        f.classList.add("finLi")
    })
})
    
const tabs = document.querySelectorAll('.tab');

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    final(index + 1); // Chiamerà final(1), final(2), ecc.

    tabs.forEach(t => t.classList.remove('sel'));
    tab.classList.add('sel');
  });
});
  
setInterval(function () {
    if (current < 3440000) {
        current = current + 4523
    }
    update();
}, 0.0001);

console.log(profs)

for (let i = 0; i < profs.length; i++) {
    profs[i].addEventListener("click", function () {
        descrizione(i)
        
        // Rimuove "selected" da tutti
        for (let j = 0; j < profs.length; j++) {
            profs[j].classList.remove("selected");
          
        }
        // Aggiunge "selected" solo a quello cliccato
        this.classList.add("selected");
    });
}

for (let i = 0; i < lifin.length; i++) {
    lifin[i].addEventListener("click", function () {
        finalita(i)
        // Rimuove "selected" da tutti
        for (let j = 0; j < profs.length; j++) {
            lifin[j].classList.remove("selected");
          
        }
      
    });
}

let findiv = document.getElementById("findiv")

function finalita (caso) {
       switch (caso){
        case 0:
            findiv.innerHTML = "Il progetto <strong>DATASCAN</strong> mira alla <strong>digitalizzazione</strong> dei dati contenuti nei cartellini pluviometrici conservati dagli ex uffici compartimentali. Questi dati, raccolti per decenni e pubblicati negli <strong>Annali Idrologici</strong>, rappresentano una risorsa per la comprensione dei fenomeni climatici. L’obiettivo è trasformare questi archivi cartacei in <strong>dataset numerici</strong> ad <strong>alta risoluzione</strong>"
        break
        case 1:
             findiv.innerHTML = "Una delle finalità centrali è la realizzazione di un sistema <strong>semi-automatico</strong> basato su <strong>OCR</strong> e tecniche di <strong>segmentazione dell’immagine</strong>, capace di leggere le strisce di carta dei cartellini. Questo sistema sarà in grado di riconoscere il <strong>tracciato pluviometrico</strong> (<em>ietogramma</em>), ricostruendo con precisione la <strong>pioggia cumulata</strong> con risoluzione <strong>sub-giornaliera</strong>"
        break
        case 2:
             findiv.innerHTML = "Il progetto prevede la creazione di un <strong>geodatabase</strong>, pensato per rendere agevole l’<strong>archiviazione</strong>, la <strong>consultazione</strong> e l’<strong>analisi</strong> dei dati. Questo database sarà integrato in una <strong>piattaforma</strong> basata su <strong>ArcGIS Online</strong>, consentendo la <strong>visualizzazione spaziale</strong> dei dati, l’applicazione di algoritmi di <strong>controllo</strong> e l’elaborazione di <strong>trend</strong> idrologici"
        break
        case 3:
             findiv.innerHTML = "<strong>DATASCAN</strong> offre alla <strong>comunità scientifica</strong> e ai <strong>decisori politici</strong> un insieme di <strong>dati georiferiti</strong> liberamente accessibili, relativi a <strong>precipitazioni</strong> con risoluzione temporale <strong>oraria</strong> o <strong>sub-oraria</strong>. Questo rappresenta un passo avanti per migliorare le <strong>stime statistiche</strong> dei fenomeni estremi e per analizzare i segnali di <strong>cambiamento climatico</strong> su scala nazionale.</p>"
        break
        case 4:
             findiv.innerHTML = "Grazie all’elevato dettaglio e alla lunga estensione delle serie, i dati ottenuti  potranno essere impiegati in applicazioni di <strong>modellazione idrologica</strong>, <strong>simulazione di eventi estremi</strong>, calibrazione di <strong>modelli afflussi-deflussi</strong> e valutazione di <strong>rischio climatico</strong>. Il progetto fornisce così un’infrastruttura dati per lo sviluppo di strumenti <strong>previsionali avanzati</strong>"
        break
    }
} 

function descrizione (caso ) {
    switch (caso){
        case 0:
            presentazione.innerHTML = "Il progetto inizia con l’acquisizione e la scansione dei cartellini pluviometrici conservati negli archivi idrografici. I dati registrati su supporti cartacei vengono convertiti in formato digitale mediante tecniche di elaborazione delle immagini. Viene sviluppato un software dedicato per trasformare i tracciati pluviometrici in valori numerici, permettendo così di ottenere serie storiche a risoluzione sub-giornaliera."
        break
        case 1:
             presentazione.innerHTML = "I dati estratti vengono sottoposti a un rigoroso processo di validazione tramite confronti con gli Annali Idrologici ufficiali. Un'interfaccia grafica consente il controllo visivo e la correzione dei tracciati pluviometrici. Viene verificata l’affidabilità dei dati e segnalata ogni incongruenza. Per i dati di temperatura e livello idrometrico si utilizzano tecniche OCR supportate da controlli incrociati con le medie e i valori giornalieri pubblicati."
        break
        case 2:
             presentazione.innerHTML = "Una volta validati, i dati vengono organizzati in un geodatabase accessibile tramite WebGIS (ArcGIS Online), per permettere analisi statistiche su scala temporale e spaziale. Si studiano trend climatici, eventi estremi e autocorrelazioni, con la possibilità di visualizzare e interrogare i dati su base geografica. La piattaforma è pensata per essere uno strumento aperto, utile alla ricerca, alla pianificazione e alla gestione dei rischi idro-meteorologici."
        break   
    }
}

function aspect (caso ) {
    switch (caso){
        case 2:
            presentazione.innerHTML = "Il progetto <strong>DATASCAN</strong> si propone di <strong>recuperare e digitalizzare</strong> dati idro-meteo storici ad <strong>alta risoluzione temporale</strong>, rendendoli disponibili per <strong>analisi ambientali</strong> e <strong>modellazione idrologica</strong>. Attraverso <strong>tecnologie OCR</strong>, segmentazione immagini e sviluppo di un <strong>geodatabase</strong> georiferito, si mira a produrre <strong>serie temporali continue</strong> di precipitazione, temperatura e livello idrometrico. I dati saranno integrati in una <strong>piattaforma WebGIS</strong> interattiva per la <strong>visualizzazione</strong> e il <strong>controllo</strong> dei dati. Si attende un impatto rilevante per la ricerca sul <strong>cambiamento climatico</strong> e per la <strong>resilienza territoriale</strong> ai rischi idrologici"
        break
        case 1:
             presentazione.innerHTML = "Grazie al <strong>finanziamento europeo</strong> del programma <strong>Next Generation EU</strong>, il progetto <strong>DATASCAN</strong> ha raggiunto importanti traguardi. Sono stati <strong>digitalizzati</strong> migliaia di cartellini storici relativi a <strong>piogge, temperature</strong> e <strong>livelli idrometrici</strong>. È stato sviluppato un <strong>software</strong> per l’elaborazione automatica delle strisce pluviometriche e implementata una <strong>piattaforma WebGIS</strong> per l’accesso libero ai dati. I <strong>dataset georiferiti</strong> sono ora consultabili per studi sul <strong>clima</strong> e sulla <strong>gestione del rischio</strong>. Il progetto ha dimostrato l’efficacia della <strong>digitalizzazione storica</strong> come strumento di supporto alla <strong>pianificazione ambientale</strong> e alla <strong>ricerca scientifica</strong>."
        break
     k
    }
}

function final (caso ) {
    switch (caso){
        case 1:
            finale.innerHTML = "Il progetto <strong>DATASCAN</strong> si propone di <strong>recuperare e digitalizzare</strong> dati idro-meteo storici ad <strong>alta risoluzione temporale</strong>, rendendoli disponibili per <strong>analisi ambientali</strong> e <strong>modellazione idrologica</strong>. Attraverso <strong>tecnologie OCR</strong>, segmentazione immagini e sviluppo di un <strong>geodatabase</strong> georiferito, si mira a produrre <strong>serie temporali continue</strong> di precipitazione, temperatura e livello idrometrico. I dati saranno integrati in una <strong>piattaforma WebGIS</strong> interattiva per la <strong>visualizzazione</strong> e il <strong>controllo</strong> dei dati. Si attende un impatto rilevante per la ricerca sul <strong>cambiamento climatico</strong> e per la <strong>resilienza territoriale</strong> ai rischi idrologici"
        break
        case 2:
             finale.innerHTML = "Grazie al <strong>finanziamento europeo</strong> del programma <strong>Next Generation EU</strong>, il progetto <strong>DATASCAN</strong> ha raggiunto importanti traguardi. Sono stati <strong>digitalizzati</strong> migliaia di cartellini storici relativi a <strong>piogge, temperature</strong> e <strong>livelli idrometrici</strong>. È stato sviluppato un <strong>software</strong> per l’elaborazione automatica delle strisce pluviometriche e implementata una <strong>piattaforma WebGIS</strong> per l’accesso libero ai dati. I <strong>dataset georiferiti</strong> sono ora consultabili per studi sul <strong>clima</strong> e sulla <strong>gestione del rischio</strong>. Il progetto ha dimostrato l’efficacia della <strong>digitalizzazione storica</strong> come strumento di supporto alla <strong>pianificazione ambientale</strong> e alla <strong>ricerca scientifica</strong>."
        break
     k
    }
}
