import { test, expect } from '@playwright/test'

test('To get free coins it should', async ({ page }, testInfo) => {
  const OSM_USERNAME = process.env.OSM_LOGIN_USERNAME || ""
  const OSM_PASSWORD = process.env.OSM_LOGIN_PASSWORD || ""
  await test.step('get OSM credentials', async () => {
    if (!OSM_USERNAME || !OSM_PASSWORD) {
      testInfo.annotations.push({ type: 'error', description: `Check OSM credentials file, credentials seems not valid` })
      test.fail()
    }
  })
  await test.step('login to OSM', async () => {
    await page.goto('https://en.onlinesoccermanager.com/')
    await expect(page).toHaveTitle(/OSM/)
    const allowCookies = page.locator('xpath=//*[@id="page-privacynotice"]/div/div/div[2]/div[3]/div[2]/div[1]/div[1]/button')
    await allowCookies.click()
  })
  await test.step('accept cookies', async () => {
    await page.goto('https://en.onlinesoccermanager.com/Login')
    await expect(page).toHaveTitle(/OSM/)
    await page.locator('xpath=//*[@id="manager-name"]').fill(OSM_USERNAME)
    await page.locator('xpath=//*[@id="password"]').fill(OSM_PASSWORD)
    await page.locator('xpath=//*[@id="login"]').click()
    await new Promise(r => setTimeout(r, 5000))
  })
  await test.step('open balances modal', async () => {
    await page.reload()
    await new Promise(r => setTimeout(r, 5000))
    await page.locator('xpath=//*[@id="balances"]/div/div[3]').click({ force: true })
  })
  await test.step(`if available play video`, async () => {
    await page.locator('xpath=//*[@id="product-category-free"]/div[2]/div[1]/div').click()
    await expect(page.locator('xpath=//*[@id="modal-dialog-alert"]/div[4]/div/div/div/div[1]/h3')).toBeVisible()
      .then(async () => {
        await expect(page.locator('xpath=//*[@id="modal-dialog-alert"]/div[4]/div/div/div/div[1]/h3')).toHaveText(/show video/).then(() => {})
      })
      .catch(async () => {
        await new Promise(r => setTimeout(r, 35000))
      })
  })
  await test.step('get amount of coins', async () => {
    await page.goto('https://en.onlinesoccermanager.com/Career')
    await expect(page).toHaveTitle(/OSM/)
    await new Promise(r => setTimeout(r, 2000))
    const coinsAmount = await page.locator('xpath=//*[@id="balances"]/div[1]/div[1]/div/span').innerText()
    testInfo.annotations.push({ type: 'info', description: `Coins amount: ${coinsAmount}` })
  })
})