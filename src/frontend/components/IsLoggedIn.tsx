import * as React from "react";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import fetchData from "../utils/fetchData";
import {SIStationOrStructure} from "../Interfaces/Server/SIStationOrStructure";

export interface ILinkedCharacterData {
  canQueryCorpWallet: boolean
  charID: number
  gaveCorporationPermission: boolean
  isDirector: boolean
}

interface ICharInfoResponse {
  charID: number;
  charName: string;
  totalCorporationBalance: number;
  corporationBalanceByDivision: {balance: number, division: number}[]
  walletBalance: number;
  linkedCharacters: number[],
  linkedCharactersData: ILinkedCharacterData[],
  stockStations: SIStationOrStructure[],
  corporationName: string;
  status: string;
  licenseExpirationDate: Date,
  gaveCorporationPermission: boolean,
  LIC_MAX_CHAR: number,
  LOGIN_ERROR: string
  creditBalance: number
}


interface ICharacterState extends ICharInfoResponse {
  $$setCharState?: Dispatch<SetStateAction<Partial<ICharInfoResponse>>>
  LIC_MAX_CHAR: number,
  LOGIN_ERROR: string
}

const state: ICharacterState  & {isLoggedIn: boolean} = {
  isLoggedIn: null,
  charID: 0,
  charName: '',
  totalCorporationBalance: 0,
  corporationBalanceByDivision: [],
  walletBalance: 0,
  linkedCharacters: [],
  linkedCharactersData: [],
  stockStations: [],
  status: '',
  corporationName: '',
  licenseExpirationDate: null,
  gaveCorporationPermission: false,
  LIC_MAX_CHAR: 0,
  LOGIN_ERROR: '',
  creditBalance: 0,
  $$setCharState: () => {}
};

const UserContext = React.createContext(state);

function IsLoggedIn(props: {children: React.ReactNode}) {
  const [charState, setCharState] = useState(state);

  useEffect(() => {
    // Check user status from the server
    (async () => {
      const {data, error, errorID} = await fetchData<ICharInfoResponse>('secure/getCharacterInfo');
      if (data && data.charName) {
        setCharState({
          ...charState,
          LIC_MAX_CHAR:data.LIC_MAX_CHAR,
          isLoggedIn: true,
          charID: data.charID,
          charName: data.charName,
          status: data.status,
          creditBalance: data.creditBalance,
          licenseExpirationDate: data.licenseExpirationDate,
          totalCorporationBalance: data.totalCorporationBalance,
          corporationBalanceByDivision: data.corporationBalanceByDivision,
          walletBalance: data.walletBalance,
          linkedCharacters: data.linkedCharacters,
          linkedCharactersData: data.linkedCharactersData,
          corporationName: data.corporationName,
          stockStations: data.stockStations || [],
          gaveCorporationPermission: data.gaveCorporationPermission,
          LOGIN_ERROR: '',
          $$setCharState: setCharState
        });
      } else {
        // Char is logged out
        if (errorID === 906) {
          setCharState({...state, isLoggedIn: false});
        } else {
          setCharState({...state, LOGIN_ERROR: data.LOGIN_ERROR, isLoggedIn: null});
        }
      }
    })();
  }, [])

  return (
    <UserContext.Provider value={charState}>
      {props.children}
    </UserContext.Provider>
  )
}


export {UserContext, IsLoggedIn}