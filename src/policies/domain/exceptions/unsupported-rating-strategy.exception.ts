import { RatingStrategyName } from '../models/rating-strategy.enum';

export class UnsupportedRatingStrategyException extends Error {
  readonly strategy: RatingStrategyName;

  constructor(strategy: RatingStrategyName) {
    super(`Unsupported rating strategy "${strategy}"`);
    this.strategy = strategy;
  }
}
