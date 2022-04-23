import * as React from 'react';
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import fetchData from "../../utils/fetchData";
import {SIEveRegion, SIEveSystem} from "../../views/Market/interfaces/interfaces";

function RenderSystems(props: {
  region: SIEveRegion,
  pickSystem: (system: SIEveSystem) => void,
}) {
  const [systems, setSystems] = useState<SIEveSystem[]>([]);

  useEffect(() => {
    (async () => {
      if (props.region) {
        let fetchedSystems = await fetchData<SIEveSystem[]>(`auth/systems/${props.region.regionID}`);
        setSystems(fetchedSystems.data);
      }
    })();
  }, [props.region && props.region.regionID]);

  return (
    <div>
      <label>System:</label>
      <select
        defaultValue="tmp"
        onChange={(e) => {
          const system = systems.find((system) => {
            return system.solarSystemID === +e.target.value
          });
          props.pickSystem(system);
        }}
      >
        <option key="tmp" value="tmp" disabled hidden>Please select</option>
        {systems.map((solarSystem) => {
          return (
            <option
              value={solarSystem.solarSystemID}
              key={solarSystem.solarSystemID}
            >
              {solarSystem.solarSystemName}

            </option>
          )
        })}
      </select>
    </div>
  );
}

export {RenderSystems};