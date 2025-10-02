import '../style.css'
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";


import { Italian } from "flatpickr/dist/l10n/it.js";

import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";

import * as graph from "./graphfunctions.js"
import * as service from "./services.js"

async function loadTabulatorCSS() {
  await import("tabulator-tables/dist/css/tabulator.min.css");
}




const ctx = document.getElementById('graficoTorta').getContext('2d');
const cumul = document.getElementById('cumulata').getContext('2d');
const iet = document.getElementById('ietogramma').getContext('2d');

const sel = document.getElementById('sel')
const mappa = document.getElementById('viewDiv')
const dat = document.getElementById('datediv')

const tablediv = document.getElementById("tablediv")


const infodisp = document.getElementById("infodisp")

const appearOC = document.getElementsByClassName("appearOC")
const info = document.getElementsByClassName("info")
const range = document.getElementsByClassName("range")

const disapp = document.getElementsByClassName("disappearOC")

const coommits = document.getElementById('matrix').getContext('2d');
const selmob = document.getElementById("sel2")

const selector = document.getElementsByClassName("selector")


const infoStazione = document.getElementById("info-stazione");
const metadati = document.getElementById("metadati");

const globalID = document.getElementById("globalID");
const codiceArpa = document.getElementById("codiceArpa");
const indirizzo = document.getElementById("indirizzo");
const ellissoide = document.getElementById("ellissoide");
const arpa = document.getElementById("arpa");

const divLista = document.getElementById("divLista");

const close = document.getElementById("closeList");
close.addEventListener("click", () => {
  divLista.style.padding = "1"

  divLista.style.width = "0px";
  close.style.display = "none"
  open.style.display = "block"
})

const open = document.getElementById("openList");
open.addEventListener("click", () => {
  divLista.style.padding = "20"
  divLista.style.width = "100%";
  close.style.display = "block"
  open.style.display = "none"
})

for (let i = 0; i < selector.length; i++) {
  selector[i].addEventListener("click", function () {
    // reset di tutti i tab
    for (let j = 0; j < selector.length; j++) {
      selector[j].classList.remove("tab-active");
      selector[j].classList.add("tab-inactive");
    }

    // attivo solo quello cliccato
    this.classList.remove("tab-inactive");
    this.classList.add("tab-active");

    // toggle visibilità in base a quale tab è stato cliccato
    if (i === 1) {
      // primo tab selezionato
      infoStazione.classList.add("hidden");
      metadati.classList.remove("hidden");
    } else {
      // secondo tab selezionato
      infoStazione.classList.remove("hidden");
      metadati.classList.add("hidden");
    }
  });
}

Array.from(info).forEach(f => {
  f.addEventListener('mouseenter', function () {
    f.nextElementSibling.style.display = "flex";
  })

  f.addEventListener('mouseleave', () => {
    f.nextElementSibling.style.display = "none";
  });
})



const originalTransition = getComputedStyle(mappa).transition;
let datas = []

if (window.matchMedia("(min-width:1080px)").matches) {
  mappa.style.width = "185%"
  mappa.style.transition = "none";
  dat.style.display = "hidden"
  selmob.style.display = "none"
} else {
  console.log("Siamo sotto sm (base)");
  mappa.style.transition = "none";
  mappa.style.width = "100%"
  mappa.style.height = "180%";
  dat.style.display = "none"
  sel.style.display = "none";
  mappa.style.boxShadow = "0px 5px 8px -4px rgba(0, 0, 0, 0.25)"
}

let tabel = null;
let tabelStat = null;

export let cal; // variabile globale / export

async function loadFlatCSS() {
  if (document.getElementById('flatpickr-css')) return; // già caricato
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.id = 'flatpickr-css';
    link.rel = 'stylesheet';
    link.href = './flatpickr/flatpickr.min.css'; // percorso locale
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

export async function initFlatpickr() {
  await loadFlatCSS(); // carica il CSS
  const { default: flatpickr } = await import("flatpickr"); // importa JS

  cal = flatpickr("#datePicker", {
    inline: true,
    mode: "range",
    locale: Italian,
    onChange: function (selectedDates, dateStr, instance) {
      console.log("ciaoo " + dateStr);

      if (selectedDates.length >= 2) {
        const maxDays = 80;
        const start = selectedDates[0];
        const end = selectedDates[1];
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (diffDays > maxDays) {
          alert(`Puoi selezionare al massimo ${maxDays} giorni`);
          instance.setDate([start], true);
        }

        Array.from(range).forEach(f => f.innerHTML = dateStr);
        infodisp.innerHTML = dateStr.substring(0, 10) + " ~ " +
          (parseInt(dateStr.substring(0, 4)) + 1) + dateStr.substring(4, 10);

        const query = `DataOra BETWEEN '${dateStr.substring(0, 10)}' AND '${dateStr.substring(14, 25)}'`;
        const queryStat = `Data > '${dateStr.substring(0, 10)}'`;

        console.log(query);
        graph.graficocumulata(cumul, tabel, query);
        graph.matrix(tabelStat, coommits, queryStat);

        if (service.differenzaMinoreDiQuattroGiorni(
          new Date(dateStr.substring(0, 10)),
          new Date(dateStr.substring(dateStr.length - 10))
        )) {
          graph.graficoietogrammaPreciso(iet, tabel, query);
        } else {
          graph.graficoietogramma(iet, tabel, query);
        }

        if (!query) {
          tabella(tabel, "1=1");
        } else {
          tabella(tabel, query);
        }
      }
    }
  });

  return cal; // ritorna l’istanza se vuoi usarla subito
}

document.querySelector("#datePicker").addEventListener("focus", async () => {
  await initFlatpickr();
}, { once: true });

const webmap = new WebMap({
  portalItem: {
    id: "07696c5b72e64125ae75f65226471f60",
    popupEnabled: false
  },

});

const view = new MapView({
  container: "viewDiv",
  map: webmap,
  ui: { components: [] } 
});

view.popup.highlightEnabled = false;
view.container.addEventListener('mousedown', function (e) {
  e.preventDefault(); // Impedisce il focus per rimuovere la outline nera bruttissima
});

const highlightSymbol = {
  type: "simple-marker",
  style: "circle",
  color: [255, 255, 255, 0.7],  // bianco trasparente
  size: "12px",
  outline: {
    color: [0, 0, 0, 0.8],
    width: 1
  }
};

const highlightLayer = new GraphicsLayer();
highlightLayer.listMode = "show";
highlightLayer.order = 999; // Lo porta sopra
webmap.layers.add(highlightLayer);

view.when(() => {
  // Trova il layer interessato
  const layer = view.map.layers.find(l => l.title === "Centraline");

  console.log("Tipo geometria:", layer.geometryType);
  layer.labelsVisible = false;
  layer.queryFeatures({
    where: "1=1",
    outFields: ["*"],
    returnGeometry: false
  }).then(result => {
    let dati = result.features.map(f => ({ ...f.attributes }));
    dati.sort((a, b) => a.Nome_Stazione.localeCompare(b.Nome_Stazione, 'it', { sensitivity: 'base' }));


    //gestione lista
    document.getElementById("listaStazioni").removeAll
    for (let i in dati) {

      const li = document.createElement("li") // nuovo li ogni giro
      li.innerHTML = dati[i].Nome_Stazione
      li.classList.add("cursor-pointer")
      li.classList.add("w-fit")
      li.classList.add("hover:text-slate-500")

      li.addEventListener("click", () => {
        const lista = document.getElementById("listaStazioni")
        tabelStat = tabelStat = webmap.tables.find(t => t.title === dati[i].ID_Centralina + "_Stat")
        tabel = webmap.tables.find(t => t.title === dati[i].ID_Centralina)
        for (const li of lista.children) {
          li.addEventListener("click", () => {
            // resetta il colore a tutti
            for (const other of lista.children) {
              other.style.color = ""   // reset (torna al CSS/Tailwind di default)
            }

            // applica colore solo al selezionato
            li.style.color = "#ce9158"
          })
        }
        divLista.style.padding = "1"
        highlightLayer.removeAll();
        divLista.style.width = "0px";
        close.style.display = "none"
        open.style.display = "block"

        const highlightSymbol = {
          type: "simple-marker",
          style: "circle",
          color: [255, 255, 255, 1],  // Bianco pieno
          size: "17px",               // Più visibile
          outline: {
            color: [216, 145, 80, 1],      // Bordo nero
            width: 2
          }
        };

        const point = new Point({
          longitude: dati[i].Longitudine,
          latitude: dati[i].Latitudine
        });

        const highlightGraphic = new Graphic({
          geometry: point,
          symbol: highlightSymbol
        });
        highlightLayer.add(highlightGraphic);

        const nomeLabel = document.getElementById("nome")
        nomeLabel.innerHTML = dati[i].Nome_Stazione

        const ID_Centralina = document.getElementById("id")
        ID_Centralina.innerHTML = dati[i].ID_Centralina

        const cartellini = document.getElementById("numero")
        cartellini.innerHTML = dati[i].Cart_Elaborati

        const posizione = document.getElementById("posizione")
        posizione.innerHTML = dati[i].Longitudine + "°N " + dati[i].Latitudine + "°E ~ m s.l.m. " + dati[i].Quota + "m"

        globalID.innerHTML = dati[i].globalID
        codiceArpa.innerHTML = dati[i].
          Cod_Arpa

        indirizzo.innerHTML = dati[i].indirizzo
        ellissoide.innerHTML = dati[i].Ellissoide
        arpa.innerHTML = dati[i].Dati_da_Arpa

        graph.grafico([(dati[i].Cart_Elaborati - dati[i].Attenzionati - dati[i].Malfunzionanti - dati[i].Zero_Pioggia - dati[i].Discordanti), dati[i].Zero_Pioggia, dati[i].Malfunzionanti], ctx)

        Array.from(appearOC).forEach(f => {
          if (f.style.visibility === "hidden") {
            f.style.visibility = "visible";
          } else if (f.style.display === "none") {
            f.style.display = "flex";
          }
        })

        Array.from(disapp).forEach(f => {
          if (f.style.visibility === "visible") {
            f.style.visibility = "hidden";
          } else if (f.style.display === "flex") {
            f.style.display = "none";
          }
        })

        spanDefault()
        dispDefault()
        tabella(tabel, "1=1")
        service.calcolaSpan(tabel)

        if (window.matchMedia("(min-width:1080px)").matches) {
          sel.style.display = "none"

        } else {
          mappa.style.height = "100%"
          dat.style.display = "block"

        }

        viewDiv.style.width = "100%";

        sel.style.visibility = "hidden";

        setMinDateFromAPI();
        graph.graficocumulata(cumul, tabel, "1=1")
        graph.graficoietogramma(iet, tabel, "1=1")
        graph.matrix(tabelStat, coommits, "1=1");
        let urltuttidati = 'https://www.datascan.it/DatiCentraline/' + dati[i].ID_Centralina + '.txt'
        document.getElementById('tuttiDati').addEventListener('click', function () {
          window.open(urltuttidati, '_blank');
        });

      })


      document.getElementById("listaStazioni").appendChild(li)
    }
    console.log(dati);
  });


  if (layer) {
    layer.popupEnabled = false;
    view.on("pointer-move", async (event) => {
      const response = await view.hitTest(event);
      const isOverFeature = response.results.some(r => r.graphic?.layer === layer);

      view.container.style.cursor = isOverFeature ? "pointer" : "default";
    });

    view.on("click", async (event) => {
      mappa.style.transition = originalTransition;
      const response = await view.hitTest(event);
      const result = response.results.find(r => r.graphic?.layer === layer);


      if (result) {
        const clickedGraphic = result.graphic;

        const objectId = clickedGraphic.attributes[layer.objectIdField];

        const query = layer.createQuery();
        query.objectIds = [objectId];
        query.outFields = ["*"];
        query.returnGeometry = true;

        const { features } = await layer.queryFeatures(query);

        if (features.length > 0) {
          const fullFeature = features[0];
          console.log("Attributi completi:", fullFeature.attributes);
          highlightLayer.removeAll();
          const highlightSymbol = {
            type: "simple-marker",
            style: "circle",
            color: [255, 255, 255, 1],  // Bianco pieno
            size: "17px",               // Più visibile
            outline: {
              color: [216, 145, 80, 1],      // Bordo nero
              width: 2
            }
          };

          highlightLayer.removeAll(); // pulisce i simboli precedenti
          if (fullFeature.geometry) {
            const highlightGraphic = new Graphic({
              geometry: fullFeature.geometry,
              symbol: highlightSymbol
            });
            highlightLayer.add(highlightGraphic);
          }

          const lista = document.getElementById("listaStazioni")

          for (const li of lista.children) {

            for (const other of lista.children) {
              other.style.color = ""   // reset (torna al CSS/Tailwind di default)
            }
          }

          for (const child of lista.childNodes) {
            if (child.nodeType === 1) { // 1 = elemento, ignora text nodes
              if (child.innerHTML === fullFeature.attributes["Nome_Stazione"]) {
                child.style.color = "#ce9158"
              }
            }
          }
          const nomeLabel = document.getElementById("nome")
          nomeLabel.innerHTML = fullFeature.attributes["Nome_Stazione"]

          const ID_Centralina = document.getElementById("id")
          ID_Centralina.innerHTML = fullFeature.attributes["ID_Centralina"]

          const cartellini = document.getElementById("numero")
          cartellini.innerHTML = fullFeature.attributes["Cart_Elaborati"]

          const posizione = document.getElementById("posizione")
          posizione.innerHTML = fullFeature.attributes["Longitudine"] + "°N " + fullFeature.attributes["Latitudine"] + "°E ~ m s.l.m. " + fullFeature.attributes["Quota"] + "m"

          globalID.innerHTML = fullFeature.attributes["GlobalID"]
          codiceArpa.innerHTML = fullFeature.attributes["Codice Arpa"]
          indirizzo.innerHTML = fullFeature.attributes["Indirizzo"]
          ellissoide.innerHTML = fullFeature.attributes["Ellissoide"]
          arpa.innerHTML = fullFeature.attributes["Dati da Arpa"]


          graph.grafico([(fullFeature.attributes["Cart_Elaborati"] - fullFeature.attributes["Attenzionati"] - fullFeature.attributes["Malfunzionanti"] - fullFeature.attributes["Zero_Pioggia"] - fullFeature.attributes["Discordanti"]), fullFeature.attributes["Zero_Pioggia"], fullFeature.attributes["Malfunzionanti"]], ctx)

          console.log(fullFeature.attributes["ID_Centralina"])
          tabel = webmap.tables.find(t => t.title === fullFeature.attributes["ID_Centralina"])
          tabelStat = webmap.tables.find(t => t.title === fullFeature.attributes["ID_Centralina"] + "_Stat")
          console.log(tabel)

          Array.from(appearOC).forEach(f => {
            if (f.style.visibility === "hidden") {
              f.style.visibility = "visible";
            } else if (f.style.display === "none") {
              f.style.display = "flex";
            }
          })

          Array.from(disapp).forEach(f => {
            if (f.style.visibility === "visible") {
              f.style.visibility = "hidden";
            } else if (f.style.display === "flex") {
              f.style.display = "none";
            }
          })

          spanDefault()
          dispDefault()
          tabella(tabel, "1=1")
          service.calcolaSpan(tabel)

          if (window.matchMedia("(min-width:1080px)").matches) {
            sel.style.display = "none"

          } else {
            mappa.style.height = "100%"
            dat.style.display = "block"

          }

          viewDiv.style.width = "100%";

          sel.style.visibility = "hidden";

          setMinDateFromAPI();
          graph.graficocumulata(cumul, tabel, "1=1")
          graph.graficoietogramma(iet, tabel, "1=1")
          graph.matrix(tabelStat, coommits, "1=1");
          let urltuttidati = 'https://www.datascan.it/DatiCentraline/' + fullFeature.attributes["ID_Centralina"] + '.txt'
          document.getElementById('tuttiDati').addEventListener('click', function () {
            window.open(urltuttidati, '_blank');
          });
        }
      }
    });
  }
});



async function tabella(tabel, where) {
  await loadTabulatorCSS();
  // Import corretto della libreria
  const { TabulatorFull: Tabulator } = await import("tabulator-tables");

  try {
    // Query dei dati (ArcGIS)
    const result = await tabel.queryFeatures({
      where,
      outFields: ["*"],
      returnGeometry: false
    });

    // Estraggo solo gli attributi
    const datiTabella = result.features.map(f => ({ ...f.attributes }));

    // Eventuale calcolo custom
    service.calcolaMediaESqmPioggia(datiTabella);

    // Trasformazione dati per Tabulator
    const tabellasist = datiTabella.map(d => ({
      data: service.formatUnixToDateTime(d.DataOra),
      mm: d.Pioggia_mm,
      qualita: d.Qualita,
      cartellino_f: d.Cartellino_Fronte,
      cartellino_r: d.Cartellino_Retro
    }));

    // Creazione tabella
    new Tabulator("#example-table", {
      data: tabellasist,
      height: "300px",      // <-- come avevi tu
      layout: "fitColumns", // <-- fit columns
      columns: [
        { title: "Data", field: "data" },
        { title: "mm Pioggia", field: "mm" },
        { title: "Qualità", field: "qualita" },
        {
          title: "Fronte Cartellino",
          formatter: function (cell) {
            let row = cell.getRow().getData();
            const el = cell.getElement();

            el.style.backgroundColor = "";
            el.style.color = "";

            if (row.cartellino_r && row.cartellino_f !== "Non disponibile") {
              el.style.color = "#1266CD";
              el.style.textDecoration = "underline";
              return `<a href="https://datascan.it/cartellini/${row.cartellino_f}.jpg" target="_blank">${row.cartellino_f}</a>`;
            } else {
              return row.cartellino_f || "";
            }
          }
        },
        {
          title: "Retro Cartellino",
          formatter: function (cell) {
            let row = cell.getRow().getData();
            const el = cell.getElement();

            el.style.backgroundColor = "";
            el.style.color = "";

            if (row.cartellino_r && row.cartellino_r !== "Non disponibile") {
              el.style.textDecoration = "underline";
              el.style.color = "#1266CD";
              return `<a href="https://datascan.it/cartellini/${row.cartellino_r}.jpg" target="_blank">${row.cartellino_r}</a>`;
            } else {
              return row.cartellino_r || "";
            }
          }
        }
      ]
    });

  } catch (err) {
    console.error("Errore nella creazione della tabella:", err);
  }
}




async function setMinDateFromAPI() {
   if (!cal) {
    await initFlatpickr(); // sicurezza extra
  }
  const minDate = await service.getmindate(tabel);
  const maxdate = await service.getmaxdate(tabel)
  cal.set("minDate", minDate);
  cal.set("maxDate", maxdate);
  initdate(tabel)
}

async function spanDefault() {
  const minDate = await service.getmindate(tabel);
  const maxdate = await service.getLastOfQuery(tabel)
  let str = service.formattaData(new Date(minDate)) + " ~ " + service.formattaData(new Date(maxdate))
  Array.from(range).forEach(f => {

    f.innerHTML = str
  })
}

async function dispDefault() {
  const minDate = await service.getmindate(tabel);

  let date = new Date(minDate);
  date.setFullYear(date.getFullYear() + 1);
  let str = service.formattaData(new Date(minDate)) + " ~ " + service.formattaData(date);

  document.getElementById("infodisp").innerHTML = str

}

async function dispDefaultCal(datstr) {
  const datasub = datstr.substring(0, 10);
  const date = new Date(datasub);

  date.setFullYear(date.getFullYear() + 1);
  let str = datasub + " ~ " + service.formattaData(date);

  document.getElementById("infodisp").innerHTML = str

}


const btn = document.getElementById("download");

btn.addEventListener("click", () => {
  console.log("ciao " + tabel)
  downloadCSV(datas, "datiPioggia.csv");
});

function convertToCSV(objArray) {
  const array = Array.isArray(objArray) ? objArray : JSON.parse(objArray);
  const header = Object.keys(array[0]).join(",") + "\n";
  const rows = array.map(obj => Object.values(obj).join(",")).join("\n");
  return header + rows;
}

function downloadCSV(array, filename = "data.csv") {
  console.log("cioaa")
  const csv = convertToCSV(array);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function initdate(table) {
  if (table == null) {
    cal.jumpToDate(new Date())
  }
  let primorecord;
  table.queryFeatures({
    where: "1=1",
    outFields: ["*"],
    returnGeometry: false,
    num: 1
  }).then((result) => {
    if (result.features.length > 0) {
      primorecord = result.features[0].attributes;
      cal.jumpToDate(new Date(primorecord.DataOra))
    } else {
      console.log("Nessun record trovato.");
    }
  })
}

function matrix() {
  Chart.register(MatrixController, MatrixElement);
}