/**
 * Update World Cup Table Script
 *
 * Fetches the World Cup 2026 group tables from BBC Sport and writes
 * public/wc-table.json. One entry per country with:
 *   group, groupPosition, groupPlayed, groupPoints, isLast16, finalPosition
 *
 * Usage: npm run update-wc-table
 */

import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';

interface CountryEntry {
  name: string;
  shortName: string;
  group: string;
  groupPosition: number;
  groupPlayed: number;
  groupPoints: number;
  isLast16: boolean;
  finalPosition: number | null;
}

interface WCTable {
  countries: CountryEntry[];
  timestamp: string;
}

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

async function fetchWCTable(): Promise<CountryEntry[]> {
  const url = 'https://www.bbc.co.uk/sport/football/world-cup/table';

  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const html = await response.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const countries: CountryEntry[] = [];

  // BBC Sport renders each group in a <section> or <div> that contains
  // a heading with the group letter and a <table> with the standings.
  // We try several selector strategies so the script stays robust across
  // minor BBC markup changes.

  // Strategy 1: find elements whose text content is exactly "Group X"
  // (h2, h3, h4, or any element with a group-related class/attribute).
  const headingCandidates = Array.from(
    document.querySelectorAll('h2, h3, h4, [class*="group"], [data-group]')
  );

  for (const group of GROUPS) {
    const groupLabel = `Group ${group}`;

    // Find the heading for this group
    const heading = headingCandidates.find((el) => {
      const text = el.textContent?.trim() ?? '';
      return text === groupLabel || text.startsWith(groupLabel);
    });

    if (!heading) {
      console.warn(`  Warning: could not find heading for ${groupLabel}`);
      continue;
    }

    // Walk forward in the DOM from the heading to find the nearest <table>
    const table = findNextTable(heading);

    if (!table) {
      console.warn(`  Warning: no table found near heading for ${groupLabel}`);
      continue;
    }

    const rows = Array.from(table.querySelectorAll('tbody tr'));

    if (rows.length === 0) {
      console.warn(`  Warning: no rows in table for ${groupLabel}`);
      continue;
    }

    rows.forEach((row, index) => {
      const cells = Array.from(row.querySelectorAll('td'));
      if (cells.length < 3) return;

      const cellTexts = cells.map((c) => c.textContent?.trim() ?? '');

      // Position — first numeric cell, or fall back to row index
      let groupPosition = index + 1;
      if (!isNaN(Number(cellTexts[0])) && cellTexts[0] !== '') {
        groupPosition = parseInt(cellTexts[0]);
      }

      // Team name — first non-numeric, non-empty cell of reasonable length.
      // BBC sometimes includes an image/abbr inside the cell so we also check
      // for an <abbr> or <span> with the full name.
      let name = '';
      let shortName = '';
      for (const cell of cells) {
        const abbr = cell.querySelector('abbr');
        const span = cell.querySelector('span[class*="name"], span[class*="team"]');
        const full = abbr?.getAttribute('title') ?? span?.textContent?.trim() ?? '';
        const cellText = cell.textContent?.trim() ?? '';

        if (full.length > 2) {
          name = full;
          shortName = abbr?.textContent?.trim() ?? cellText.substring(0, 3).toUpperCase();
          break;
        }

        if (cellText.length > 2 && isNaN(Number(cellText))) {
          // Strip any leading digits (position number bled into the cell text)
          name = cellText.replace(/^\d+/, '').trim();
          shortName = name.substring(0, 3).toUpperCase();
          break;
        }
      }

      if (!name) {
        console.warn(`  Warning: could not parse team name in row ${index + 1} of ${groupLabel}`);
        return;
      }

      // Numeric columns after the name cell.
      // Typical BBC column order: Pos | Team | P | W | D | L | GF | GA | GD | Pts
      const numericCells = cellTexts.filter((t) => !isNaN(Number(t)) && t !== '');
      // numericCells[0] may be the position — skip if same as groupPosition
      let offset = 0;
      if (Number(numericCells[0]) === groupPosition) offset = 1;

      const groupPlayed = parseInt(numericCells[offset] ?? '0') || 0;
      // Points is the last numeric column
      const groupPoints = parseInt(numericCells[numericCells.length - 1] ?? '0') || 0;

      countries.push({
        name,
        shortName,
        group,
        groupPosition,
        groupPlayed,
        groupPoints,
        isLast16: false,
        finalPosition: null,
      });
    });

    console.log(`  ${groupLabel}: parsed ${rows.length} teams`);
  }

  return countries;
}

/**
 * Walk the DOM after `startEl` (sibling-first, then parent's siblings) to find
 * the nearest <table> element. Stops when it encounters another group heading.
 */
function findNextTable(startEl: Element): Element | null {
  // Try siblings first
  let sibling = startEl.nextElementSibling;
  while (sibling) {
    const tag = sibling.tagName.toLowerCase();
    if (tag === 'table') return sibling;
    const nested = sibling.querySelector('table');
    if (nested) return nested;
    // Stop if we've hit another group heading
    const text = sibling.textContent?.trim() ?? '';
    if (/^Group [A-L]/.test(text)) break;
    sibling = sibling.nextElementSibling;
  }

  // Try parent's siblings (one level up — covers section/div wrappers)
  const parent = startEl.parentElement;
  if (parent) {
    let parentSibling = parent.nextElementSibling;
    while (parentSibling) {
      const tag = parentSibling.tagName.toLowerCase();
      if (tag === 'table') return parentSibling;
      const nested = parentSibling.querySelector('table');
      if (nested) return nested;
      const text = parentSibling.textContent?.trim() ?? '';
      if (/^Group [A-L]/.test(text)) break;
      parentSibling = parentSibling.nextElementSibling;
    }
  }

  return null;
}

async function run() {
  try {
    console.log('Fetching World Cup table from BBC Sport...');

    const countries = await fetchWCTable();

    if (countries.length === 0) {
      throw new Error('No country data was parsed — check the page structure.');
    }

    console.log(`\nParsed ${countries.length} countries across ${new Set(countries.map((c) => c.group)).size} groups`);

    const output: WCTable = {
      countries,
      timestamp: new Date().toISOString(),
    };

    const outputPath = path.join(process.cwd(), 'public', 'wc-table.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`\nWorld Cup table saved to: ${outputPath}`);
    console.log(`Updated at: ${output.timestamp}`);
  } catch (error) {
    console.error('Failed to update World Cup table:', error);
    process.exit(1);
  }
}

run();
