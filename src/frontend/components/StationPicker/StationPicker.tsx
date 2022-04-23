import * as React from "react";
import {SIEveRegion, SIEveSystem} from "../../views/Market/interfaces/interfaces";
import {RenderRegions} from "./RenderRegions";
import {useState} from "react";
import {RenderSystems} from "./RenderSystems";
import {RenderStations} from "./RenderStations";
import {SIStationOrStructure} from "../../Interfaces/Server/SIStationOrStructure";

type IProps = {
  onStationSelect?: (station: SIStationOrStructure) => void
}

function StationPicker(props: IProps) {
  const [region, pickRegion] = useState<SIEveRegion | {}>({});
  const [system, pickSystem] = useState<SIEveSystem | {}>({});
  const [station, pickStation] = useState<SIStationOrStructure | {}>({});

  return (
    <>
      <RenderRegions pickRegion={pickRegion}/>
      {'regionID' in region && <RenderSystems pickSystem={pickSystem} region={region}/>}
      {'solarSystemID' in system && <RenderStations pickStation={pickStation} system={system}/>}
      {'stationID' in station && <button
        onClick={() => {
          props.onStationSelect(station)
        }}>
        Pick
      </button>}
    </>
  )
}

export {StationPicker}