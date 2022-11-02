import { test, expect } from '@playwright/test'

test('To get boss coins it should', async ({ page }, testInfo) => {
  const OSM_USERNAME = process.env.OSM_LOGIN_USERNAME || ""
  const OSM_PASSWORD = process.env.OSM_LOGIN_PASSWORD || ""
  await test.step('get OSM credentials', async () => {
    if(!OSM_USERNAME || !OSM_PASSWORD) {
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
  })
  await test.step('select team', async () => {
    await page.locator('//*[@id="body-content"]/div[2]/div[1]/div/div[1]/div/div[2]/div').click()
  })
  await test.step('go to business club page', async () => {
    await page.goto('https://en.onlinesoccermanager.com/BusinessClub')
    await expect(page).toHaveTitle(/Business/)
  })
  let i = 0
  const MAX_RETRIES = 15
  while(i < MAX_RETRIES) {
    await test.step(`if available play video (try ${i})`, async () => {
      await page.reload()
      await new Promise(r => setTimeout(r, 3000))
      await page.locator('//*[@id="body-content"]/div[2]/div[2]/div/div[1]/div').click()
      await expect(page.locator('xpath=//*[@id="modal-dialog-alert"]/div[4]/div/div/div/div[1]/h3')).toBeVisible()
      .then(async () => {
        await expect(page.locator('xpath=//*[@id="modal-dialog-alert"]/div[4]/div/div/div/div[1]/h3')).toHaveText(/show video/).then(() => {
          testInfo.annotations.push({ type: 'info', description: `${i} videos played. No more videos available` })
          i = MAX_RETRIES
        })
      })
      .catch(async () => {
        await new Promise(r => setTimeout(r, 35000))
        i++
      })
    })
  }
  await test.step('get amount of coins', async () => {
    await page.goto('https://en.onlinesoccermanager.com/Dashboard')
    await expect(page).toHaveTitle(/OSM/)
    await new Promise(r => setTimeout(r, 2000))
    const coinsAmount = await page.locator('xpath=//*[@id="balances"]/div[1]/div[1]/div/span').innerText()
    testInfo.annotations.push({ type: 'info', description: `Coins amount: ${coinsAmount}` })
  })
})