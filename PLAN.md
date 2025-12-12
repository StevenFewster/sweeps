Static Sweepstake
---

# Purpose
I have a series of predictions for a football league prediction game stored in /resources/entries directory.  Also there is an example of the league table prem-20240-25.json .  This site is to serve two purposes:

1. Show the scores for peoples predictions, where they get 1 point for a a team being in the correct section (top 4 or bottom 3) and 4 points for being in the exact correct position to give a total of 5 points per prediction, a maximum of 35 points.  Users also provide a guess for the total number of goals scored in the league to be used in the event of a tie.
2. Provide a list of the current league positions, goals scored to date, number of games played to date, and an estimate of the total goals that will be scored based on that data.

## Pages

1. Landing Page: (/)

Says "Welcome to the PL Sweepstake 2025/26" and a button that says enter which takes you to the current scores page.

2.  Current Scores Page (/scores)

Loads a JSON file of the scores calulated for each entrant in summary form and ordered by current score as a list table:

Position|Player|Score|Tie Breaker

With a footer that shows nothing in the first 3 columns and the estimated scored goals in the last column.

Clicking a user will expand their list item to show their predictions in predicted order like so:

Pos|Team|Actual|Score

3. League table page (/table):

A table of teams:
Position|Short Name|Name

with the top 4 and bottom 3 teams in a different colour to the rest of the table.

The table is editable by dragging and dropping teams.
There are fields at the bottom games played and total goals, and a save button which will output JSON of the ordered teams, fields entered, calculated estimated total goals, and a timestamp when it was created.

The JSON is copied to the clipboard so I can manually update the static file.

## Calculating scores

The scores JSON which feed into the scores page is generated from the file created on page 3, and the users predictions in /resources

# Development Stack

- Daisy UI
- Typescript
- React
- NextJS Static

It should generate a static output to be hosted on github pages.  It should create a github actions to make this automatic when main is committed and pushed.

There should be unit test coverage.