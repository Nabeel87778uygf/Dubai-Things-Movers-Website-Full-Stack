import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function ClientMap({ mapCenter, mapZoom }) {
  const { t } = useTranslation();
  const [MapComponents, setMapComponents] = useState(null);

  useEffect(() => {
    Promise.all([
      import("react-leaflet"),
      import("leaflet/dist/leaflet.css")
    ]).then(([mod]) => {
      setMapComponents(mod);
    });
  }, []);

  if (!MapComponents) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/20 text-muted-foreground text-sm">
        {t("map.loading", "Loading Map...")}
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, useMap } = MapComponents;

  function ChangeMapView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom]);
    return null;
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: "100%", width: "100%" }}
    >
      <ChangeMapView center={mapCenter} zoom={mapZoom} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={[25.0800, 55.1400]}>
        <Popup>{t("cities.jlt")}</Popup>
      </Marker>
      <Marker position={[25.1972, 55.2744]}>
        <Popup>{t("cities.downtown")}</Popup>
      </Marker>
      <Marker position={[25.1860, 55.2630]}>
        <Popup>{t("cities.businessBay")}</Popup>
      </Marker>
      <Marker position={[25.1124, 55.1390]}>
        <Popup>{t("cities.palm")}</Popup>
      </Marker>
      <Marker position={[24.4539, 54.3773]}>
        <Popup>{t("cities.abuDhabi")}</Popup>
      </Marker>
      <Marker position={[25.3463, 55.4209]}>
        <Popup>{t("cities.sharjah")}</Popup>
      </Marker>
      <Marker position={[25.4052, 55.5136]}>
        <Popup>{t("cities.ajman")}</Popup>
      </Marker>
      <Marker position={[24.2075, 55.7447]}>
        <Popup>{t("cities.alAin")}</Popup>
      </Marker>
    </MapContainer>
  );
}
