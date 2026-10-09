import { useCurrency } from "../context/CurrencyContext";

type PriceProps = {
  value: number | string;

  /**
   * Pass currency when this represents
   * an actual completed/backend order.
   *
   * Those amounts must NOT be converted.
   */
  currency?: string;

  className?: string;
};

const Price = ({
  value,
  currency,
  className = "",
}: PriceProps) => {
  const { formatPrice } =
    useCurrency();

  const displayValue =
    currency
      ? `${currency} ${Number(
          value,
        ).toFixed(2)}`
      : formatPrice(value);

  return (
    <span
      translate="no"
      className={
        `notranslate ${className}`.trim()
      }
    >
      {displayValue}
    </span>
  );
};

export default Price;