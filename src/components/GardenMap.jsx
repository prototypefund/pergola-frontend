"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_leaflet_1 = require("react-leaflet");
var LeafletPixiOverlay_1 = require("./LeafletPixiOverlay");
var WrappedPixiOverlay = react_leaflet_1.withLeaflet(LeafletPixiOverlay_1.default);
function GardenMap() {
    var zoom = react_1.useState(18)[0];
    var position = react_1.useState({
        lat: 51.0833,
        lng: 13.73126,
    })[0];
    var drawCallback = function () {
        return;
    };
    var data = [];
    function whenMapReady() {
        var _this = this;
        setInterval(function () {
            _this.invalidateSize();
            console.log('inval size');
        }, 1000);
    }
    return (<react_leaflet_1.Map whenReady={whenMapReady} style={{
        minHeight: '400px',
        height: '100%',
    }} center={position} zoom={zoom}>
      <react_leaflet_1.TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <WrappedPixiOverlay key="pixi-overlay" data={data} drawCallback={drawCallback}/>
      <react_leaflet_1.Marker position={position}>
        <react_leaflet_1.Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </react_leaflet_1.Popup>
      </react_leaflet_1.Marker>
    </react_leaflet_1.Map>);
}
exports.default = GardenMap;
