import characterJournalHydration from "./characterJournalHydration";
import characterTransactionsHydration from "./characterTransactionsHydration";
import characterPublicDataHydration from "./characterPublicDataHydration";
import corpJournalHydration from "../corporation/corpJournalHydration";
import characterRolesHydration from "./characterRolesHydration";
import characterMarketOrdersHydration from "./characterMarketOrdersHydration";
import characterWalletHydration from "./characterWalletHydration";
import corpBalanceHydration from "../corporation/corpBalanceHydration";
import characterAssetsHydration from "./characterAssetsHydration";
import assignIndustryJobsToQuotas from "../general/assignIndustryJobsToQuota";
import corporationBlueprintsHydration from "../corporation/corporationBlueprintsHydration";
import {ESINetworkDriver} from "../../dataSources/ESI/ESINetworkDriver/ESINetworkDriver";
import {corporationTransactionsHydration} from "../corporation/corporationTransactionsHydration";
import {corporationIndustryHydration} from "../corporation/corporationIndustryHydration";
import {corporationAssetHydration} from "../corporation/corporationAssetHydration";
import {corporationInformationHydration} from "../corporation/corporationInformationHydration";
import {logger} from "../../utils/logger/logger";
import {CharacterAggregate} from "../../domains/characters/aggregates/CharacterAggregate";
import {createLicenseAggregate} from "../../domains/licenses/aggregates/createLicenseAggregate";
import {refreshCharacterAccessToken} from "../../server/middlewares/refreshCharacterAccessToken";
import {setCharacterFailedRefreshAttempt} from "../setCharacterFailedRefreshAttempt";

interface HydrationPayload {
  charAgg: CharacterAggregate,
  esiNetworkDriver: ESINetworkDriver
}

async function hydrateAll(charAgg: CharacterAggregate, hydrateCorp: boolean, esiNetworkDriver: ESINetworkDriver): Promise<CharacterAggregate> {
  const hydrationPayload = {
    charAgg,
    esiNetworkDriver
  }

  try {
    // TODO Change transactions and Journal to use pages
    const refreshStatus = await refreshCharacterAccessToken(charAgg);
    if (refreshStatus.isError) {
      // Failed refresh token - increment failed attempt count
      await setCharacterFailedRefreshAttempt(charAgg);
      logger.raise(`${charAgg.getChar().charName} - Skipping hydration, could not refresh character ${refreshStatus.error}`);
      return;
    } else {
      // Success refresh token - Reset failed attempt count
      await setCharacterFailedRefreshAttempt(charAgg, true);
    }


    await charAgg.reload();
    await characterPublicDataHydration(hydrationPayload);
    if (charAgg.getChar().corporationID) {
      await charAgg.reload();
      await corporationInformationHydration(hydrationPayload);
    }
    await charAgg.reload();
    await characterWalletHydration(hydrationPayload);
    await characterJournalHydration(hydrationPayload);
    await characterTransactionsHydration(hydrationPayload);
    await characterMarketOrdersHydration(hydrationPayload);
    await characterAssetsHydration(hydrationPayload);

    if (charAgg.getChar().gaveCorporationPermission) {
      await charAgg.reload();
      await characterRolesHydration(hydrationPayload);
    }


    await charAgg.reload();
    const licAgg = await createLicenseAggregate(charAgg.getChar().licenseID);

    const hasRolesToHydrateCorp = charAgg.getChar().isDirector;
    const gavePermissionsToHydrateCorp = charAgg.getChar().gaveCorporationPermission;
    const licenseIncludesCorp = licAgg.getLicense().includeCorporations || charAgg.getChar().status === 'admin';

    // If this corp was not hydrated in this cycle
    // If this charAgg.getChar() is a director
    // If this charAgg.getChar() gave permission to query corporation roles
    // If license includes corporations OR if admin
    const shouldHydrateCorp = hydrateCorp && licenseIncludesCorp && hasRolesToHydrateCorp && gavePermissionsToHydrateCorp;

    if (shouldHydrateCorp) {
      hydrationPayload.charAgg = charAgg // Ensure a fresh copy is stored

      if (charAgg.getChar().isDirector) {
        await corporationIndustryHydration(hydrationPayload);
        await corporationAssetHydration(hydrationPayload)
        await corporationBlueprintsHydration(hydrationPayload);
      }

      // In the future we might want to allow non-directors to use this as well
      if (charAgg.getChar().canQueryCorpWallet) {
        await charAgg.reload();
        await corpBalanceHydration(hydrationPayload);
        await corpJournalHydration(hydrationPayload);
        await corporationTransactionsHydration(hydrationPayload);
      }
    } else {
      logger.info(`${charAgg.getChar().charName} - Skipping corp hydration`);
    }

    await assignIndustryJobsToQuotas(hydrationPayload);

    await charAgg.save();
    return await charAgg.reload();
  } catch (e) {
    logger.error(`${charAgg.getChar().charName} - Stopping hydration due to a token error ${e.message} - known expiration : ${charAgg.getChar().sso.accessTokenExpiration}`);

    // If token is expired
    if (e.tokenErrorCode === 1) {
      logger.error(`${charAgg.getChar().charName} - Token is expired or invalid, revoking character hydration process and corporation access`!);
      charAgg.setFields({
        gaveCorporationPermission: false,
        canQueryCorpWallet: false,
        failedRefreshTokenAttempts: 999
      });

      charAgg.setSSOConfig({
        accessToken: null,
        accessTokenExpiration: null,
        refreshToken: null
      });

      await charAgg.save();
    }

    // If corporation access is invalid
    if (e.tokenErrorCode === 2) {
      logger.error(`${charAgg.getChar().charName} - Corporation access revoked, resetting corp access`!);
      charAgg.setFields({
        gaveCorporationPermission: false,
        canQueryCorpWallet: false
      });
      await charAgg.save();
    }

    await charAgg.save();
  }
}

export {HydrationPayload, hydrateAll};


