import { test, expect } from '@playwright/test';

const { chromium } = require('playwright')
const {expect} = require("expect");
const cp = require('child_process');
const playwrightClientVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

const parallelTests = async (capability) => {
  console.log('Initialising test:: ', capability['LT:Options']['name'])

  const browser = await chromium.connect({
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capability))}`
  })

  const page = await browser.newPage()

  try {
    
    /* 1. OpenLambdaTest’sSeleniumPlaygroundfrom
     https://www.lambdatest.com/selenium-playground
     2. Click“SimpleFormDemo”.
     3. ValidatethattheURLcontains“simple-form-demo”.
     4. Createavariableforastringvaluee.g.:“WelcometoLambdaTest”.
     5. Usethisvariabletoentervaluesinthe“EnterMessage”textbox.
     6. Click“GetCheckedValue”.
     7. Validatewhetherthesametextmessageisdisplayedintheright-hand
     panelunderthe“YourMessage:”section. */
    
    test('Test Scenario 1', async ({ page }) => {
      await page.goto('https://www.lambdatest.com/selenium-playground');
      await page.getByRole('link',{name:"Simple Form Demo"}).click();
      await expect(page).toHaveURL(/simple-form-demo/);
      const message = 'Welcome to LambdaTest';
      await page.getByPlaceholder('Please enter your Message').fill(message);
      await page.getByRole('button', {name:"Get Checked Value"}).click();
      await expect(page.locator('#message')).toContainText(message);
    
    });
    
    /*1. Open the https://www.lambdatest.com/selenium-playground page and
     click “Drag & Drop Sliders”.
     2. Select the slider “Default value 15” and drag the bar to make it 95 by
     validating whether the range value shows 95.*/ 
    
    test('Test Scenario 2', async ({ page }) => {
        await page.goto('https://www.lambdatest.com/selenium-playground');
    
    await page.getByText("Drag & Drop Sliders").click();
    const targetValue = "95";
    const slider15 = page.getByRole('slider').nth(2);
    await slider15.focus();
    let exactValue = await page.locator('#rangeSuccess').textContent();
    while (exactValue !=='95') {
      await page.keyboard.press('ArrowRight');
           exactValue = await page.locator('#rangeSuccess').textContent(); 
        }
        await expect(page.locator('#rangeSuccess')).toHaveText('95'); 
    });
    
    /*Test Scenario 3:
     1. Openthehttps://www.lambdatest.com/selenium-playground page and
     click “Input Form Submit”.
     2. Click “Submit” without filling in any information in the form.
     3. Assert “Please fill in the fields” error message.
     4. Fill in Name, Email, and other fields.
     5. Fromthe Country drop-down, select “United States” using the text
     property.
     6. Fill in all fields and click “Submit”.
     7. Oncesubmitted, validate the success message “Thanks for contacting
     us, we will get back to you shortly.” on the screen*/
    
    
    test('Test Scenario 3', async ({ page }) => {
      await page.goto('https://www.lambdatest.com/selenium-playground');
    
        await page.getByRole('link',{name:"Input Form Submit"}).click();
        await page.getByRole('button',{name:"Submit"}).click();
    
        // Assert “Please fill in the fields” error message
         // Not able to find the locator
    
        await page.getByRole ('textbox',{name:"Name"}).fill('Astha');
        await page.getByRole ('textbox',{name:"Email"}).fill('Astha@gmail.com');
        await page.getByRole ('textbox',{name:"Password"}).fill('Password');
        await page.getByRole ('textbox',{name:"Company"}).fill('Company');
        await page.getByRole ('textbox',{name:"Website"}).fill('www.website.com');
        await page.getByRole('combobox').selectOption('United States');
        await page.getByRole ('textbox',{name:"City"}).first().fill('City');
        await page.getByRole ('textbox',{name:"Address 1"}).fill('Test Address 1');
        await page.getByRole ('textbox',{name:"Address 2"}).fill('Test Address 2');
        await page.getByRole ('textbox',{name:"City* State*"}).fill('Test State');
        await page.getByRole ('textbox',{name:"Zip Code"}).fill('123456'); 
        await page.getByRole('button',{name:"Submit"}).click();
        await expect(page.getByText('Thanks for contacting us, we will get back to you shortly.')).toBeVisible();
    });
    
    // Mark the test as completed or failed
    await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'passed', remark: 'Title matched' } })}`)
    await teardown(page, browser)
  } catch (e) {
    await page.evaluate(_ => {}, `lambdatest_action: ${JSON.stringify({ action: 'setTestStatus', arguments: { status: 'failed', remark: e.stack } })}`)
    await teardown(page, browser)
    throw e.stack
  }

}

async function teardown(page, browser) {
  await page.close();
  await browser.close();
}

// Capabilities array for with the respective configuration for the parallel tests
const capabilities = [
  {
    'browserName': 'Chrome', // Browsers allowed: `Chrome`, `MicrosoftEdge`, `pw-chromium`, `pw-firefox` and `pw-webkit`
    'browserVersion': 'latest',
    'LT:Options': {
      'platform': 'Windows 10',
      'build': 'Playwright With Parallel Build',
      'name': 'Playwright Sample Test on Windows 10 - Chrome',
      'user': process.env.LT_USERNAME,
      'accessKey': process.env.LT_ACCESS_KEY,
      'network': true,
      'video': true,
      'console': true,
      'playwrightClientVersion': playwrightClientVersion
    }
  },
  {
    'browserName': 'pw-firefox',
    'browserVersion': 'latest',
    'LT:Options': {
      'platform': 'MacOS Catalina',
      'build': 'Playwright With Parallel Build',
      'name': 'Playwright Sample Test on Windows 8 - MicrosoftEdge',
      'user': process.env.LT_USERNAME,
      'accessKey': process.env.LT_ACCESS_KEY,
      'network': true,
      'video': true,
      'console': true,
      'playwrightClientVersion': playwrightClientVersion
    }
  },
  {
    'browserName': 'Chrome',
    'browserVersion': 'latest',
    'LT:Options': {
      'platform': 'MacOS Big sur',
      'build': 'Playwright With Parallel Build',
      'name': 'Playwright Sample Test on MacOS Big sur - Chrome',
      'user': process.env.LT_USERNAME,
      'accessKey': process.env.LT_ACCESS_KEY,
      'network': true,
      'video': true,
      'console': true,
      'playwrightClientVersion': playwrightClientVersion
    }
  }]

capabilities.forEach(async (capability) => {
  await parallelTests(capability)
})
