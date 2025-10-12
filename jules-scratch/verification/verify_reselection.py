import asyncio
import json
import os
import signal
import subprocess
from playwright.async_api import async_playwright, expect

# Sample quiz data to be used in the test
sample_quiz = {
    "title": "Reselection Test Quiz",
    "questions": [
        {
            "text": "Which option can be reselected?",
            "options": ["Option A", "Option B", "Option C"],
            "correctAnswerIndex": 2,
        }
    ],
}

async def run_verification():
    """
    This script verifies the frontend change for the reselection fix.
    """
    app_process = None
    try:
        command = "xvfb-run npx electron . --remote-debugging-port=9222"
        app_process = subprocess.Popen(command, shell=True, preexec_fn=os.setsid)
        await asyncio.sleep(5)

        async with async_playwright() as p:
            browser = await p.chromium.connect_over_cdp("http://localhost:9222")
            contexts = browser.contexts
            if not contexts:
                raise Exception("No browser contexts found.")
            page = contexts[0].pages[0] if contexts[0].pages else await contexts[0].new_page()

            await page.goto("file://" + os.path.abspath("index.html"), wait_until="load")

            js_setup_code = f"""
            async () => {{
                await new Promise(resolve => {{
                    const check = () => window.showdown ? resolve() : setTimeout(check, 100);
                    check();
                }});

                document.getElementById('home-view').classList.add('hidden');
                document.getElementById('taker-view').classList.remove('hidden');

                window.currentQuiz = {json.dumps(sample_quiz)};
                window.currentQuestionIndex = 0;
                window.score = 0;
                window.renderTakerQuiz();
            }}
            """
            await page.evaluate(js_setup_code)

            await page.locator(".option-tile").first.wait_for(timeout=5000)

            option_tiles = await page.locator(".option-tile").all()

            # Select the first option
            await option_tiles[0].click()
            await expect(option_tiles[0]).to_have_class("option-tile selected")

            # Reselect to the second option
            await option_tiles[1].click()
            await expect(option_tiles[1]).to_have_class("option-tile selected")

            # Take a screenshot of the final state
            await page.screenshot(path="jules-scratch/verification/verification.png")
            print("Screenshot taken.")

    finally:
        if app_process:
            os.killpg(os.getpgid(app_process.pid), signal.SIGTERM)
            try:
                app_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                os.killpg(os.getpgid(app_process.pid), signal.SIGKILL)
        print("Verification script finished.")

if __name__ == "__main__":
    asyncio.run(run_verification())