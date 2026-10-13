const { performance } = require("node:perf_hooks");

// ========================================
// 1. SAMPLE TASKS
// ========================================

const tasks = [
  { start: 1, end: 3 },
  { start: 2, end: 5 },
  { start: 4, end: 6 },
  { start: 6, end: 7 },
  { start: 5, end: 9 },
  { start: 8, end: 10 },
];

// 2. BRUTE-FORCE ALGORITHM

function bruteForce(tasks) {
  const sortedTasks = [...tasks].sort((a, b) => a.start - b.start);

  let bestSchedule = [];

  function explore(index, selected) {
    // If we have considered every task, stop this branch.
    if (index === sortedTasks.length) {
      if (selected.length > bestSchedule.length) {
        bestSchedule = [...selected];
      }

      return;
    }

    // Branch 1: Do not select the current task.
    explore(index + 1, selected);

    // Branch 2: Select the current task if it doesn't overlap.
    const currentTask = sortedTasks[index];

    const lastTask = selected[selected.length - 1];

    if (!lastTask || currentTask.start >= lastTask.end) {
      selected.push(currentTask);

      explore(index + 1, selected);

      // Backtrack: remove the task before exploring other choices.
      selected.pop();
    }
  }

  explore(0, []);

  return bestSchedule;
}

// 3. GREEDY ALGORITHM

function greedy(tasks) {
  // Sort tasks by their finishing time.
  const sortedTasks = [...tasks].sort((a, b) => a.end - b.end);

  const selectedTasks = [];
  let lastEndTime = -Infinity;

  for (const task of sortedTasks) {
    // We select the task if it doesn't overlap with the last one.
    if (task.start >= lastEndTime) {
      selectedTasks.push(task);
      lastEndTime = task.end;
    }
  }

  return selectedTasks;
}

// 4. DISPLAY SAMPLE RESULTS

const bruteForceResult = bruteForce(tasks);
const greedyResult = greedy(tasks);

console.log("========== SAMPLE TASKS ==========");
console.table(tasks);

console.log("\n========== BRUTE-FORCE RESULT ==========");
console.table(bruteForceResult);
console.log("Number of selected tasks:", bruteForceResult.length);

console.log("\n========== GREEDY RESULT ==========");
console.table(greedyResult);
console.log("Number of selected tasks:", greedyResult.length);

console.log("\n========== VALIDATION ==========");

console.log(
  "Both algorithms return the same maximum count:",
  bruteForceResult.length === greedyResult.length,
);

// 5. GENERATE RANDOM TASKS

function generateRandomTasks(count) {
  const randomTasks = [];

  for (let i = 0; i < count; i++) {
    const start = Math.floor(Math.random() * 10000);
    const duration = Math.floor(Math.random() * 100) + 1;

    randomTasks.push({
      start,
      end: start + duration,
    });
  }

  return randomTasks;
}

// 6. BENCHMARK GREEDY WITH 10,000 TASKS

const largeTasks = generateRandomTasks(10000);

console.log("\n========== PERFORMANCE TEST ==========");
console.log("Number of generated tasks:", largeTasks.length);

const greedyStart = performance.now();
const largeGreedyResult = greedy(largeTasks);
const greedyEnd = performance.now();

console.log("Greedy selected tasks:", largeGreedyResult.length);
console.log(
  "Greedy execution time:",
  (greedyEnd - greedyStart).toFixed(3),
  "ms",
);

// 7. BENCHMARK BRUTE FORCE ON A SMALLER INPUT

// Brute force is exponential, so 10,000 tasks would be
// computationally impractical. We use a smaller input instead.

const smallTasks = generateRandomTasks(18);

const bruteStart = performance.now();
const smallBruteResult = bruteForce(smallTasks);
const bruteEnd = performance.now();

const smallGreedyResult = greedy(smallTasks);

console.log("\n========== BRUTE-FORCE PERFORMANCE TEST ==========");
console.log("Number of generated tasks:", smallTasks.length);
console.log("Brute-force selected tasks:", smallBruteResult.length);
console.log(
  "Brute-force execution time:",
  (bruteEnd - bruteStart).toFixed(3),
  "ms",
);
console.log("Greedy selected tasks:", smallGreedyResult.length);
console.log(
  "Both algorithms agree:",
  smallBruteResult.length === smallGreedyResult.length,
);

// 8. OPTIONAL EDGE-CASE TESTS

const edgeCases = {
  "All overlapping": [
    { start: 1, end: 10 },
    { start: 2, end: 9 },
    { start: 3, end: 8 },
    { start: 4, end: 7 },
  ],

  "All non-overlapping": [
    { start: 1, end: 2 },
    { start: 2, end: 3 },
    { start: 3, end: 4 },
    { start: 4, end: 5 },
  ],

  "Same start or end time": [
    { start: 1, end: 4 },
    { start: 1, end: 3 },
    { start: 3, end: 5 },
    { start: 4, end: 6 },
    { start: 5, end: 7 },
  ],
};

console.log("\n========== EDGE-CASE TESTS ==========");

for (const [caseName, caseTasks] of Object.entries(edgeCases)) {
  const bruteResult = bruteForce(caseTasks);
  const greedyResult = greedy(caseTasks);

  console.log(`\n${caseName}`);
  console.log("Brute force:", bruteResult.length);
  console.log("Greedy:", greedyResult.length);
  console.log("Results agree:", bruteResult.length === greedyResult.length);
}
