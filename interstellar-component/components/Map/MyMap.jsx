import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import MyCustomMarker from './MyCustomMarker'

function UpdateMapView({ latitude, longitude }) {
  const map = useMap()

  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], map.getZoom())
    }
  }, [latitude, longitude, map])

  return null
}

function MyMap({ title, longitude, latitude, px = 4 }) {
  return (
    <div className={`px-${px} z-10 flex flex-col gap-2`}>
      <p className="text-sm-medium z-10 text-gray-light/700">{title}</p>
      <div className="h-[360px] w-full rounded-lg bg-gray-light/200">
        <MapContainer
          center={[latitude || 0, longitude || 0]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MyCustomMarker position={[latitude || 0, longitude || 0]} />
          <UpdateMapView latitude={latitude} longitude={longitude} />
        </MapContainer>
      </div>
    </div>
  )
}

export default MyMap
