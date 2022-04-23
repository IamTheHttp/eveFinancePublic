import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {SIEveRegion} from "../../views/Market/interfaces/interfaces";
import fetchData from "../../utils/fetchData";
import * as React from "react";

function RenderRegions(props: {
  pickRegion: (region: SIEveRegion) => void;
}) {
  const [regions, setRegions] = useState<SIEveRegion[]>([]);

  useEffect(() => {
    (async () => {
      let allEveRegions = await fetchData<SIEveRegion[]>('auth/regions');
      if (!allEveRegions.error) {
        setRegions(allEveRegions.data);
      } else {
        setRegions([]);
      }
    })()
  }, [])

  return (
    <div>
      <label>Region:</label>
      <select
        defaultValue="tmp"
        onChange={(e) => {
          const region = regions.find((reg) => {
            return reg.regionID === +e.target.value
          });
          props.pickRegion(region);
        }}
      >
        <option value="tmp" disabled hidden>Please select</option>
        {regions.map((region: SIEveRegion) => {
          return (
            <option
              key={region.regionID}
              value={region.regionID}>
              {region.regionName}
            </option>
          )
        })}
      </select>
    </div>
  );
}


export {RenderRegions};