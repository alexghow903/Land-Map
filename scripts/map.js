
require(["esri/config","esri/Map", "esri/views/MapView", "esri/Graphic", "esri/layers/GraphicsLayer"], function(esriConfig, Map, MapView, Graphic, GraphicsLayer) {
  esriConfig.apiKey = "AAPK9b79b0e8684944288c145e46deae968ehIoY-Z7Nejz1kE897pGYUbPPaatLMaqHoTcV7gqUH-xxf7tEgTF3Tsi3KlsLTmFy";

    const map = new Map({
      basemap: "arcgis-topographic" // Basemap layer service
    });
    const view = new MapView({
      map: map,
      center: [-97.8796, 37.7528], // Longitude, latitude
      zoom: 5, // Zoom level
      container: "viewDiv" // Div element
    });
    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    function getArea() {
      let get1 = document.getElementById("input1").value;
      const text1 = get1.replace(" ", "%20")
	    const text2 = document.getElementById("input2").value;
      // Grabs input from HTML
      function plotPoints(obj){
        for (let i = 0; i < obj.data.home_search.count; i++) {
          const lat = obj.data.home_search.results[i].location.address.coordinate.lat;
          const long = obj.data.home_search.results[i].location.address.coordinate.lon;
          var name = obj.data.home_search.results[i].location.address.line + ", " + 
          obj.data.home_search.results[i].location.address.city + ", " + 
          obj.data.home_search.results[i].location.address.state_code;
          
          if (obj.data.home_search.results[i].primary_photo.href == null) {
            var desc = "No picture.";
          }
          else {
            var desc = obj.data.home_search.results[i].primary_photo.href;
          }
          // Parsing info from API call

          const point = { //Create a point
            type: "point",
            longitude: long,
            latitude: lat
          };
          const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [0, 0, 255],  // Blue
            outline: {
                color: [255, 255, 255], // White
                width: 1
            }
          };
          const popupTemplate = {
            title: "{Name}",
            content: "{Description}"
          }
          const attributes = {
            Name: name,
            Description: desc
          }
          // Creating a popup
          const pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol,

            attributes: attributes,
            popupTemplate: popupTemplate
          });
          graphicsLayer.add(pointGraphic);
        }
      }
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '0aac9f366emsh48c1737f72fa011p1b5876jsn3f3d3f83f764',
          'X-RapidAPI-Host': 'us-real-estate.p.rapidapi.com'
        }
      };
      // Include get from HTML and paste into variables.
      // Concat variables into url in proper place
      fetch('https://us-real-estate.p.rapidapi.com/v2/for-sale?offset=0&limit=42&state_code=' + text2 + '&city=' + text1 + '&sort=newest', options)
        .then(response => response.json())
        .then(response => plotPoints(response))
        .catch(err => console.error(err));
    }
    
    document.getElementById("thing").addEventListener("click", getArea);
    document.getElementById("input2").addEventListener("onsubmit", getArea);
    // Adding the enter button functionality
});