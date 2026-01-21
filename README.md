# Becoming You Labs — Candidate Exercise

This repo is a basic mock product inspired by Becoming You Labs. It is an
interview exercise for front end and full stack engineers.

Your goal is to implement pages based on a design reference and use the
provided interfaces to read mock data.

## Quick Start

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Timebox

Please spend no more than a few hours. Prioritize effective demonstration
of your abilities over completeness. This is meant for us to see your
general capabilities as an engineer; we're not making you do proprietary work
for us and we don't expect you to spend tons of time on this. We'll follow
up and review code together in a follow-up meeting.

- Front end engineers: focus on getting the breakdown page working nicely.
  Pixel-perfect is not required. The reference is `public/design/role_breakdown.pdf`,
  just a PDF and not Figma, so match the spirit of the design rather than exact sizing.
- Full stack engineers: prioritize a mostly finished breakdown page plus the
  server action and API endpoint work to demonstrate basic backend experience.

## Project Structure

- `src/app/page.tsx`: marketing hero page (already implemented).
- `src/app/discover/summary/page.tsx`: summary page for all results.
- `src/app/discover/breakdown/page.tsx`: detailed breakdown page for each role.
- `src/data/*.json`: mock database (do not import directly).
- `src/lib/data/*`: data access layer to the mock database.
- `src/actions/*`: server actions you may extend.

## Data Access Rules (Important)

The `data` directory is a mock database. Do not import from it directly.
Instead, always go through the provided interfaces:

- Roles: `src/lib/data/roles.ts`
- Users: `src/lib/data/users.ts`

If you need additional data access, extend these interfaces or add a new one in
`src/lib/data`. Keep direct JSON imports inside `src/lib/data` only.

## Your Tasks

### For Front End Engineers

1. Build the **breakdown page** in `src/app/discover/breakdown/page.tsx`
   based on the design PDF.
2. Optional: Design the **summary page** if you'd like to demonstrate your
   design sensibilities, and build it in `src/app/discover/summary/page.tsx`.

Focus on layout, visual fidelity, reusable structured components, and readability.

### For Full Stack Engineers

1. Build the **breakdown page** in `src/app/discover/breakdown/page.tsx`
   based on the design PDF.
2. Implement a **server action** that returns role info via the data access
   layer.
3. Implement an **API endpoint** that returns user results via the data access
   layer.

Use the existing patterns in `src/actions` and `src/app/api` as guides.

## Breakdown Page Behavior

- Display results for user 24601.
- Sort roles from highest score to lowest.
- Top 4 are **core roles**.
- Bottom 3 are **peripheral roles**.
- Definitions and descriptions change depending on ranking.
- Core, peripheral, highest, and lowest roles have special definitions that
  should appear in the "role alignment" section beneath the alignment meter.
- Roles are listed horizontally at the top; users can scroll and click each
  role to see its breakdown below.
- Note the top nav bar, and the sub-nav bar that highlights as core vs moderate
  vs peripheral as you move between roles.

## Design Assets

The design reference is a PDF located at `public/design/role_breakdown.pdf`.

## Allowed Tooling

Additional libraries are not expected, but they are not forbidden. You may
change Tailwind configuration if you want to demonstrate enforcing a design
system. You can use LLMs to guide your work; please include a note in your
submission README describing how much you relied on them.

## Submission

Fork this repo, complete your work in your fork, and send us the link.

## Evaluation Criteria

Front end:

- Visual fidelity to the PDF design.
- Smooth, usable experience.
- Effective structuring of reusable components.
- Correct data access through the provided interfaces.

Full stack:

- Effective front end implementation as stated above.
- Best practices in server actions and API design for data access.

## Notes

- Use the provided types in `src/lib/types.ts` and add more if needed.
- If you add new endpoints, use `NextResponse` and validate inputs.
- Aim for clear, maintainable code.


## Notes from I Meyerson Submission:

I used LLMs throughout the project. Firstly, I read the assignment spec several times and then had the LLM (chatgpt) read it over, and I asked guiding questions to make sure I understood what was being asked. I used an LLM to help me understand the already given API  endpoint design (for roles) so that I could build a new API endpoint that returned user results. Catastrophe hit and my computer ran out of storage. I used Chatgpt to help me debug whatever was happening with VSCode, which resulted in the loss of all my files for this project. I had to redo the getRoleAction.ts file and the API endpoint file route.ts under app/api/userResults. 

Finally, I had Claude Code help me with some of the UI components given in the pdf that I was not familiar with building. It also helped me debug my navigational bar on the breakout page, specifically syncing the navigation state ("core", "intermediate", "peripheral") with the role selected. 