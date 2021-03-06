#! /bin/node

import * as pgn from "./parsers/pgn.js";
import * as game from "./parsers/game.js";
import * as axel from "./parsers/axel.js";
import * as json from "./parsers/json.js";
import * as preview from "./preview.js";
import * as fs from "fs";
import * as yargs from "yargs";

yargs.default.command("convert <from> <to> <file>", "Convert from <from> to <to>", (y) => {
  y.positional("from", {
    describe: "the notation to convert from (5dpgn)"
  }).positional("to", {
    describe: "the notation to convert into (5dpgn)"
  }).positional("file", {
    describe: "the file to read from"
  }).option("v", {
    alias: "v",
    default: false,
    type: "boolean",
    describe: "more verbose parsing/writing"
  }).option("board", {
    default: "Standard",
    describe: "The board that is played on (used for 4xel)",
  })
}, (argv) => {
  let g;
  let raw = fs.readFileSync(argv.file, "utf8");

  let from = argv.from.toLowerCase();
  let to = argv.to.toLowerCase();

  if (from === "5dpgn") {
    g = pgn.parse(raw, argv.verbose || false);
  } else if (from === "json") {
    g = json.parse(raw);
  } else if (from === "4xel" || from === "axel") {
    g = axel.parse(raw, argv.verbose, argv.board);
  }

  if (to === "5dpgn") {
    console.log(pgn.write(g));
  } else if (to === "json") {
    console.log(JSON.stringify(g));
  } else if (to === "4xel" || from === "axel") {
    console.log(axel.write(g));
  }
}).command("preview <format> <file>", "Previews the given game", (y) => {
  y.positional("format", {
    describe: "The format that <file> is in",
  }).positional("file", {
    describe: "The file to read from"
  }).option("board", {
    default: "Standard",
    describe: "The board that is played on (used for 4xel)",
  }).option("unicode", {
    default: false,
    type: "boolean",
    describe: "Use unicode values for chess pieces (U+2654 through U+265F, Unicorns and Dragons will still be displayed with latin letters)"
  })
}, (argv) => {
  let g;
  let raw = fs.readFileSync(argv.file, "utf8");

  let format = argv.format.toLowerCase();

  if (format === "5dpgn") {
    g = pgn.parse(raw, argv.verbose || false);
  } else if (format === "json") {
    g = json.parse(raw);
  } else if (format === "4xel" || from === "axel") {
    g = axel.parse(raw, argv.verbose, argv.board);
  }

  preview.preview(g, argv.unicode);
}).argv;
