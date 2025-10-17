import '../style.css'
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";

  var webmap = new WebMap({
    portalItem: {
      id: "07696c5b72e64125ae75f65226471f60"  // Inserisci qui l’ID della tua WebMap
    }
  });

  var view = new MapView({
    container: "viewDiv",
    map: webmap,
    constraints: {
      minZoom: 4,
      maxZoom: 4
    },


  });

  view.container.addEventListener("touchstart", e => e.preventDefault());
view.container.addEventListener("touchmove", e => e.preventDefault());
view.container.addEventListener("touchend", e => e.preventDefault());

  view.ui.remove("zoom");
  view.ui.remove("OUTLINE");

  view.on("mouse-wheel", (event) => event.stopPropagation());
  view.on("click", (event) => event.stopPropagation());
  view.on("drag", (event) => event.stopPropagation());
  view.on("double-click", (event) => event.stopPropagation());
  view.on("double-click", ["Control"], (event) => event.stopPropagation());
  view.container.addEventListener('mousedown', function (e) {
    e.preventDefault(); // Impedisce il focus per rimuovere la outline nera bruttissima
  });

  view.when(function () {
    view.goTo(
      {
        center: [-0.48, 41.74],
        zoom: 10
      },
      {
        duration: 4000 // 4 secondi
      }
    );
  });


