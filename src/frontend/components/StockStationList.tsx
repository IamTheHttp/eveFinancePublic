import {SIStationOrStructure} from "../Interfaces/Server/SIStationOrStructure";
import * as React from "react";

/**
 * Generate a <div> list of all station/structure names given a list of stations/structures
 */
export function StockStationStrings(props : {stationsOrStructures: SIStationOrStructure[]}) {
  const {stationsOrStructures} = props;

  if (stationsOrStructures.length > 0) {
    return <div>
      {stationsOrStructures.map(station => <div>{station.stationName}</div>)}
    </div>
  } else {
    return <div>All locations</div>;
  }
}
