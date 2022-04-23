import {getBackendURL} from "../../../../config/publicConfig";
import * as React from "react";

export function RenderAPIAccess({corpAccess, charAccess, charID}: { corpAccess: boolean, charAccess: boolean, charID:number }) {
  const giveAccessLink = <a className="btn btn-warning" href={`${getBackendURL()}/public/loginWithCorp`}>Give Access</a>

  return (
    <div className='mt-2'>
      <h5>API Status</h5>
      <div>
        <div><span>Character API:</span> <span>{charAccess ? 'OK' :
          <button className='btn btn-warning'>Give Access</button>}</span></div>
        <div><span>Corporation API:</span> <span>{corpAccess ? 'OK' : giveAccessLink}</span></div>
      </div>
    </div>
  )
}