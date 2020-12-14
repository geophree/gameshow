const { floor, max, random } = Math;

// random int from 0 to max (inclusive!)
export const getRandomInt = (max) => floor(random() * (floor(max) + 1));

// sleep for ms milliseconds (use in async functions)
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
