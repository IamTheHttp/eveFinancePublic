import * as  React from 'react';
import NewQuota from "./components/NewQuota/NewQuota";
import QuotasList from "./components/QuotasList/QuotasList";
import {Page} from "../../components/Page";
import {Panel} from "../../components/Panel";
import {Row} from "../../components/Row";
import {QuotasNeededMaterials} from "./components/QuotasList/QuotasNeededMaterials";
import {StockStationStrings} from "../../components/StockStationList";
import {useContext, useState} from "react";
import {UserContext} from "../../components/IsLoggedIn";


interface IQuotasViewState {
  renderCount: number
}


function Quotas() {
  const [quotasViewState, setQuotasViewState] = useState<IQuotasViewState>({renderCount: 0})
  const userState = useContext(UserContext);


  return (
    <Page title='Industry & Production'>
      <Row>
        <Panel columns={2}>
          <NewQuota
            onChange={() => {
              setQuotasViewState({renderCount: quotasViewState.renderCount + 1})
            }}
          />
        </Panel>
        <Panel columns={7}>
          <QuotasList
            renderCount={quotasViewState.renderCount}
            onDelete={() => {
              setQuotasViewState({renderCount: quotasViewState.renderCount + 1})
            }}
          />
        </Panel>
        <Panel columns={3} title='Missing Materials'>
          <h5>Showing assets in...</h5>
          <StockStationStrings stationsOrStructures={userState.stockStations}/>
          <QuotasNeededMaterials
            renderCount={quotasViewState.renderCount}
          />
        </Panel>
      </Row>
    </Page>
  )
}

export default Quotas;