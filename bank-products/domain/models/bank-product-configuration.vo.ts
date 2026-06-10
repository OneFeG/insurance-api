export interface BankProductConfigurationProps {
  dailyWithdrawalLimit?: number;
  annualInterestRate?: number;
  monthlyInterestRate?: number;
  creditLimit?: number;
  minimumBalance?: number;
}

export class BankProductConfiguration {
  readonly dailyWithdrawalLimit?: number;
  readonly annualInterestRate?: number;
  readonly monthlyInterestRate?: number;
  readonly creditLimit?: number;
  readonly minimumBalance?: number;

  constructor(props: BankProductConfigurationProps) {
    this.dailyWithdrawalLimit = props.dailyWithdrawalLimit;
    this.annualInterestRate = props.annualInterestRate;
    this.monthlyInterestRate = props.monthlyInterestRate;
    this.creditLimit = props.creditLimit;
    this.minimumBalance = props.minimumBalance;
    Object.freeze(this);
  }

  toJSON(): BankProductConfigurationProps {
    return {
      dailyWithdrawalLimit: this.dailyWithdrawalLimit,
      annualInterestRate: this.annualInterestRate,
      monthlyInterestRate: this.monthlyInterestRate,
      creditLimit: this.creditLimit,
      minimumBalance: this.minimumBalance,
    };
  }
}
