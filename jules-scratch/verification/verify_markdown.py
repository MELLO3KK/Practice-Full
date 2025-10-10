from playwright.sync_api import sync_playwright
import os

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp("http://localhost:9222")
        context = browser.contexts[0]
        window = context.pages[0]

        window.click('button#go-to-taker-btn')

        # Wait for the file chooser to appear and set the file
        with window.expect_file_chooser() as fc_info:
            pass # The button click above might have already triggered the file chooser
        file_chooser = fc_info.value
        file_path = os.path.abspath('jules-scratch/verification/markdown-quiz.json')
        file_chooser.set_files(file_path)

        window.wait_for_selector('#taker-question-area')
        window.screenshot(path='jules-scratch/verification/verification.png')
        browser.close()

if __name__ == '__main__':
    run_verification()
