# Let’s Fix Money course

A standalone, interactive course based on Abdullah Mohiuddin’s *Let’s Fix Money*. Nine modules contain 102 lessons, 55 activities and nine action plans. The course follows Understand, Save, Build Resilience, Preserve, Grow, Transfer and Give, then closes with the author’s journey.

## Development

The course is static HTML, CSS and JavaScript, with no build step or package dependencies. Serve the repository root with a static server and open `course/index.html`.

- `assets/course-data.js`: original lesson text, activities, quizzes and optional book chapter/section connections.
- `assets/course.js`: navigation, inline activities, local workbook, export, print and progress.
- `assets/course.css`: base course layout and original conceptual illustrations.
- `assets/learning-data.js`: learning outcomes, fictional household story and lesson-to-activity mapping. Activity indices refer to the original activity list; each activity is mapped exactly once.
- `assets/learning-math.js`: pure arithmetic used by visual experiments and tests.
- `assets/learning-lab.js`: interactive SVG experiments and manually stepped explanations.
- `assets/learning-lab.css`: responsive visual teaching layout, focus states and reduced-motion support.

Each lesson follows Notice → Predict → Experiment → Apply. Seventeen focused experiment types cover topics such as the horse and cart, cash-flow direction, four saving pillars, prepaid bills, income interruptions and grants versus investment returns. Other lessons provide a point-by-point visual explanation. All activities remain available together in the workbook. Full lesson summaries remain readable without JavaScript.

The fictional Noor household connects the stages, with explicit scenario changes and a clear distinction from the author’s experience. Book connections use chapter and section names rather than edition-dependent page numbers. Existing module and lesson URLs remain valid.

## Learner data

Notes, answers, experiment settings and progress are stored locally in the browser. No account or server submission is required. Existing storage keys and completion records are preserved. Clearing browser data removes saved work; learners can download a plain-text workbook. When storage is blocked, the existing session-only fallback and warning remain available. Experiment settings are separate from personal workbook answers.

## Calculation scope

Visual examples are labelled fictional CAD amounts, not offers or personalized recommendations. They illustrate cash flow, comparable twelve-month billing, a simplified gross-income calculation, reserve timing, contribution schedules and sustainable choices. Existing workbook currency controls remain available.

Card repayments are excluded from spending when purchases were already recorded; interest and fees remain spending. Principal repayments still require cash. Prepaid bills reduce future obligations but are not accessible emergency cash, and renewals still need funding. Conditional support is separate from market returns. A negative stress-test balance means an unfunded gap, not access to borrowing. Account rules and eligibility still require verification through linked official sources.

## Validation

Run `node --test course/tests/learning.test.cjs` from the repository root. Tests cover arithmetic and boundary cases, all pillar combinations, activity mappings, quiz answers, dependency order, no-JavaScript summaries and reduced-motion styles.

Browser checks for the interactive revision covered all 102 lessons and nine workbooks, duplicate IDs, quiz feedback, saved answers after reload, cash-flow changes using the keyboard, and mobile layouts at 320 and 390 pixels. Existing tool links resolve against repository paths; those tools are not modified by this revision.
