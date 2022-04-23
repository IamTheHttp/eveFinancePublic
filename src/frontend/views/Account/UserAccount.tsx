import * as React from 'react';
import {useContext, useState} from "react";
import {ILinkedCharacterData, UserContext} from "../../components/IsLoggedIn";
import postData from "../../utils/postData";
import deleteData from "../../utils/deleteData";
import {StationPicker} from "../../components/StationPicker/StationPicker";
import {SIStationOrStructure} from "../../Interfaces/Server/SIStationOrStructure";
import {Page} from "../../components/Page";
import {Panel} from "../../components/Panel";
import {Row} from "../../components/Row";
import {BlockToast} from "../../components/BlockToast";
import {UserLicense} from "./components/UserLicense/UserLicense";
import {RenderAPIAccess} from "./components/RenderAPIAccess";

async function unlinkCharacter(charID: number) {
  await postData('secure/deleteLinkedCharacter/', {
    charID
  });
}

async function setStockStation(station: SIStationOrStructure) {
  await postData('auth/stockStations/', {
    station
  });
}

async function unsetStockStation(station: SIStationOrStructure) {
  await deleteData('auth/stockStations/', {
    station
  });
}

async function deleteCharacter() {
  await deleteData('secure/deleteCharacter');
}

function RenderCharacterDetails(props: { charName: string, charID: number, creditBalance: number }) {
  return (
    <div>
      <h3>Character Details</h3>
      <div>Name: {props.charName}</div>
      <div>CharacterID: {props.charID}</div>
      <div>Credit Balance: {props.creditBalance}</div>
    </div>
  )
}

function RenderLinkedCharacters(props: { characters: ILinkedCharacterData[] }) {
  const userState = useContext(UserContext);

  return (
    <div className='mt-5'>
      <h3>Linked Characters</h3>
      {props.characters.map((characterData) => {
        const charID = characterData.charID;
        const gaveCorporationPermission = characterData.gaveCorporationPermission;
        return (
          <div key={charID}>
            <img src={`https://images.evetech.net/characters/${charID}/portrait?size=64`}/>
            <span>{charID}</span>
            <a
              role='button'
              className='p-0 ml-2 h4 text-secondary'
              onClick={async () => {
                await unlinkCharacter(charID);
                userState.$$setCharState({
                  ...userState,
                  linkedCharacters: userState.linkedCharacters.filter((id) => {
                    return id !== charID
                  })
                });
              }}>&times;
            </a>
            <RenderAPIAccess
              charAccess={true}
              corpAccess={gaveCorporationPermission}
              charID={charID}/>
          </div>
        )
      })}
    </div>
  );
}

function RenderStockStations(props: { stockStations: SIStationOrStructure[] }) {
  const userState = useContext(UserContext);

  return (
    <div className='mt-5'>
      <h3>Stock Stations</h3>

      {props.stockStations.map((station) => {
        return (
          <div key={station.stationID}>
            <span>{station.stationName}</span>
            <a
              role='button'
              className='p-0 ml-2 h4 text-secondary'
              onClick={async () => {
                if (!(userState.stockStations.find((st) => {
                  return st.stationID === station.stationID
                }))) {
                  return 'Skipping, already out!'
                }
                await unsetStockStation(station);
                // Don't wait  for the response to update the user state
                userState.$$setCharState({
                  ...userState,
                  stockStations: userState.stockStations.filter((o) => {
                    return o.stationID !== station.stationID
                  })
                });
              }}>&times;
            </a>
          </div>
        )
      })}
      <h4 className='mt-5'>Add another stock stations</h4>
      <StationPicker
        onStationSelect={async (newStation) => {
          if (userState.stockStations.find((st) => {
            return st.stationID === newStation.stationID
          })) {
            return 'Skipping, already in!'
          }
          await setStockStation(newStation)
          userState.$$setCharState({
            ...userState,
            stockStations: [...userState.stockStations, newStation]
          });
        }}
      />
    </div>
  )
}

/**
 * Account View
 * @constructor
 */
function UserAccount() {
  const userState = useContext(UserContext);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (userState.isLoggedIn === false) {
    // Duplication of the please log in test, because App.tsx does not wrap Configuration with Page.
    return <BlockToast message={'Please log in'}/>
  }

  return (
    <Page title='Account'>
      <Row>
        <Panel columns={4}>
          <RenderCharacterDetails charName={userState.charName} charID={userState.charID}
                                  creditBalance={userState.creditBalance}/>
          <RenderAPIAccess charAccess={true} corpAccess={userState.gaveCorporationPermission} charID={userState.charID}/>
          <RenderLinkedCharacters characters={userState.linkedCharactersData}/>
          <RenderStockStations stockStations={userState.stockStations}/>
          <div className='danger-zone'>
            <h1>Danger zone</h1>
            <button onClick={() => {
              setShowConfirmDelete(true)
            }}>Delete Character
            </button>
            {<div className={!showConfirmDelete ? 'd-none' : 'splash-popup'}>
              <div>Are you sure you want to delete your character?</div>
              <button
                onClick={async () => {
                  await deleteCharacter();
                  location.href = '/';
                }}
                className='btn btn-danger'>Delete
              </button>
              <button
                onClick={() => {
                  setShowConfirmDelete(false)
                }}
                className='btn btn-info'>Cancel
              </button>
            </div>}
          </div>
        </Panel>
        <Panel columns={3} title='License'>
          <UserLicense/>
        </Panel>
        <Panel columns={3} title='Getting Credits'>
          <div style={{color:'#faa123'}}>
            <div>You can get additional credits by transferring ISK to Jenny Forsal</div>
            <div>System credit balance will update, ESI willing, within 30-60 minutes</div>
          </div>
        </Panel>
      </Row>
    </Page>
  )
}


export {UserAccount};