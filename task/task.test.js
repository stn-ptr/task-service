const test = require("node:test");
const assert = require("node:assert");
const { create } = require("./task.js");

test("create function should generate a task object", () => {
  assert.strictEqual(typeof create, "function", "create should be a function");
  console.log("✓ create is a function");
});

test("task object should have required properties", () => {
  const title = "Test task description";
  const task = create(title, (task, err) => {
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
  create(title, async (task, err) =>{
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
  create(title, async (task, err) => {
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
