"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("leaflet-pixi-overlay/L.PixiOverlay");
var PIXI = require("pixi.js");
var react_leaflet_1 = require("react-leaflet");
var ReactLeaflet_PixiOverlay = /** @class */ (function (_super) {
    __extends(ReactLeaflet_PixiOverlay, _super);
    function ReactLeaflet_PixiOverlay() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.key = null;
        return _this;
    }
    ReactLeaflet_PixiOverlay.prototype.createLeafletElement = function (props) {
        var data = props.data, drawCallback = props.drawCallback;
        // @ts-ignore
        return L.pixiOverlay(function (utils) {
            drawCallback(utils, data);
        }, new PIXI.Container());
    };
    ReactLeaflet_PixiOverlay.prototype.componentDidMount = function () {
        var _a = this.props.leaflet || this.context, layerContainer = _a.layerContainer, map = _a.map;
        this.leafletElement.addTo(layerContainer);
        this.leafletElement.addTo(map);
    };
    ReactLeaflet_PixiOverlay.prototype.componentWillUnmount = function () {
        console.log(this.context);
        var _a = this.props.leaflet || this.context, layerContainer = _a.layerContainer, map = _a.map;
        map.removeLayer(this.leafletElement);
        layerContainer.removeLayer(this.leafletElement);
    };
    ReactLeaflet_PixiOverlay.prototype.componentDidUpdate = function () {
        this.componentWillUnmount();
        this.leafletElement = this.createLeafletElement(this.props);
        this.componentDidMount();
    };
    return ReactLeaflet_PixiOverlay;
}(react_leaflet_1.MapLayer));
exports.default = ReactLeaflet_PixiOverlay;
