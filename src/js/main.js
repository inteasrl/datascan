var amount = document.getElementById('count');
const presentazione = document.getElementById('presentazione')
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

function descrizione (caso ) {
    switch (caso){
        case 0:
            presentazione.innerHTML = "Acquisizione, scansione e digitalizzazione dei cartellini pluviometrici con sviluppo di un software per l’estrazione automatica delle curve di pioggia e validazione tramite interfaccia grafica. Obiettivo: ottenere un dataset digitale sub-giornaliero delle precipitazioni storiche."
        break
        case 1:
             presentazione.innerHTML = "Estrazione dei dati di temperatura e livello idrometrico dagli Annali ISPRA tramite tecniche OCR e verifica manuale. I dati saranno convertiti in formato digitale sub-giornaliero, con controlli incrociati su medie e portate per garantire accuratezza e coerenza con le fonti ufficiali."
        break
        case 2:
             presentazione.innerHTML = "Applicazione di metodi statistici per lo studio delle caratteristiche temporali e distribuzionali dei dati digitalizzati di pioggia, temperatura e livello idrometrico. L’obiettivo è sviluppare una piattaforma analitica per esplorare correlazioni, tendenze e qualità informativa dei dati ricostruiti."
        break
    }
}