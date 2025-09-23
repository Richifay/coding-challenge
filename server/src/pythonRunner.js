import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { nanoid } from "nanoid";
import { spawn } from "node:child_process";

function spawnPython(filePath, input = "", timeoutMs = 3000) {
  return new Promise((resolve) => {
    const proc = spawn("python3", ["-I", "-B", filePath], {
      env: { PYTHONIOENCODING: "utf-8" },
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let killed = false;

    const timer = setTimeout(() => {
      killed = true;
      proc.kill("SIGKILL");
    }, timeoutMs);

    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));

    proc.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut: killed });
    });

    if (input) proc.stdin.write(input);
    proc.stdin.end();
  });
}

export async function runUserScript(code, input, timeoutMs = 3000) {
  const filePath = join(tmpdir(), `user_${nanoid(8)}.py`);
  await fs.writeFile(filePath, code, "utf-8");
  try {
    const result = await spawnPython(filePath, input, timeoutMs);
    return result;
  } finally {
    fs.unlink(filePath).catch(() => {});
  }
}

export async function runHiddenTests(code, tests, timeoutMs = 3000) {
  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    const { code: exitCode, stdout, stderr, timedOut } = await runUserScript(
      code,
      t.input,
      timeoutMs
    );

    if (timedOut) {
      return { ok: false, message: `Timeout on case ${i + 1}` };
    }
    if (exitCode !== 0) {
      return { ok: false, message: `Runtime error on case ${i + 1}: ${stderr || stdout}` };
    }

    const out = String(stdout || "").split('\n').map(line => line.trimEnd()).filter(line => line.trim() !== '').join('\n');
    const expected = String(t.expected).split('\n').map(line => line.trimEnd()).filter(line => line.trim() !== '').join('\n');
    if (out !== expected) {
      return {
        ok: false,
        message: `I tried to execute your code with the input "${t.input}" and couldn't get the correct result 😭.`,
      };
    }
  }
  return { ok: true };
}
