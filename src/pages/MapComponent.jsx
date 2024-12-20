import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Fill, Stroke } from "ol/style";

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const popupContainerRef = useRef(null);
  const popupContentRef = useRef(null);
  const popupCloserRef = useRef(null);
  const mapRef = useRef(null);
  const baseLayerRef = useRef(null);
  const [recentData, setRecentData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [yearOptions, setYearOptions] = useState([]);

  const navigate = useNavigate();

  // Fungsi untuk parse timestamp menjadi Date object
  const parseDate = (timestamp) => {
    if (!timestamp) return null;
    return new Date(timestamp);
  };

  const getIconSource = (kejadian) => {
    if (kejadian < 3) return "icon/kuning.png";
    if (kejadian >= 3 && kejadian <= 6) return "icon/orange.png";
    if (kejadian > 6) return "icon/merah.png";
    return "icon/hijau.png";
  };

  const getScale = (kejadian) => 0.08 + Math.min(kejadian, 10) * 0.0005;

  const createFeatureStyle = (feature, visible = true) => {
    if (!visible) {
      return new Style({
        fill: new Fill({ color: "rgba(0, 0, 0, 0)" }),
        stroke: new Stroke({ color: "rgba(0, 0, 0, 0)" }),
      });
    }

    return new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: getIconSource(feature.get("jumlah_Kejadian")),
        scale: getScale(feature.get("jumlah_Kejadian")),
      }),
    });
  };

  const filterByYear = (year) => {
    setSelectedYear(year);

    const vectorLayer = mapRef.current
      .getLayers()
      .getArray()
      .find((layer) => layer.get('name') === 'begalLayer');

    if (!vectorLayer) return;

    const begalSource = vectorLayer.getSource();
    const features = begalSource.getFeatures();

    features.forEach((feature) => {
      const featureDate = parseDate(feature.get("Tanggal_Kejadian"));
      const featureYear = featureDate?.getFullYear();
      const isVisible = year === "all" || featureYear === parseInt(year);
      feature.setStyle(createFeatureStyle(feature, isVisible));
    });

    const visibleFeatures = features.filter((feature) => {
      const featureDate = parseDate(feature.get("Tanggal_Kejadian"));
      const featureYear = featureDate?.getFullYear();
      return year === "all" || featureYear === parseInt(year);
    });

    const filteredData = visibleFeatures
      .map((feature) => ({
        id: feature.get("OBJECTID"),
        alamat: feature.get("ALAMAT") || "Alamat tidak tersedia",
        tanggal: parseDate(feature.get("Tanggal_Kejadian")),
        coordinates: feature.getGeometry().getCoordinates(),
      }))
      .filter((item) => item.tanggal !== null)
      .sort((a, b) => b.tanggal - a.tanggal)
      .slice(0, 5);

    setRecentData(filteredData);
  };

  useEffect(() => {
    const overlay = new Overlay({
      element: popupContainerRef.current,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    const baseLayer = new TileLayer({
      source: new XYZ({
        url: "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      }),
    });

    baseLayerRef.current = baseLayer;

    const riauLayer = new VectorLayer({
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
      url: "data/DataBegals.json",
    });

    begalSource.on("featuresloadend", () => {
      const features = begalSource.getFeatures();
      const years = new Set();
      
      features.forEach(feature => {
        const date = parseDate(feature.get("Tanggal_Kejadian"));
        if (date) {
          years.add(date.getFullYear());
        }
      });

      const sortedYears = Array.from(years).sort((a, b) => b - a);
      setYearOptions(["all", ...sortedYears]);

      const initialData = features
        .map((feature) => ({
          id: feature.get("OBJECTID"),
          alamat: feature.get("ALAMAT") || "Alamat tidak tersedia",
          tanggal: parseDate(feature.get("Tanggal_Kejadian")),
          coordinates: feature.getGeometry().getCoordinates(),
        }))
        .filter((item) => item.tanggal !== null)
        .sort((a, b) => b.tanggal - a.tanggal)
        .slice(0, 5);

      setRecentData(initialData);
    });

    const begalLayer = new VectorLayer({
      source: begalSource,
      name: 'begalLayer',
      style: (feature) => createFeatureStyle(feature),
    });

    const map = new Map({
      target: mapContainerRef.current,
      overlays: [overlay],
      layers: [baseLayer, riauLayer, begalLayer],
      view: new View({
        center: fromLonLat([101.438309, 0.51044]),
        zoom: 12,
        extent: extent,
      }),
    });

    mapRef.current = map;

    const polygonLayerCheckbox = document.getElementById("polygon");
    const pointLayerCheckbox = document.getElementById("point");
    const recentEventCheckbox = document.getElementById("recent");
    const recentEventElement = document.getElementById("recentEvent");

    polygonLayerCheckbox?.addEventListener("change", function () {
      baseLayer.setSource(
        this.checked
          ? new XYZ({
              url: "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            })
          : new OSM()
      );
    });

    pointLayerCheckbox?.addEventListener("change", function () {
      begalLayer.setVisible(this.checked);
    });

    recentEventCheckbox?.addEventListener("change", function () {
      if (recentEventElement) {
        recentEventElement.style.display = this.checked ? "block" : "none";
      }
    });

    map.on("singleclick", (evt) => {
      const feature = map.forEachFeatureAtPixel(
        evt.pixel,
        (f, layer) => layer === begalLayer ? f : null
      );

      if (feature) {
        const imageSrc = feature.get("OBJECTID") || "noImg";
        const alamat = feature.get("ALAMAT") || "Alamat tidak tersedia";
        const tanggal = parseDate(feature.get("Tanggal_Kejadian"))?.toLocaleDateString("id-ID") || "Tanggal tidak tersedia";
        const kejadian = feature.get("jumlah_Kejadian") || "Data tidak tersedia";

        const content = `
          <img id="gambarAlamat" src="./icon/FOTO/${imageSrc}.png" alt="Gambar Lokasi" style="width: 100%; height: auto;"/>
          <h4 id="textAlamat">Alamat: ${alamat}</h4>
          <h4 id="textAlamat">Banyak kejadian: ${kejadian}</h4>
          <h4 id="textAlamat">Kejadian terakhir: ${tanggal}</h4>
        `;
        
        popupContentRef.current.innerHTML = content;
        overlay.setPosition(evt.coordinate);
      }
    });

    const featureOverlay = new VectorLayer({
      source: new VectorSource(),
      map: map,
      style: new Style({
        stroke: new Stroke({
          color: "rgba(255, 255, 255, 0.7)",
          width: 2,
        }),
      }),
    });

    let highlight;
    const highlightFeature = (pixel) => {
      const feature = map.forEachFeatureAtPixel(pixel, (feat) => feat);
      
      if (feature !== highlight) {
        if (highlight) {
          featureOverlay.getSource().removeFeature(highlight);
        }
        if (feature) {
          featureOverlay.getSource().addFeature(feature);
        }
        highlight = feature;
      }

      const info = document.getElementById('info');
      if (info) {
        info.innerHTML = feature ? (feature.get('Kecamatan') || '&nbsp;') : '-';
      }
    };

    map.on("pointermove", (evt) => {
      if (evt.dragging) {
        overlay.setPosition(undefined);
        return;
      }
      highlightFeature(map.getEventPixel(evt.originalEvent));
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
      zoom: 18,
      duration: 1000,
    });
  };
  const zoomOutToInitialView = () => {
    const view = mapRef.current.getView();
    view.animate({
      center: fromLonLat([101.438309, 0.51044]),  // Koordinat tengah peta
      zoom: 12,  // Level zoom yang lebih rendah
      duration: 1000,  // Durasi animasi
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
          bottom: "10px",
          left: "10px",
          width: "300px",
          padding: "10px",
          backgroundColor: "rgba(0,0,0, 0.9)",
          border: "3px solid red",
          display: "block",
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

      <div className="overlay-container">
        <div>
        <div className="filter">
        <h5 className="infoo">Filter:</h5>

          <label>
            <input type="checkbox" id="polygon" defaultChecked />
            Dark Mode
          </label>
          <label>
            <input type="checkbox" id="point" defaultChecked />
            Titik Persebaran Begal
          </label>
          <label>
            <input type="checkbox" id="recent" defaultChecked />
            Recent Event
          </label>
          <h5>Find by year :</h5>
          <select
            className="selectYear"
            value={selectedYear}
            onChange={(e) => filterByYear(e.target.value)}
            style={{
              width: "100%",
              padding: "5px",
              marginBottom: "10px",
              backgroundColor: "#040300",
              border: "1px solid #FFAA00",    
              color: "#FFAA00",        
            }}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year === "all" ? "Semua Tahun" : year}
              </option>
            ))}
          </select>
          </div>

        </div>
        <label>
          <h5 className="infoo">Info:</h5>
          <div id="info">-</div>
        </label>
        <label>
        <button
      className="zoomoutBtn"
      onClick={zoomOutToInitialView}
      style={{
        padding: "5px",
        backgroundColor: "#040300",
        color: "#FFAA00",
        border:"1px solid red",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "5px",
      }}
    >
      Zoom Out
    </button>
        </label>

      </div>

      <div
        className="buttonHome"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        Home
      </div>
      <div className="policeLine topPolice"></div>
      <div className="policeLine botPolice"></div>
    </div>
  );
};

export default MapComponent;