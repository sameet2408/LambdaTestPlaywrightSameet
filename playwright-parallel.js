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
    // Mark the test as completed or failed
  await page.goto('https://www.lambdatest.com/selenium-playground');
  await page.getByText('Simple Form Demo').click();
  const inputMessage = 'Welcome to LambdaTest';
  await page.fill('#user-message', inputMessage);
  await page.getByRole('button', { name: 'Get Checked Value' }).click();
  const displayedMessage = await page.textContent('#message');
    expect(displayedMessage?.trim()).toBe(inputMessage);


  
    await page.goto('https://www.lambdatest.com/selenium-playground');
    await page.getByText('Drag & Drop Sliders').click();
    const slider = page.locator('//*[@id="slider3"]/div/input')
    await slider.focus();
    for (let i = 0; i < 80; i++) {
      await page.keyboard.down('ArrowRight');
      if (i == 79) {
        await page.keyboard.up('ArrowRight');
        break;
    }
  }
  const number1= Number(await page.locator('#rangeSuccess').textContent());
  await expect(number1).toBe(95);



await page.goto('https://www.lambdatest.com/selenium-playground');
await page.getByText("Input Form Submit").click();
await page.getByRole("button", { name: "Submit"}).click();
await page.getByRole("textbox", { name: 'Name'}).fill("Sameet");
await page.getByRole("textbox", { name: 'Email'}).fill("Test123@xyz.com");
await page.getByRole("textbox", { name: 'Password'}).fill("Password@123");
await page.getByRole("textbox", { name: 'Company'}).fill("XYZ PVT LTD");
await page.getByRole("textbox", { name: 'Website'}).fill("XYZPVTLTD.com");
await page.getByRole('combobox').selectOption("United States")
await page.getByRole("textbox", { name: 'City', exact: true}).fill("New York");
await page.getByRole("textbox", { name: 'Address 1'}).fill("123 Palk Street");
await page.getByRole("textbox", { name: 'Address 2'}).fill("Suite 134");
await page.getByRole("textbox", { name: 'City* State*'}).fill("NY");
await page.getByRole("textbox", { name: 'Zip Code'}).fill("53151");
await page.getByRole("button", { name: "Submit"}).click();
const successMessage = await page.textContent(".success-msg");
    expect(successMessage.trim()).toBe("Thanks for contacting us, we will get back to you shortly.")


 

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
      'platform': 'macOS Catalina',
      'build': 'Playwright With Parallel Build',
      'name': 'Playwright Sample Test on macOS - firefox',
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
