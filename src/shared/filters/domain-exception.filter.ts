import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { PolicyNotFoundException } from '../../policies/domain/exceptions/policy-not-found.exception';
import { InvalidStateTransitionException } from '../../policies/domain/exceptions/invalid-state-transition.exception';
import { UnsupportedBranchException } from '../../policies/domain/exceptions/unsupported-branch.exception';
import { UnsupportedRatingStrategyException } from '../../policies/domain/exceptions/unsupported-rating-strategy.exception';
import { InvalidRiskProfileException } from '../../policies/domain/exceptions/invalid-risk-profile.exception';
import { InactiveCustomerException } from '../../policies/domain/exceptions/inactive-customer.exception';

@Catch(
  PolicyNotFoundException,
  InvalidStateTransitionException,
  UnsupportedBranchException,
  UnsupportedRatingStrategyException,
  InvalidRiskProfileException,
  InactiveCustomerException,
)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = this.toStatus(exception);
    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }

  private toStatus(exception: Error): number {
    if (exception instanceof PolicyNotFoundException) {
      return HttpStatus.NOT_FOUND;
    }
    return HttpStatus.BAD_REQUEST;
  }
}
