import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { nanoid } from "nanoid";
import { spawn } from "node:child_process";

function exec(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, opts);
    let stdout = "";
    let stderr = "";
    let killed = false;
    const timeoutMs = opts.timeoutMs || 30000;
    const timer = setTimeout(() => { killed = true; proc.kill("SIGKILL"); }, timeoutMs);
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("close", (code) => { clearTimeout(timer); resolve({ code, stdout, stderr, timedOut: killed }); });
    if (opts.input) {
      proc.stdin.write(opts.input);
      proc.stdin.end();
    }
  });
}

export async function runJava(code, input, timeoutMs = 10000) {
  const workDir = join(tmpdir(), `java_${nanoid(8)}`);
  await fs.mkdir(workDir, { recursive: true });
  const mainPath = join(workDir, "Main.java");
  await fs.writeFile(mainPath, code, "utf-8");
  try {
    const compile = await exec("javac", ["Main.java"], { cwd: workDir, timeoutMs });
    if (compile.timedOut) return { code: 1, stdout: "", stderr: "Compilation timeout", timedOut: true };
    if (compile.code !== 0) return { code: compile.code, stdout: compile.stdout, stderr: compile.stderr, timedOut: false };
    const run = await exec("java", ["Main"], { cwd: workDir, timeoutMs, input });
    return run;
  } finally {
    try { await fs.rm(workDir, { recursive: true, force: true }); } catch {}
  }
}

export async function runJavaHiddenTests(code, tests, timeoutMs = 10000) {
  for (let i = 0; i < tests.length; i++) {
    const t = tests[i];
    const { code: exitCode, stdout, stderr, timedOut } = await runJava(code, t.input, timeoutMs);
    if (timedOut) return { ok: false, message: `Timeout on case ${i + 1}` };
    if (exitCode !== 0) return { ok: false, message: `Runtime error on case ${i + 1}: ${stderr || stdout}` };
    const out = String(stdout || "").split('\n').map(s => s.trimEnd()).filter(s => s.trim() !== '').join('\n');
    const expected = String(t.expected).split('\n').map(s => s.trimEnd()).filter(s => s.trim() !== '').join('\n');
    if (out !== expected) return { ok: false, message: `Wrong answer for input ${t.input}` };
  }
  return { ok: true };
}


