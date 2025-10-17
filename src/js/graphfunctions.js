import '../style.css'
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import { Chart } from 'chart.js/auto';


import 'chartjs-adapter-date-fns';
import * as service from "./services.js"

export { _adapters } from 'chart.js'
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
Chart.register(MatrixController, MatrixElement);

export let datas = [];

let datistat = []

export function grafico(dati, ctx) {

    const existingChart = Chart.getChart("graficoTorta");

    if (existingChart) {
        existingChart.data.datasets[0].data = dati;
        existingChart.update();
        return;
    }

    const graficoTorta = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Elaborati', 'Zero Pioggia', 'Malfunzionanti'],
            datasets: [{

                data: dati,
                backgroundColor: [
                    'rgba(30, 64, 175, 0.6)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(239, 68, 68, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    maxHeight: 100,
                    align: "center",
                    position: 'right'
                },
                title: {
                    text: 'Grafico Cartellini'
                }
            }
        }
    });
}


export function tabella(tabel, where) {
    let datiTabella = [];
    tabel.queryFeatures({
        where: where,
        outFields: ["*"],
        returnGeometry: false
    }).then(result => {
        datiTabella = result.features.map(f => ({ ...f.attributes }));
        service.calcolaMediaESqmPioggia(datiTabella);
        datas = datiTabella
        let tabellasist = datiTabella.map(d => ({
            data: service.formatUnixToDateTime(d.DataOra),
            mm: d.Pioggia_mm,
            qualita: d.Qualita,
            cartellino: d.Cartellino
        }))

        console.log(tabellasist);

        const table = new Tabulator("#example-table", {
            data: tabellasist,
            height: "500px",
            columns: [
                { title: "Data", field: "data" },
                { title: "mm Pioggia", field: "mm" },
                { title: "Qualita", field: "qualita" },
                {
                    title: "Cartellino",
                    formatter: function (cell, formatterParams) {
                        let row = cell.getRow().getData(); // dati di riga
                        return `<a href="https://datascan.it/DatiCentraline/Bovolenta/${row.cartellino}.jpg" target="_blank">${row.cartellino}</a>`;
                    }
                }
            ],

            layout: "fitColumns",
        });
    });
}


export function graficocumulata(graf, tabel, where) {

    const existingChart = Chart.getChart("cumulata");
    let datiTabella = [];
    if (existingChart) {
        tabel.queryFeatures({
            where: where,
            outFields: ["*"],
            returnGeometry: false
        }).then(result => {
            datiTabella = result.features.map(f => ({ ...f.attributes }));
            let cumulata = 0;
            let dati = service.cumula(datiTabella);
            existingChart.data.datasets[0].data = dati;
            existingChart.update();
            return;
        });
        return;
    }

    tabel.queryFeatures({
        where: "1=1",
        outFields: ["*"],
        returnGeometry: false
    }).then(result => {
        let cumulated = 0;
        datiTabella = result.features.map(f => ({ ...f.attributes }));
        let tabellasist = datiTabella.map(d => {
            cumulated += d.Pioggia_mm;
            return {
                x: d.DataOra,
                y: cumulated
            };
        });

        const graficoTorta = new Chart(graf, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Pioggia in mm',
                    data: tabellasist,
                    backgroundColor: '#64748b',
                    spanGaps: true,
                    borderWidth: 0,
                    borderColor: 'blue',      // colore linea
                 
                    fill: false,              // niente area sotto la linea
                    tension: 10,               // 0 = linee dritte tra punti, >0 = curve
                    pointRadius: 3
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                parsing: false,
                scales: {
                    x: {
                        ticks: {
                            autoSkip: true, // disabiliti autoSkip
                            maxTicksLimit: 5,

                        },
                        type: 'time',
                        time: {
                            unit: 'day',
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'mm'
                        }
                    }
                }
            },
        });
    });


}


export function graficoietogramma(graf, tabel, where) {

    const existingChart = Chart.getChart("ietogramma");
    let datiTabella = [];
    if (existingChart) {
        tabel.queryFeatures({
            where: where,
            outFields: ["*"],
            returnGeometry: false
        }).then(result => {
            datiTabella = result.features.map(f => ({ ...f.attributes }));
            existingChart.data.datasets[0].data = service.pergiornoietogramma(datiTabella);
            existingChart.update();
            return;
        });
        return;
    }

    tabel.queryFeatures({
        where: "1=1",
        outFields: ["*"],
        returnGeometry: false
    }).then(result => {
        datiTabella = result.features.map(f => ({ ...f.attributes }));
        let tabellasist = datiTabella.map(d => ({
            x: d.DataOra,
            y: d.Pioggia_mm,
        }))

        const graficoTorta = new Chart(graf, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'mm/h',
                    data: service.pergiornoietogramma(datiTabella),
                    backgroundColor: '#64748b',
                    borderWidth: 0
                }]
            },
            options: {
                legend: {
                    display: false
                },
                parsing: false,
                scales: {
                    x: {
                        ticks: {
                            autoSkip: true, // disabiliti autoSkip
                            maxTicksLimit: 5,

                        },
                        type: 'time',
                        time: {
                            unit: 'day',
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'mm/h'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            },

        });
    });
}


export function graficoietogrammaPreciso(graf, tabel, where) {

    const existingChart = Chart.getChart("ietogramma");
    let datiTabella = [];
    if (existingChart) {
        tabel.queryFeatures({
            where: where,
            outFields: ["*"],
            returnGeometry: false
        }).then(result => {
            datiTabella = result.features.map(f => ({ ...f.attributes }));
            existingChart.data.datasets[0].data = service.peroraietogramma(datiTabella);
            existingChart.update();
            return;
        });
        return;
    }

    tabel.queryFeatures({
        where: "1=1",
        outFields: ["*"],
        returnGeometry: false
    }).then(result => {
        datiTabella = result.features.map(f => ({ ...f.attributes }));
        let tabellasist = datiTabella.map(d => ({
            x: d.DataOra,
            y: d.Pioggia_mm,
        }))

        const graficoTorta = new Chart(graf, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'mm/h',
                    data: tabellasist,
                    backgroundColor: '#64748b',
                    borderWidth: 0
                }]
            },
            options: {
                legend: {
                    display: false
                },
                parsing: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                        }

                    },
                    y: {
                        title: {
                            display: true,
                            text: 'mm/h'
                        }
                    }
                }
            },

        });
    });



}


function internalmatrix(ctx, dati) {


    const scales = {
        y: {
            type: 'time',
            offset: true,
            time: {
                unit: 'day',
                round: 'day',
                isoWeekday: 1,
                parser: 'i',
                displayFormats: {
                    day: 'iiiiii'
                }
            },
            reverse: true,
            position: 'right',
            ticks: {
                maxRotation: 0,
                autoSkip: true,
                padding: 1,
                font: {
                    size: 9
                }
            },
            grid: {
                display: false,
                drawBorder: false,
                tickLength: 0
            }
        },
        x: {
            type: 'time',
            position: 'bottom',
            offset: true,
            time: {
                unit: 'week',
                round: 'week',
                isoWeekday: 1,
                displayFormats: {
                    week: 'MMM dd'
                }
            },
            ticks: {
                maxRotation: 0,
                autoSkip: true,
                font: {
                    size: 9
                }
            },
            grid: {
                display: false,
                drawBorder: false,
                tickLength: 0,
            }
        }
    };

    const data = {
        datasets: [{
            label: 'My Matrix',
            data: dati,
            shadowOffsetX: 0,            // ✅ niente ombra (se usato)
            shadowOffsetY: 0,
            shadowBlur: 0,
            shadowColor: 'transparent',
            backgroundColor(c) {
                const value = c.dataset.data[c.dataIndex].v;

                return getColorFromValue(value);
            },
            borderColor(c) {

                return '#ffffff';
            },


            borderWidth: 1.5,

            hoverBorderColor: 'blue',
            width(c) {
                const a = c.chart.chartArea || {};
                return (a.right - a.left) / 53 - 1;
            },
            height(c) {
                const a = c.chart.chartArea || {};
                return (a.bottom - a.top) / 7 - 1;
            }
        }]
    };

    function getColorFromValue(value) {
        const v = Math.min(Math.max(value, 0), 100) / 100;

        // Funzione easing (quadratica morbida)
        const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const t = easeInOutQuad(v);

        const startColor = { r: 241, g: 245, b: 249 }; // slate-100 (#f1f5f9)
        const endColor = { r: 100, g: 116, b: 139 };     // slate-500  (#64748b)

        const r = Math.round(startColor.r + (endColor.r - startColor.r) * t);
        const g = Math.round(startColor.g + (endColor.g - startColor.g) * t);
        const b = Math.round(startColor.b + (endColor.b - startColor.b) * t);

        const toHex = (x) => x.toString(16).padStart(2, '0');

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    const options = {
        aspectRatio: 6,
        plugins: {
            legend: false,
            tooltip: {
                displayColors: false,
                callbacks: {
                    title() {
                        return '';
                    },
                    label(context) {
                        const v = context.dataset.data[context.dataIndex];
                        return ['Giorno: ' + v.d, ' Ore presenti: ' + v.v.toFixed(2)] + '%';
                    }
                }
            },
        },
        scales: scales,
        layout: {
            padding: {
                top: 10
            }
        }
    };

    new Chart(ctx, {
        type: 'matrix',
        data: data,
        options: options,
        scales: scales,
    });
}


const shadowPlugin = {
    id: 'shadowLine',
    beforeDatasetsDraw(chart, args, options) {
        const { ctx } = chart;
        ctx.save();
        ctx.shadowColor = options.shadowColor || 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = options.shadowBlur || 10;
        ctx.shadowOffsetX = options.shadowOffsetX || 0;
        ctx.shadowOffsetY = options.shadowOffsetY || 4;
    },
    afterDatasetsDraw(chart, args, options) {
        chart.ctx.restore();
    }
};


export function matrix(tabel, ctx, query) {

    let dati = []
    const existingChart = Chart.getChart("matrix");

    if (existingChart) {
        tabel.queryFeatures({
            where: query,
            outFields: ["*"],
            returnGeometry: false,
            num: 365
        }).then(result => {
            let datiTabella = result.features.map(f => ({ ...f.attributes }));
            datiTabella.forEach(element => {
                let dt = new Date(element.Data)
                let iso = dt.toISOString().substring(0, 10);
                dati.push({
                    x: iso,
                    y: isoDayOfWeek(dt),
                    d: iso,
                    v: ((element.Ore_Presenti / 24) * 100)
                });
            });
            existingChart.data.datasets[0].data = dati;
            existingChart.update();
        });
        return;
    }

    tabel.queryFeatures({
        where: query,
        outFields: ["*"],
        returnGeometry: false,
        num: 365
    }).then(result => {

        let datiTabella = result.features.map(f => ({ ...f.attributes }));
        datiTabella.forEach(element => {
            let dt = new Date(element.Data)
            let iso = dt.toISOString().substring(0, 10);
            dati.push({
                x: iso,
                y: isoDayOfWeek(dt),
                d: iso,
                v: ((element.Ore_Presenti / 24) * 100)
            });
        });
        console.log(dati)
        internalmatrix(ctx, dati)
    })

}

var _seed = Date.now()

export function srand(seed) {
    _seed = seed
}

export function rand(min, max) {
    min = valueOrDefault(min, 0)
    max = valueOrDefault(max, 0)
    _seed = (_seed * 9301 + 49297) % 233280
    return min + (_seed / 233280) * (max - min)
}

export function numbers(config) {
    var cfg = config || {}
    var min = valueOrDefault(cfg.min, 0)
    var max = valueOrDefault(cfg.max, 100)
    var from = valueOrDefault(cfg.from, [])
    var count = valueOrDefault(cfg.count, 8)
    var decimals = valueOrDefault(cfg.decimals, 8)
    var continuity = valueOrDefault(cfg.continuity, 1)
    var dfactor = Math.pow(10, decimals) || 0
    var data = []
    var i, value

    for (i = 0; i < count; ++i) {
        value = (from[i] || 0) + this.rand(min, max)
        if (this.rand() <= continuity) {
            data.push(Math.round(dfactor * value) / dfactor)
        } else {
            data.push(null)
        }
    }

    return data
}

export function isoDayOfWeek(dt) {
    let wd = dt.getDay() // 0..6, from sunday
    wd = ((wd + 6) % 7) + 1 // 1..7 from monday
    return '' + wd // string so it gets parsed
}

export function startOfToday() {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
}
