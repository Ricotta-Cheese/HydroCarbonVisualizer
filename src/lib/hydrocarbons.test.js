import assert from "node:assert/strict";
import test from "node:test";
import {
  formatNumber,
  getCarbonOptions,
  getCombustionReaction,
  getHydrocarbonDetails,
  getHydrocarbonName,
  getReagentTestResult,
} from "./hydrocarbons.js";

test("calculates alkane combustion details", () => {
  const details = getHydrocarbonDetails("alkane", 4);

  assert.equal(details.carbon, 4);
  assert.equal(details.hCount, 10);
  assert.equal(details.molarMass, 58);
  assert.equal(details.oxygen, 6.5);
  assert.equal(details.water, 5);
  assert.equal(
    getCombustionReaction("alkane", 4),
    "[알케인 연소] C4H10 + 6.5O2 -> 4CO2 + 5H2O"
  );
});

test("returns valid carbon options by hydrocarbon family", () => {
  assert.deepEqual(getCarbonOptions("alkane"), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(getCarbonOptions("alkene"), [2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(getCarbonOptions("alkyne"), [2, 3, 4, 5, 6, 7, 8]);
});

test("formats combustion coefficients without unnecessary decimals", () => {
  assert.equal(formatNumber(6), "6");
  assert.equal(formatNumber(6.5), "6.5");
});

test("returns names and terminal alkyne reagent results", () => {
  const result = getReagentTestResult("alkyne", "암모니아성 질산은", 2);

  assert.equal(getHydrocarbonName("alkyne", 2), "에타인");
  assert.equal(result.formula, "C2H2");
  assert.equal(result.finalLabel, "흰색 침전");
  assert.equal(result.phase, "white-precipitate");
  assert.match(result.result, /말단 알카인/);
  assert.match(result.observation, /말단 알카인/);
});
