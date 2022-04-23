import esiCall from "../ESINetworkDriver/esiRequest";

function getRegionOrders(regionID: number) {

  return esiCall('', {
    path: `/latest/markets/${regionID}/orders/`,
    method: 'GET',
  });
}


export default getRegionOrders;

