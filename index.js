const express = require("express");
const port = 8888;
const app = express();

const months = [
  "tammikuuta",
  "helmikuuta",
  "maaliskuuta",
  "huhtikuuta",
  "toukokuuta",
  "kesäkuuta",
  "heinäkuuta",
  "elokuuta",
  "syyskuuta",
  "lokakuuta",
  "marraskuuta",
  "joulukuuta"
];
const getFormattedDate = d =>
  d.getDate() + ". " + months[d.getMonth()] + " " + d.getFullYear();

// Shows instructions how to fetch agreements/documents
app.get("/", (req, res) => {
  res.status(200).write("<h1>Easter dates calculation app</h1>");
  res.end(
    `<p>To calculate the dates of Easter in given year use http:localhost:8888/easter/[year]</p>`
  );
});

app.get("/easter/:year", (req, res) => {
  const year = req.params.year;
  try {
    const eas = easterSunday(year);
    const dateOffset = 24 * 60 * 60 * 1000; // milliseconds in one day
    let d = new Date();
    d.setHours(0, 0, 0);
    let answer = `<h3>Pääsiäinen vuonna ${year}:</h3>`;
    d.setTime(eas.getTime() - 7 * dateOffset);
    answer += `<p>Palmusunnuntai: ${getFormattedDate(d)}</p>`;
    d.setTime(eas.getTime() - 2 * dateOffset);
    answer += `<p>Pitkäperjantai:    ${getFormattedDate(d)}</p>`;
    answer += `1. pääsiäispäivä:    ${getFormattedDate(eas)}</p>`;
    d.setTime(eas.getTime() + 1 * dateOffset);
    answer += `2. pääsiäispäivä:    ${getFormattedDate(d)}</p>`;
    res
      .status(200)
      .send(answer)
      .end();
  } catch (err) {
    res
      .status(500)
      .send(err)
      .end();
  }
});

const easterSunday = y => {
  /*
		Easter Date Function for JavaScript implemented by Furgelnod ( https://furgelnod.com )
		Using algorithm published at The Date of Easter (on aa.usno.navy.mil, Oct 2007) 
		(https://web.archive.org/web/20071015045929/http://aa.usno.navy.mil/faq/docs/easter.php)
		The algorithm is credited to J.-M. Oudin (1940) and is reprinted in the 
		Explanatory Supplement to the Astronomical Almanac, ed. P. K. Seidelmann (1992). 
		See Chapter 12, "Calendars", by L. E. Doggett.
	*/
  try {
    y = Number(y);
    if (y != y) {
      throw new TypeError("Value must be a number.");
    } else if (y > 275760 || y < -271820) {
      throw new RangeError(
        "Value be between -271820 and 275760 due to technical limitations of Date constructor."
      );
    }
  } catch (e) {
    console.error(e);
  }

  y = Math.floor(y);
  let c = Math.floor(y / 100);
  let n = y - 19 * Math.floor(y / 19);
  let k = Math.floor((c - 17) / 25);
  let i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * n + 15;
  i = i - 30 * Math.floor(i / 30);
  i =
    i -
    Math.floor(i / 28) *
      (1 -
        Math.floor(i / 28) *
          Math.floor(29 / (i + 1)) *
          Math.floor((21 - n) / 11));
  let j = y + Math.floor(y / 4) + i + 2 - c + Math.floor(c / 4);
  j = j - 7 * Math.floor(j / 7);
  let l = i - j;
  let m = 3 + Math.floor((l + 40) / 44);
  let d = l + 28 - 31 * Math.floor(m / 4);
  let z = new Date();
  z.setFullYear(y, m - 1, d);
  z.setHours(0, 0, 0);
  return z;
};
app.listen(port, () => {
  console.log(`Easter dates app listening on port ${port}!`);
});
