// Stupid import, webapck doesn't detect changes to interface files
import {OpenQuotasTable} from "./ui/OpenQuotasTable";

require("./interfaces/IStateQuotasList").IStateNewQuotas;

import Table from "../../../../components/Table/Table";
import * as  React from 'react';
import {useEffect, useState} from "react";
import fetchData from "../../../../utils/fetchData";
import deleteData from "../../../../utils/deleteData";
import {
  COMPLETION_DATE,
  CREATED_DATE, TYPE_NAME
} from "./QuotaTableHeaders";

export interface SIQuota {
  icon?: string;
  isOpen: boolean,
  typeID: number,
  typeName: string
  amount: number,
  completionDate: Date | boolean,
  createdDate: Date,
  quotaID: string
  availableBPCRuns: number
  availableBPCRunsNet: number
  bpcRunsInProgress: number
  bpoCount: number
  newBpcInProgress: number
  runsDoneAndInProgress: number
  runsInProgress: number
  runsSuccessful: number
}

function getCompletedQuotas(setState: any) {
  return async () => {
    let quotasResponse = await fetchData<SIQuota[]>('auth/quotas/completed');
    setState(quotasResponse.data)
  };
}

function getUpdateQuotasData(setState: any) {
  return async () => {
    let quotasResponse = await fetchData<SIQuota[]>('auth/quotas');
    setState(quotasResponse.data)
  };
}

function getUpdateMaterialsData(setState: any) {
  return async () => {
    let quotasMaterialResponse = await fetchData<any[]>('auth/quotas/materials');
    setState(quotasMaterialResponse.data)
  };
}


function QuotasList(props: { renderCount: number, onDelete: () => void }) {
  let [quotasData, setData] = useState<SIQuota[]>([]);
  let [completedQuotas, setCompletedQuotas] = useState<SIQuota[]>([]);

  const updateQuotasData = getUpdateQuotasData(setData);
  const updateCompletedQuotas = getCompletedQuotas(setCompletedQuotas);

  let inProgressQuotas = quotasData.filter((quota) => {
    return !quota.completionDate
  });

  inProgressQuotas.forEach((row) => {
    row.icon = `https://images.evetech.net/types/${row.typeID}/icon`;
  });

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    updateQuotasData();
    updateCompletedQuotas();
  }, [props.renderCount]);

  return (
    <div className='container-fluid'>
      <h1>Industry plan</h1>
      <div className='row'>
        <div className='col-lg-12'>
          <OpenQuotasTable
           inProgressQuotas={inProgressQuotas}
           updateQuotasData={async (record: SIQuota) => {
             await deleteData(`auth/quotas/${record.quotaID}`)
             props.onDelete();
           }}
          />
        </div>
      </div>

      <div className='row mt-5'>
        <div className='col-lg-12'>
          <h1>Finished Quotas</h1>
          <Table
            hideSummary={true}
            data={completedQuotas}
            columns={[
              TYPE_NAME,
              CREATED_DATE,
              COMPLETION_DATE,
              'amount'
            ]}/>
        </div>
      </div>
    </div>
  )
}

export default QuotasList;