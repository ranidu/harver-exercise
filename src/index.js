const { getRandomWordSync, getRandomWord } = require("word-maker");
const fs = require("fs");

const getFizzBuzz = (val) => {
  if (val % 3 === 0 && val % 5 === 0) {
    return "FizzBuzz";
  }

  if (val % 3 === 0) {
    return "Fizz";
  }

  if (val % 5 === 0) {
    return "Buzz";
  }

  return val;
};

const getFizzBuzzWithNumber = (val, label) => {
  return new Promise((resolve, reject) => {
    let result = `${val}: ${label}`;
    resolve(result);
  });
};

const getRandomWordAsyncWithNumber = async (
  val,
  args = { withErrors: false }
) => {

  try {
    resp = await getRandomWord(args);
  } catch (e) {
    resp = "It shouldn't break anything!";
  }

  return `${val}: ${resp}`;
};

const getRandomWordWithNumber = (val, args = { withErrors: false }) => {
  let resp;
  try {
    resp = getRandomWordSync(args);
  } catch (e) {
    resp = "It shouldn't break anything!";
  }

  return `${val}: ${resp}`;
};

const writeDatatoFile = (textStream, header, newFile = false) => {
  let resp = "";
  if(header){
    resp += `${header} \n`;
  }
  for (const text of textStream) {
    resp += `${text} \n`;
  }

  if (newFile) {
    fs.writeFile("results.txt", resp + "\r\n", (err) => {
      if (err) throw err;
    });
  } else {
    fs.appendFile("results.txt", resp + "\r\n", (err) => {
      if (err) throw err;
    });
  }
};

const app = async (wordLimit = 100) => {
  let values = [],
    promises = [];

  //Task 01
  for (i = 1; i <= wordLimit; i++) {
    values.push(`${i}: ${getRandomWordSync()}`);
  }
  writeDatatoFile(values, 'Task 01 | Print numbers from 1 to 100 to the console.', true);

  // Task 02
  values = [];
  for (i = 1; i <= wordLimit; i++) {
    let fizzBuzz = getFizzBuzz(i);
    let result = fizzBuzz.length > 0 ? fizzBuzz : getRandomWordSync();
    values.push(`${i}: ${result}`);
  }
  writeDatatoFile(values, "Task 02 | Fizz Buzz program.");

  // Tasks 03 - #1
  values = [];
  promises = [];
  for (i = 1; i <= wordLimit; i++) {
    promises.push(getRandomWordAsyncWithNumber(i));
  }

  await Promise.all(promises).then((value) => {
    values = value;
  });
  writeDatatoFile(values, "Task 03 - 01 | Print numbers from 1 to 100 to the console - asynchronous.");

  // Tasks 03 - #2
  values = [];
  promises = [];
  for (i = 1; i <= wordLimit; i++) {
    let fizzBuzz = getFizzBuzz(i);
    let result =
      fizzBuzz.length > 0
        ? getFizzBuzzWithNumber(i, fizzBuzz)
        : getRandomWordAsyncWithNumber(i);
    promises.push(result);
  }

  await Promise.all(promises).then((value) => {
    values = value;
  });

  writeDatatoFile(values, "Task 03 - 02 | Fizz Buzz program - asynchronous.");

  // Tasks 04 - #1
  values = [];
  promises = [];
  for (i = 1; i <= wordLimit; i++) {
    promises.push(getRandomWordAsyncWithNumber(i, { withErrors: true }));
  }

  await Promise.all(promises).then((value) => {
    values = value;
  });

  writeDatatoFile(values, "Task 04 - 01 | Print numbers from 1 to 100 to the console - withErrors.");

  // Tasks 04 - #2
  values = [];
  promises = [];
  for (i = 1; i <= wordLimit; i++) {
    let fizzBuzz = getFizzBuzz(i);
    let result =
      fizzBuzz.length > 0
        ? fizzBuzz
        : getRandomWordWithNumber(i, { withErrors: true });
    values.push(`${i}: ${result}`);
  }

  writeDatatoFile(values, "Task 04 - 02 | Fizz Buzz program - withErrors.");

  // Task - with slow mode on
  let hrstart = process.hrtime();
  values = [];
  promises = [];
  for (i = 1; i <= wordLimit; i++) {
    promises.push(
        getRandomWordAsyncWithNumber(i, { slow: true })
    );
  }

  await Promise.all(promises).then(value => {
    values = value;
  });

  writeDatatoFile(values, "Task - with slow mode on.");

  let hrend = process.hrtime(hrstart);
  console.info(
    "Execution time with (slow mode): %ds %dms",
    hrend[0],
    hrend[1] / 1000000
  );
};

app();
