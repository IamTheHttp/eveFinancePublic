import * as React from 'react';
import fetchData from "../../../utils/fetchData";
import Table from "../../../components/Table/Table";
import {useEffect, useState} from "react";
import {
  CHAR_NAME,
  CORP_ISK,
  CORP_NAME,
  CORP_PERM,
  CREDITS,
  ISK, LAST_FAILED_HYDRATION, LAST_HYDRATION, LAST_SEEN,
  REFRESH_TOKEN_FAILURES, REGISTRATION_DATE
} from "./CharacterListTableHeaders";

interface SICharacterModel {
  characterData: {
    icon?: string; // for this view only
    canQueryCorpWallet: boolean;
    charID: number;
    charName: string;
    corporationBalanceByDivision: any[];
    corporationID: number;
    corporationName: string;
    createdDate: string;
    creditBalance: number;
    failedRefreshTokenAttempts: number;
    gaveCorporationPermission: true
    isAdmin: boolean
    isDirector: boolean
    lastSeen: string;
    licenseExpirationDate: string;
    licenseID: string;
    linkedCharacters: any[];
    linkedCharactersData: any[];
    sso: {};
    status: string;
    stockStations: any[];
    totalCorporationBalance: number;
    trialUsed: boolean
    walletBalance: number;
    lastFailedHydration: Date;
    lastSuccessfulHydration: Date;
  }
}

async function getCharacters() {
  return await fetchData<SICharacterModel[]>('admin/characters');
}

function CharactersList(props: {}) {
  let [characterModelsResponse, setCharacterModels] = useState<SICharacterModel[]>([]);
  characterModelsResponse.forEach((modelResponse) => {
    modelResponse.characterData.icon = `https://images.evetech.net/characters/${modelResponse.characterData.charID}/portrait?size=64`;
  });

  useEffect(() => {
    (async () => {
      const charModels = await getCharacters();
      setCharacterModels(charModels.data);
    })();
  }, []);

  return (
    <div className='container-fluid'>
      <div className='row mt-5'>
        <div className='col-lg-12'>
          <h1>Characters</h1>
          <Table
            hideSummary={true}
            data={characterModelsResponse.map((modelResponse) => modelResponse.characterData)}
            columns={[
              'icon',
              'charID',
              CHAR_NAME,
              CORP_NAME,
              REGISTRATION_DATE,
              LAST_SEEN,
              'status',
              CREDITS,
              ISK,
              CORP_ISK,
              CORP_PERM,
              LAST_HYDRATION,
              LAST_FAILED_HYDRATION,
              REFRESH_TOKEN_FAILURES,
            ]}/>
        </div>
      </div>
    </div>
  )
}

export default CharactersList;