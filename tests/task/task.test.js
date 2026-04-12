const test = require("node:test");
const assert = require("node:assert");
const { create } = require("#app/task/task");

test("create function should generate a task object", () => {
  assert.strictEqual(typeof create, "function", "create should be a function");
  console.log("✓ create is a function");
});

test("task object should have required properties", () => {
  const title = "Test task description";
  create(title, (task, err) => {
    assert.equal(err, undefined, "No error should occur during task creation");
    assert.ok(task.id, "Task should have an id");
    assert.strictEqual(
      task.title,
      title,
      "Task should have the correct description",
    );
    assert.ok(task.created, "Task should have a created timestamp");
    assert.ok(task.modified, "Task should have a modified timestamp");

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    assert.ok(uuidRegex.test(task.id), "Task id should be a valid UUID");

    assert.strictEqual(
      typeof task.created,
      "number",
      "Created should be a number (timestamp)",
    );

    console.log("✓ Task created successfully:", task);
  });
});

test("task should be persisted to file", () => {
  const fs = require("node:fs/promises");
  const path = require("node:path");

  const title = "Test task for persistence";
  create(title, async (task) =>{
    await new Promise((resolve) => setTimeout(resolve, 100));

    const filePath = path.join(".", "data", "task", task.id + ".json");

    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      const savedTask = JSON.parse(fileContent);

      assert.strictEqual(
        savedTask.id,
        task.id,
        "Saved task should have the same id",
      );
      assert.strictEqual(
        savedTask.title,
        task.title,
        "Saved task should have the same description",
      );
      assert.strictEqual(
        savedTask.created,
        task.created,
        "Saved task should have the same created timestamp",
      );
      assert.strictEqual(
        savedTask.modified,
        task.modified,
        "Saved task should have the same modified timestamp",
      );

      console.log("✓ Task successfully persisted to file:", filePath);

      await fs.unlink(filePath);
      console.log("✓ Test file cleaned up");
    } catch (error) {
      assert.fail(
        "Failed to read or parse the persisted task file: " + error.message,
      );
    }

  });

});

test("task should be read from file", () => {
  const fs = require("node:fs/promises");
  const path = require("node:path");

  const title = "Test task for reading";
  create(title, async (task) => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const filePath = path.join(".", "data", "task", task.id + ".json");

    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      const savedTask = JSON.parse(fileContent);

      assert.strictEqual(
        savedTask.id,
        task.id,
        "Read task should have the same id",
      );
      assert.strictEqual(
        savedTask.title,
        task.title,
        "Read task should have the same description",
      );
      assert.strictEqual(
        savedTask.created,
        task.created,
        "Read task should have the same created timestamp",
      );
      assert.strictEqual(
        savedTask.modified,
        task.modified,
        "Read task should have the same modified timestamp",
      );

      console.log("✓ Task successfully read from file:", filePath);

      await fs.unlink(filePath);
      console.log("✓ Test file cleaned up");
    } catch (error) {
      assert.fail(
        "Failed to read or parse the persisted task file: " + error.message,
      );
    }
  });
});

test("update should call the callback with the updated task", async () => {
  const { update } = require("#app/task/task");
  const fs = require("node:fs/promises");
  const path = require("node:path");

  const init = {
    id: "00000000-0000-0000-0000-000000000000",
    title: "update me",
  };

  const full = {
    id: "00000000-0000-0000-0000-000000000000",
    title: "update me",
    done: 1577836800,
  };

  const cases = [
    { start: init, title: "updated title", description: "update title only 0" },
    { start: init, done: false, description: "update nothing" },
    { start: init, done: true, description: "update done with timestamp" },
    { start: init, title: "updated title", done: true , description: "update title and done" },
    { start: init, title: "updated title", done: false, description: "update title only 1" },
    { start: full, title: "updated title", description: "update title only 2"},
    { start: full, done: false, description: "unset done" },
    { start: full, done: true, description: "update nothing" },
    { start: full, title: "updated title", done: true, description: "update title only 3" },
    { start: full, title: "updated title", done: false, description: "update title and unset done" },
  ];

  for (let i = 0; i < cases.length; i++) {
    const testCase = cases[i];
    console.log(`\n--- Test Case ${i + 1}: ${testCase.description} ---`);

    // Setup: Erstelle initial task basierend auf start-Zustand
    const filePath = path.join(".", "data", "task", testCase.start.id + ".json");
    await fs.writeFile(filePath, JSON.stringify(testCase.start, null, 2));

    // Test: Update mit den gewünschten Parametern
    await new Promise((resolve, reject) => {
      update(testCase.start.id, testCase.title, testCase.done, (updatedTask, err) => {
        try {
          assert.equal(err, null, `No error should occur during update: ${testCase.description}`);
          
          // Prüfe title
          const expectedTitle = testCase.title !== undefined ? testCase.title : testCase.start.title;
          assert.strictEqual(updatedTask.title, expectedTitle, 
            `Title should be correct for: ${testCase.description}`);

          // Prüfe done Logik
          if (testCase.done) {
            // done ist truthy -> timestamp sollte vorhanden sein
            assert.ok(updatedTask.done, `Done timestamp should exist for: ${testCase.description}`);
            assert.strictEqual(typeof updatedTask.done, "number", 
              `Done should be a timestamp for: ${testCase.description}`);
            
            // Wenn bereits ein timestamp vorhanden war, sollte er erhalten bleiben
            if (testCase.start.done) {
              assert.strictEqual(updatedTask.done, testCase.start.done,
                `Existing done timestamp should be preserved for: ${testCase.description}`);
            } else {
              // Neuer timestamp sollte aktuell sein (innerhalb der letzten Sekunde)
              const now = Date.now();
              assert.ok(updatedTask.done <= now && updatedTask.done >= now - 1000,
                `New done timestamp should be current for: ${testCase.description}`);
            }
          } else if (testCase.done === false) {
            // done ist explizit false -> done Feld sollte nicht vorhanden sein
            assert.strictEqual(Object.hasOwn(updatedTask, 'done'), false,
              `Done field should not exist when set to false for: ${testCase.description}`);
          } else if (testCase.done === undefined) {
            // done nicht angegeben -> bestehender Zustand beibehalten
            if (testCase.start.done) {
              assert.strictEqual(updatedTask.done, testCase.start.done,
                `Existing done state should be preserved when not specified for: ${testCase.description}`);
            } else {
              assert.strictEqual(Object.hasOwn(updatedTask, 'done'), false,
                `Done field should remain absent when not specified for: ${testCase.description}`);
            }
          }

          console.log(`✓ Case ${i + 1} passed:`, updatedTask);
          resolve();
        } catch (assertError) {
          reject(assertError);
        }
      });
    });

    // Cleanup
    try {
      await fs.unlink(filePath);
    } catch {
      // Ignoriere cleanup errors
    }
  }
});
