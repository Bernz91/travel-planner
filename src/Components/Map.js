import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

// import ReactDOM from "react-dom/client";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = ({
  lng,
  lat,
  zoom,
  list,
  listRef,
  handleClick,
  handleMouseEnter,
  handleMouseLeave,
  mouseEnter,
  destinationSearch,
}) => {
  const mapContainerRef = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  }, [destinationSearch]);

  useEffect(() => {
    if (!map.current) return;

    list.map((places, index) => {
      const marker = new mapboxgl.Marker({
        color: places.mouseEnter ? "black" : "",
        rotation: 45,
      })
        .setLngLat(places.geometry.coordinates)
        .addTo(map.current);

      marker
        .getElement()
        .addEventListener("click", (e) => handleClick(list, index, e, listRef));

      marker
        .getElement()
        .addEventListener("mouseover", () => handleMouseEnter(list, index));

      marker
        .getElement()
        .addEventListener("mouseleave", () => handleMouseLeave(list, index));
    });
  }, [mouseEnter, listRef]);

  return (
    <div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
