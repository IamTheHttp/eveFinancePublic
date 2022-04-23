import Table from "../../../../../components/Table/Table";
import {AMOUNT, CREATED_DATE, LEFT_TO_BUILD, MISSING_BPC_RUNS, PERCENT_DONE, TYPE_NAME} from "../QuotaTableHeaders";
import * as React from "react";
import {SIQuota} from "../QuotasList";

function OpenQuotasTable(props: {updateQuotasData: (q:SIQuota) => void, inProgressQuotas: SIQuota[]}) {
  return (
    <Table
      hideSummary={true}
      $actions={[
        {
          name: 'delete',
          cb: props.updateQuotasData
        }
      ]}
      data={props.inProgressQuotas}
      columns={[
        'icon',
        TYPE_NAME,
        CREATED_DATE,
        MISSING_BPC_RUNS,
        AMOUNT,
        LEFT_TO_BUILD,
        // PERCENT_DONE
      ]}/>
  )
}

export {OpenQuotasTable}