import {logger} from "../../utils/logger/logger";
import {IPotentialIndustryJobs, IProductionQuota} from "../../domains/quotas/data/QuotasDAL";
import {HydrationPayload} from "../character/hydrateAll";
import getAllDAL from "../../dataSources/DAL/getAllDAL";

async function assignIndustryJobsToQuotas({charAgg, esiNetworkDriver}: HydrationPayload) {
  const DALs = await getAllDAL();
  let {quotasDAL} = DALs;

  // Get all production quotas that aren't done
  const data = <IProductionQuota[]>await quotasDAL.getProductionQuotas(charAgg.getChar(), {
    filter: {
      completionDate: null
    }
  });

  if (data.length === 0) {
    logger.info(`${charAgg.getChar().charName} - No industry jobs to assign`);
    return;
  }

  // For each quota, get all industry jobs that might be releveant
  for (let i = 0; i < data.length; i++) {
    const resp = <IPotentialIndustryJobs[]>await quotasDAL.getPotentialIndustryJobsForQuota(charAgg.getChar(), data[i]._id);
    const quotaWithPotential = resp[0];
    const REMAINING_IN_QUOTA = data[i].amount - data[i].runsDoneAndInProgress;
    const quotaID = data[i]._id;
    let CALC_SO_FAR = 0;

    // These are the mongoIDs to update
    let updateThese: any[] = [];// TODO should not be type "any"

    // For each industry job, assuming it's below REMAINING_IN_QUOTA, add to an array for updates
    quotaWithPotential.industryJobs.forEach((job) => {
      // If we're done, we don't keep going
      if (CALC_SO_FAR < REMAINING_IN_QUOTA) {
        CALC_SO_FAR += job.successful_runs || job.probabilityRuns;
        updateThese.push(quotasDAL.toObjectID(job._id))
      }
    });

    // For all matching industry jobs, update the quotaID
    // TODO need to make industryDAL
    await quotasDAL.db.collection('industryJobs').updateMany({
      _id: {$in: updateThese}
    }, {
      $set: {quotaID: quotasDAL.toObjectID(quotaID)}
    });

    if (updateThese.length > 0) {
      logger.success(`${charAgg.getChar().charName} QuotaID: ${quotaID} -- Updated`);
    } else {
      logger.info(`${charAgg.getChar().charName} QuotaID: ${quotaID} -- Nothing to update`);
    }
  }


  const markJobsAsDone: any = [];
  data.forEach((quota) => {
    if (quota.runsDoneAndInProgress >= quota.amount) {
      markJobsAsDone.push(quotasDAL.toObjectID(quota._id))
    }
  });

  await quotasDAL.getTable().updateMany({
    _id: {$in: markJobsAsDone},
    completionDate: null
  }, {
    $set: {completionDate: new Date()}
  });
}

export default assignIndustryJobsToQuotas;
