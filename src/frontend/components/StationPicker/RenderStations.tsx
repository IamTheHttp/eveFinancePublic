import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {SIEveSystem} from "../../views/Market/interfaces/interfaces";
import fetchData from "../../utils/fetchData";
import * as React from "react";
import {SIStationOrStructure} from "../../Interfaces/Server/SIStationOrStructure";

function RenderStations(props: {
  pickStation: Dispatch<SetStateAction<SIStationOrStructure>>
  system: SIEveSystem
}) {
  const [stations, setStations] = useState<SIStationOrStructure[]>([]);

  useEffect(() => {
    (async () => {
      let eveStationsAndStructures = await fetchData<SIStationOrStructure[]>(`auth/stationsAndStructures/${props.system.solarSystemID}`);
      setStations(eveStationsAndStructures.data);
    })()
  }, [props.system.solarSystemID]);


  return (
    <div>
      <label>Station:</label>
      {stations.length ? <select
        defaultValue="tmp"
        onChange={(e) => {
          const station = stations.find((station) => {
            return station.stationID === +e.target.value
          });
          props.pickStation(station);
        }}
      >
        <option key="tmp" value="tmp" disabled hidden>Please select</option>
        {stations.map((station) => {
          return (
            <option
              value={station.stationID}
              key={station.stationID}
            >
              {station.stationName}

            </option>
          )
        })}
      </select> : 'No stations or structures found'}
    </div>
  );
}

export {RenderStations};