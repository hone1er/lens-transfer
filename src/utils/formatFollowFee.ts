import { Amount, Asset, ChargeFollowPolicy } from "@lens-protocol/react-web";

function formatAmount(amount: Amount<Asset>) {
  return `${amount.toSignificantDigits()} ${amount.asset.symbol}`;
}

export function formatFollowFee({ amount, rate }: ChargeFollowPolicy) {
  if (rate) {
    const fiat = amount.convert(rate);
    return `${formatAmount(amount)} (${formatAmount(fiat)})`;
  }
  return formatAmount(amount);
}
