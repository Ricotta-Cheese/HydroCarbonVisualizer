import assert from "node:assert/strict";
import test from "node:test";
import {
  getNextRadioOption,
  getRadioNavigationDirection,
} from "./radioNavigation.js";

test("maps arrow keys to radio navigation direction", () => {
  assert.equal(getRadioNavigationDirection("ArrowRight"), 1);
  assert.equal(getRadioNavigationDirection("ArrowDown"), 1);
  assert.equal(getRadioNavigationDirection("ArrowLeft"), -1);
  assert.equal(getRadioNavigationDirection("ArrowUp"), -1);
  assert.equal(getRadioNavigationDirection("Enter"), 0);
});

test("wraps radio option navigation", () => {
  const options = ["alkane", "alkene", "alkyne"];

  assert.equal(getNextRadioOption(options, "alkane", 1), "alkene");
  assert.equal(getNextRadioOption(options, "alkane", -1), "alkyne");
  assert.equal(getNextRadioOption(options, "alkyne", 1), "alkane");
  assert.equal(getNextRadioOption(options, "unknown", 1), "unknown");
});
