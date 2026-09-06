import type { FullConfig, Reporter, Suite, TestCase, TestResult } from "@playwright/test/reporter";

export default class CleanExitReporter implements Reporter {
  private completed = 0;
  private failed = false;
  private total = 0;

  onBegin(_config: FullConfig, suite: Suite) {
    this.total = suite.allTests().length;
  }

  onTestEnd(_test: TestCase, result: TestResult) {
    this.completed += 1;
    this.failed ||= !["passed", "skipped"].includes(result.status);
    if (this.completed !== this.total) return;

    // Vinext/Vite can retain a Windows process handle after Playwright finishes.
    setTimeout(() => process.exit(this.failed ? 1 : 0), 2_000);
  }
}
