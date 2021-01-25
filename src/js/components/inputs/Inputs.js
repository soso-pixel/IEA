import React from "react";

const Inputs = ({className, deviceType, networkType, hours, setDeviceType, setNetworkType, setHours}) => (
  <div className={className}>
    <div>
      <label htmlFor="devices">Choose a device:</label>

      <select name="devices" value={deviceType} onChange={(evt) => setDeviceType(evt.target.value)}>
        <option value="">--Please choose an option--</option>
        <option value="smartphone">Smartphone</option>
        <option value="tablet">Tablet</option>
        <option value="laptop">Laptop</option>
        <option value="television-50-led">Television (50" LED)</option>
      </select>
    </div>
    <div>
      <label htmlFor="networks">Choose a network type:</label>

      <select name="networks" value={networkType} onChange={(evt) => setNetworkType(evt.target.value)}>
        <option value="">--Please choose an option--</option>
        <option value="wifi">WiFi</option>
        <option value="4g">4G</option>
      </select>
    </div>
    <div>
      <label htmlFor="hours">Hours:</label>

      <input type="number" name="hours" value={hours} onChange={(evt) => setHours(evt.target.value)}
             min="1" />
    </div>
  </div>
)

export default Inputs
