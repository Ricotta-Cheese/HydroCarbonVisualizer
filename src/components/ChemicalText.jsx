const formulaRuleLabels = {
  "CnH2n+2": "2n+2",
  CnH2n: "2n",
  "CnH2n-2": "2n-2",
};

export function FormulaRule({ rule }) {
  return (
    <span className="formula">
      C<sub>n</sub>H<sub>{formulaRuleLabels[rule]}</sub>
    </span>
  );
}

export function ChemicalFormula({ carbon, hydrogen }) {
  return (
    <span className="formula">
      C<sub>{carbon}</sub>H<sub>{hydrogen}</sub>
    </span>
  );
}
