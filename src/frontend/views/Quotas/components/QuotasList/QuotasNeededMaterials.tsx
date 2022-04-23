import * as React from "react";
import Table from "../../../../components/Table/Table";
import {MATERIAL_NAME, MATERIALS_TO_BUY} from "./QuotaTableHeaders";
import {useEffect, useState} from "react";
import fetchData from "../../../../utils/fetchData";

function QuotasNeededMaterials(props: { renderCount: number }) {
  let [materialsData, setMaterialsData] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      let quotasMaterialResponse = await fetchData<any[]>('auth/quotas/materials');

      setMaterialsData(quotasMaterialResponse.data)
    })();
  }, [props.renderCount]);

  let neededMaterials = materialsData.filter((material) => {
    return material.neededForAllQuotas > material.quantityInAssets;
  });

  return (
    <Table
      hideSummary={true}
      data={neededMaterials}
      HideColumnTitles={true}
      columns={[
        MATERIAL_NAME,
        MATERIALS_TO_BUY
      ]}
    />
  )
}

export {QuotasNeededMaterials};