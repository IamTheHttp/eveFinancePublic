import {CharacterAggregate} from "../domains/characters/aggregates/CharacterAggregate";

async function setCharacterFailedRefreshAttempt(charAgg: CharacterAggregate, resetCount = false) {
  // TODO this is business logic that belongs within the charAgg or the Character Entity

  // If we reset the count, it means we had a successful hydration
  if (resetCount) {
    charAgg.setFields({
      lastSuccessfulHydration: new Date(),
      failedRefreshTokenAttempts: 0
    });
  } else {
    charAgg.setFields({
      lastFailedHydration: new Date(),
      failedRefreshTokenAttempts: (charAgg.getChar().failedRefreshTokenAttempts + 1) || 1
    });
  }

  await charAgg.save();
}


export {setCharacterFailedRefreshAttempt}