const forwardKeys = new Set(["ArrowRight", "ArrowDown"]);
const backwardKeys = new Set(["ArrowLeft", "ArrowUp"]);

export function getRadioNavigationDirection(key) {
  if (forwardKeys.has(key)) {
    return 1;
  }

  if (backwardKeys.has(key)) {
    return -1;
  }

  return 0;
}

export function getNextRadioOption(options, currentOption, direction) {
  const currentIndex = options.indexOf(currentOption);

  if (currentIndex === -1 || direction === 0) {
    return currentOption;
  }

  return options[
    (currentIndex + direction + options.length) % options.length
  ];
}

export function focusRadioByOffset(event, direction) {
  const group = event.currentTarget.closest('[role="radiogroup"]');
  const radios = Array.from(group?.querySelectorAll('[role="radio"]') ?? []);
  const currentIndex = radios.indexOf(event.currentTarget);

  if (currentIndex === -1 || radios.length === 0) {
    return;
  }

  radios[(currentIndex + direction + radios.length) % radios.length]?.focus();
}
