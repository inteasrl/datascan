var amount = document.getElementById('count');
const presentazione = document.getElementById('presentazione')
const finale = document.getElementById('finale')
const lifin = document.getElementsByClassName('fin');
let profs = document.getElementsByClassName('prof')
var current = 0;

update();

function update() {
    //amount.innerText = current.toLocaleString("en-US");
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
    final(tabs.length - index); // Invertito: primo tab → final(n), ultimo tab → final(1)

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
            findiv.innerHTML = "DATASCAN mira alla digitalizzazione dei dati contenuti nei cartellini pluviometrici conservati dagli ex uffici compartimentali. Questi dati, raccolti per decenni e pubblicati negli Annali Idrologici, rappresentano una risorsa per la comprensione dei fenomeni climatici. L’obiettivo è trasformare questi archivi cartacei in dataset numerici ad alta risoluzione";
        break;
        case 1:
            findiv.innerHTML = "Una delle finalità centrali è la realizzazione di un sistema semi-automatico basato su OCR e tecniche di segmentazione dell’immagine, capace di leggere le strisce di carta dei cartellini. Questo sistema sarà in grado di riconoscere il tracciato pluviometrico (<em>ietogramma</em>), ricostruendo con precisione la pioggia cumulata con risoluzione sub-giornaliera";
            break;
        case 2:
            findiv.innerHTML = "Il progetto prevede la creazione di un geodatabase, pensato per rendere agevole l’archiviazione, la consultazione e l’analisi dei dati. Questo database sarà integrato in una piattaforma basata su ArcGIS Online, consentendo la visualizzazione spaziale dei dati, l’applicazione di algoritmi di controllo e l’elaborazione di trend idrologici";
        break;
        case 3:
            findiv.innerHTML = "DATASCAN offre alla comunità scientifica e ai decisori politici un insieme di dati georiferiti liberamente accessibili, relativi a precipitazioni con risoluzione temporale oraria o sub-oraria. Questo rappresenta un passo avanti per migliorare le stime statistiche dei fenomeni estremi e per analizzare i segnali di cambiamento climatico su scala nazionale.";
        break;
        case 4:
            findiv.innerHTML = "Grazie all’elevato dettaglio e alla lunga estensione delle serie, i dati ottenuti potranno essere impiegati in applicazioni di modellazione idrologica, simulazione di eventi estremi, calibrazione di modelli afflussi-deflussi e valutazione di rischio climatico. Il progetto fornisce così un’infrastruttura dati per lo sviluppo di strumenti previsionali avanzati";
        break;
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

function aspect(caso) {
    switch (caso) {
        case 2:
            presentazione.innerHTML = "Il progetto DATASCAN si propone di recuperare e digitalizzare dati idro-meteo storici ad alta risoluzione temporale, rendendoli disponibili per analisi ambientali e modellazione idrologica. Attraverso tecnologie OCR, segmentazione immagini e sviluppo di un geodatabase georiferito, si mira a produrre serie temporali continue di precipitazione, temperatura e livello idrometrico. I dati saranno integrati in una piattaforma WebGIS interattiva per la visualizzazione e il controllo dei dati. Si attende un impatto rilevante per la ricerca sul cambiamento climatico e per la resilienza territoriale ai rischi idrologici";
            break;
        case 1:
            presentazione.innerHTML = "Grazie al finanziamento europeo del programma Next Generation EU, il progetto DATASCAN ha raggiunto importanti traguardi. Sono stati digitalizzati migliaia di cartellini storici relativi a piogge, temperature e livelli idrometrici. È stato sviluppato un software per l’elaborazione automatica delle strisce pluviometriche e implementata una piattaforma WebGIS per l’accesso libero ai dati. I dataset georiferiti sono ora consultabili per studi sul clima e sulla gestione del rischio. Il progetto ha dimostrato l’efficacia della digitalizzazione storica come strumento di supporto alla pianificazione ambientale e alla ricerca scientifica.";
            break;
    }
}

function final(caso) {
    switch (caso) {
        case 1:
            finale.innerHTML = "Il progetto DATASCAN si propone di recuperare e digitalizzare dati idro-meteo storici ad alta risoluzione temporale, rendendoli disponibili per analisi ambientali e modellazione idrologica. Attraverso tecnologie OCR, segmentazione immagini e sviluppo di un geodatabase georiferito, si mira a produrre serie temporali continue di precipitazione. I dati saranno integrati in una piattaforma WebGIS interattiva per la visualizzazione e il controllo dei dati. Si attende un impatto rilevante per la ricerca sul cambiamento climatico e per la resilienza territoriale ai rischi idrologici";
            break;
        case 2:
            finale.innerHTML = "Grazie al finanziamento europeo del programma NextGenerationEU, il progetto DATASCAN ha raggiunto importanti traguardi. Sono stati digitalizzati migliaia di cartellini storici relativi alle piogge. È stato sviluppato un software per l’elaborazione automatica delle strisce pluviometriche e implementata una piattaforma WebGIS per l’accesso libero ai dati. I dataset georiferiti sono ora consultabili per studi sul clima e sulla gestione del rischio. Il progetto ha dimostrato l’efficacia della digitalizzazione storica come strumento di supporto alla pianificazione ambientale e alla ricerca scientifica.";
            break;
    }
}
