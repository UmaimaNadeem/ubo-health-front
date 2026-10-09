import { ReferenceCalculator } from "../components/ReferenceCalculator";
import { Seo } from "../components/Seo";

export function ReferenceCalculatorPage() {
  return (
    <div>
      <Seo
        title="Analytical Reference Calculator | ONYX Research"
        description="A laboratory planning aid for measuring peptide quantities. For research use only."
        noindex
      />
      <ReferenceCalculator />
    </div>
  );
}
