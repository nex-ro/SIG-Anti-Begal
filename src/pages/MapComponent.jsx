// Import yang diperlukan
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Tambahkan ini
import "../ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import { Vector as VectorSource } from "ol/source";
import GeoJSON from "ol/format/GeoJSON";
import { Icon, Style } from "ol/style";
import Overlay from "ol/Overlay";
import XYZ from "ol/source/XYZ";
import "../index2.css";

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const popupContainerRef = useRef(null);
  const popupContentRef = useRef(null);
  const popupCloserRef = useRef(null);
  const mapRef = useRef(null);
  const [recentData, setRecentData] = useState([]);
  const navigate = useNavigate(); // Hook untuk navigasi

  useEffect(() => {
    const overlay = new Overlay({
      element: popupContainerRef.current,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    const riau = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: "data/pkuPolygon2.json",
      }),
    });

    const extent = [
      ...fromLonLat([101.1, 0.1]),
      ...fromLonLat([101.8, 0.9]),
    ];

    const begalSource = new VectorSource({
      format: new GeoJSON(),
      url: "data/begaltest.json",
    });

    const begal = new VectorLayer({
      source: begalSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: "flaticon",
          anchorYUnits: "pixels",
          src: "icon/icon.png",
          width: 32,
          height: 32,
        }),
      }),
    });

    const map = new Map({
      target: mapContainerRef.current,
      overlays: [overlay],
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          }),
        }),
        riau,
        begal,
      ],
      view: new View({
        center: fromLonLat([101.438309, 0.51044]),
         zoom: 12,
        extent: extent,
      }),
    });

    mapRef.current = map;

    begalSource.on("featuresloadend", () => {
      const features = begalSource.getFeatures();
      const data = features.map((feature) => {
        return {
          id: feature.get("OBJECTID"),
          alamat: feature.get("ALAMAT"),
          tanggal: new Date(feature.get("Tanggal_Kejadian")),
          coordinates: feature.getGeometry().getCoordinates(),
        };
      });

      const sortedData = data
        .sort((a, b) => b.tanggal - a.tanggal)
        .slice(0, 5);
      setRecentData(sortedData);
    });

    map.on("singleclick", function (evt) {
      let feature = null;

      map.forEachFeatureAtPixel(evt.pixel, function (f, layer) {
        if (layer === begal) {
          feature = f;
          return true;
        }
      });

      if (!feature) {
        return;
      }

      const imageSrc = feature.get("OBJECTID") || "noImg";
      const alamat = feature.get("ALAMAT") || "Alamat tidak tersedia";
      const coordinate = evt.coordinate;
      const content = `
        <img id="gambarAlamat" src="./icon/FOTO/${imageSrc}.png" alt="Gambar Lokasi" style="width: 100%; height: auto;"/>
        <h4 >Alamat: ${alamat}</h4>
      `;
      popupContentRef.current.innerHTML = content;
      overlay.setPosition(coordinate);
    });

    popupCloserRef.current.onclick = () => {
      overlay.setPosition(undefined);
      popupCloserRef.current.blur();
      return false;
    };

    return () => {
      map.setTarget(null);
    };
  }, []);

  const zoomToLocation = (coordinates) => {
    const view = mapRef.current.getView();
    view.animate({
      center: coordinates,
      zoom: 12,
      duration: 1000,
    });
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "100vh" }}
        id="map"
      ></div>
      <div
        style={{
          position: "absolute",
          bottom: "0px",
          left: "10px",
          width: "300px",
          padding: "10px",
          backgroundColor: "rgba(0,0,0, 0.9)",
          border: "3px solid red",
          borderRadius: "8px",
        }}
        id="recentEvent"
      >
        <h3 className="recentTxt" style={{ fontSize: "22px" }}>
          Recently Event
        </h3>
        <ul
          className="ulRecent"
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          {recentData.map((item) => (
            <li
              key={item.id}
              style={{ marginBottom: "8px", cursor: "pointer" }}
              onClick={() => zoomToLocation(item.coordinates)}
            >
              <strong className="tglRecent">Tanggal:</strong>{" "}
              {item.tanggal.toLocaleDateString("id-ID")}
              <br />
              <strong className="almtRecent">Alamat:</strong> {item.alamat}
            </li>
          ))}
        </ul>
      </div>

      <div ref={popupContainerRef} className="ol-popup">
        <div className="headd">
          <p>Begal</p>
        </div>
        <a ref={popupCloserRef} href="#" className="ol-popup-closer"></a>
        <div ref={popupContentRef}></div>
      </div>
      <div
        className="buttonHome"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")} // Tambahkan navigasi di sini
      >
        Home
      </div>
    </div>
  );
};

export default MapComponent;
