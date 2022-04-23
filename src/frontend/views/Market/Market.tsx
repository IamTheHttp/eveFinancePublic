import {SIMarketRequestAssetReport} from "../../Interfaces/Server/SIMarketRequestAssetReport";

const fooooo = require('./interfaces/interfaces');
import * as  React from 'react';
import fetchData from '../../utils/fetchData';
import Table from '../../components/Table/Table';
import postData from "../../utils/postData";
import deleteData from "../../utils/deleteData";
import {SIEveRegion, SIEveSystem, MarketViewIState} from "./interfaces/interfaces";
import {getMarketStock} from "./utils/getMarketStock";
import {sortPredicate} from "./utils/sortPredicate";
import {getInitial} from "./utils/getInitialState";
import {SIMarketStockRecord} from "../../Interfaces/Server/SIMarketStockRecord";
import {Page} from "../../components/Page";
import {Panel} from "../../components/Panel";
import {Row} from "../../components/Row";
import SearchMarketItemInput from "../../components/Forms/SearchMarketItemInput";
import {RenderRegions} from "../../components/StationPicker/RenderRegions";
import {RenderSystems} from "../../components/StationPicker/RenderSystems";
import {ASSETS_ITEM_NAME, ITEM_NAME, MARKET_TARGET, STOCK_NEEDED, SYSTEM} from "./MarketTableHeaders";
import {useContext, useEffect, useState} from "react";
import {UserContext} from "../../components/IsLoggedIn";
import {StockStationStrings} from "../../components/StockStationList";


async function fetchPlannedMarketStocks() {
  let plannedMarketStocks = await fetchData<SIMarketStockRecord[]>('auth/marketStocks');
  let marketRequestAssetsReport = await fetchData<SIMarketRequestAssetReport>('auth/marketRequestAssetsReport');

  const marketStocks = getMarketStock(plannedMarketStocks.data, marketRequestAssetsReport.data);

  return {
    marketStock: marketStocks,
    marketRequestsAssetReport: marketRequestAssetsReport.data
  };
}

async function fetchRegionSystems(regionID: number) {
  let regionSystems = await fetchData<SIEveSystem[]>(`auth/systems/${regionID}`);

  return regionSystems.data.sort(sortPredicate('solarSystemName'));
}

function isButtonDisabled(state: MarketViewIState): boolean {
  return (
    !state.exactMatchItem ||
    !state.exactMatchItem.typeID ||
    !state.selectedSystem ||
    !state.selectedQuantity
  );
}


/**
 * The Market Page
 * @constructor
 */
function Market() {
  const [marketViewState, setMarketViewState] = useState<MarketViewIState>(getInitial())

  const [showFullyStockedSystems, setShowFullyStockedSystems] = useState(false);
  const [showSystemsYouCantStock, setShowSystemsYouCantStock] = useState(false);
  const userState = useContext(UserContext);

  const [changeCount, setChangeCount] = useState(0);

  useEffect(() => {
    (async () => {
      let allEveRegions = await fetchData<SIEveRegion[]>('auth/regions');
      const {marketStock, marketRequestsAssetReport} = await fetchPlannedMarketStocks();

      setMarketViewState({
        ...marketViewState,
        eveRegions: allEveRegions.data.sort(sortPredicate('regionName')),
        marketStock,
        marketRequestsAssetReport
      });
    })();
  }, [changeCount]);

  useEffect(() => {
    (async () => {
      if (marketViewState.selectedRegion.regionID) {
        const eveRegionSystems = await fetchRegionSystems(marketViewState.selectedRegion.regionID);

        setMarketViewState({
          ...marketViewState,
          eveRegionSystems
        });
      }
    })();
  }, [marketViewState.selectedRegion.regionID]);


  useEffect(() => {
    (async () => {
      const {marketStock, marketRequestsAssetReport} = await fetchPlannedMarketStocks();

      setMarketViewState({
        ...marketViewState,
        marketStock,
        marketRequestsAssetReport
      });
    })();
  }, [marketViewState.lastFetchRequest]);

  const MAIN_DATA_TO_SHOW = marketViewState.marketStock.filter((item) => {
    const HAS_ENOUGH_TO_STOCK = (item.onTheMarket + item.quantityInAssets) >= item.targetStockInSystem;
    const SYSTEM_IS_STOCKED = item.onTheMarket >= item.targetStockInSystem;
    const CANNOT_STOCK_SYSTEM = !HAS_ENOUGH_TO_STOCK;

    return (HAS_ENOUGH_TO_STOCK && !SYSTEM_IS_STOCKED) || (showFullyStockedSystems && SYSTEM_IS_STOCKED) || (showSystemsYouCantStock && CANNOT_STOCK_SYSTEM)
  });


  let TOTAL_SYSTEMS_COUNT = 0;
  let STOCKED_SYSTEMS_COUNT = 0;
  let UNSTOCKABLE_SYSTEMS_COUNT = 0;


  marketViewState.marketStock.forEach((item) => {
    const HAS_ENOUGH_TO_STOCK = (item.onTheMarket + item.quantityInAssets) >= item.targetStockInSystem;
    const SYSTEM_IS_STOCKED = item.onTheMarket >= item.targetStockInSystem;
    const CANNOT_STOCK_SYSTEM = !HAS_ENOUGH_TO_STOCK;

    TOTAL_SYSTEMS_COUNT++;

    if (SYSTEM_IS_STOCKED) {
      STOCKED_SYSTEMS_COUNT++;
    }

    if (CANNOT_STOCK_SYSTEM) {
      UNSTOCKABLE_SYSTEMS_COUNT++;
    }
  });



  return (
    <Page title={'Market'}>
      <Row>
        <Panel columns={2}>
          <form className='form--column'>
            <div className='form-group'>
              <RenderRegions pickRegion={(region) => {
                setMarketViewState({
                  ...marketViewState,
                  selectedRegion: region
                });
              }}/>
            </div>

            <div className='form-group'>
              <RenderSystems region={marketViewState.selectedRegion} pickSystem={(system) => {
                setMarketViewState({
                  ...marketViewState,
                  selectedSystem: system
                });
              }}/>
            </div>

            <div className='form-group'>
              <SearchMarketItemInput onChange={(matchedItems) => {
                setMarketViewState({
                  ...marketViewState,
                  exactMatchItem: matchedItems[0]
                });
              }}>
              </SearchMarketItemInput>
            </div>

            <div className='form-group'>
              <label>Quantity:</label>
              <input placeholder='quantity' type='number'
                     onChange={(e) => {
                       setMarketViewState({
                         ...marketViewState,
                         selectedQuantity: +e.target.value
                       });
                     }}
              />
            </div>

            <div>
              <button
                style={{width: '100%'}}
                className='btn btn-success'
                disabled={isButtonDisabled(marketViewState)}
                onClick={async (e) => {
                  e.preventDefault();

                  let payload = {
                    addSystemID: marketViewState.selectedSystem.solarSystemID,
                    addTypeID: marketViewState.exactMatchItem.typeID,
                    addQuantity: marketViewState.selectedQuantity,
                  };

                  const res = await postData('auth/marketStocks', payload);

                  if (res.errorID > 0) {
                    alert(res.error);
                  } else {
                    setMarketViewState({
                      ...marketViewState,
                      lastFetchRequest: new Date()
                    })
                  }
                }}
              >
                +Add
              </button>
            </div>

          </form>
        </Panel>
        <Panel columns={6} title={`Showing market stocks in ${TOTAL_SYSTEMS_COUNT} systems`}>
          <div className='form-group'>
            <label>
              Show  <span style={{color:'lime'}}>stocked {`${STOCKED_SYSTEMS_COUNT}`}</span> systems
            </label>&nbsp;
            <input type='checkbox' onChange={(e) => {
              setShowFullyStockedSystems(e.target.checked);
            }}/>
          </div>
          <div className='form-group'>
            <label>
              Show systems you <span style={{color:'red'}}>cannot  {`${UNSTOCKABLE_SYSTEMS_COUNT}`}</span> stock
            </label>&nbsp;
            <input type='checkbox' onChange={(e) => {
              setShowSystemsYouCantStock(e.target.checked);
            }}/>
          </div>

          <Table
            onChange={(e) => {
              setChangeCount(changeCount + 1);
            }}
            hideSummary={true}
            $actions={[{
              name: 'delete',
              cb: async (row: SIMarketStockRecord) => {
                await deleteData('auth/marketStocks', row);
                setMarketViewState({
                  ...marketViewState,
                  lastFetchRequest: new Date()
                })
              }
            }]}

            // System, Item, Market, Target, Missing, In Assets
            columns={[SYSTEM, ITEM_NAME, MARKET_TARGET]}
            data={MAIN_DATA_TO_SHOW}
          />
        </Panel>
        <Panel columns={4}>
          <h5>Showing assets in...</h5>
          <StockStationStrings stationsOrStructures={userState.stockStations} />
          <Table
            hideSummary={true}
            columns={[ASSETS_ITEM_NAME, STOCK_NEEDED]}
            data={marketViewState.marketRequestsAssetReport}
          />
        </Panel>
      </Row>
    </Page>
  );
}

export default Market;