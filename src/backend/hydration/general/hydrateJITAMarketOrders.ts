import getRegionOrders from "../../dataSources/ESI/RESOURCES/getRegionOrders";
import {IDALs} from "../../dataSources/DAL/getAllDAL";

async function hydrateJITAMarketOrders(DALs: IDALs) {
  let {universeMarketOrdersDAL} = DALs;

  const JITA_REGION_ID = 10000002;

  const jitaOrders = <any[]> await getRegionOrders(JITA_REGION_ID);

  if (!jitaOrders) {
    return [];
  }
  let newData = jitaOrders.map((order) => {
    order.regionID = JITA_REGION_ID;
    return order;
  });

  await universeMarketOrdersDAL.deleteWhere({
    regionID: JITA_REGION_ID
  });

  await universeMarketOrdersDAL.upsertMany(newData);
  return jitaOrders;
}

export default hydrateJITAMarketOrders;
