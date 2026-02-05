const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Key design system pages to scrape
const PAGES_TO_SCRAPE = {
  colors: 'https://design.fevertools.com/1d4a57dde/p/345c92-colors',
  colorsBase: 'https://design.fevertools.com/1d4a57dde/p/345c92-colors/b/43a02c',
  typography: 'https://design.fevertools.com/1d4a57dde/p/7050ce-typography',
  typographyWeb: 'https://design.fevertools.com/1d4a57dde/p/7050ce-typography/b/810182',
  designTokens: 'https://design.fevertools.com/1d4a57dde/p/00337b-design-tokens',
  tokensList: 'https://design.fevertools.com/1d4a57dde/p/00337b-design-tokens/b/09d74d',
  shadows: 'https://design.fevertools.com/1d4a57dde/p/18b4c8-shadows',
  radii: 'https://design.fevertools.com/1d4a57dde/p/7672bc-radii',
  layout: 'https://design.fevertools.com/1d4a57dde/p/38794c-layout',
  buttons: 'https://design.fevertools.com/1d4a57dde/p/179558-common-buttons',
};

async function scrapeDesignSystem() {
  console.log('🚀 Launching browser...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const designSystem = {
    colors: {},
    typography: {},
    spacing: {},
    shadows: {},
    radii: {},
    components: {}
  };
  
  // Scrape each page
  for (const [pageName, url] of Object.entries(PAGES_TO_SCRAPE)) {
    console.log(`\n📄 Scraping ${pageName}: ${url}`);
    
    try {
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 60000 
      });
      
      // Wait for content
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Take screenshot
      await page.screenshot({ 
        path: `screenshots/${pageName}.png`, 
        fullPage: true 
      });
      
      // Extract text content
      const textContent = await page.evaluate(() => document.body.innerText);
      fs.writeFileSync(`scraped-content/${pageName}.txt`, textContent);
      
      // Extract HTML content
      const htmlContent = await page.content();
      fs.writeFileSync(`scraped-content/${pageName}.html`, htmlContent);
      
      console.log(`   ✅ Saved ${pageName} content`);
      
    } catch (error) {
      console.error(`   ❌ Error scraping ${pageName}:`, error.message);
    }
  }
  
  // Now analyze the scraped content for design tokens
  console.log('\n📊 Analyzing scraped content for design tokens...');
  
  await browser.close();
  console.log('\n✅ Browser closed. Scraping complete!');
  console.log('📁 Check scraped-content/ folder for raw data');
  console.log('📸 Check screenshots/ folder for page screenshots');
}

// Create output directories
if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');
if (!fs.existsSync('scraped-content')) fs.mkdirSync('scraped-content');

// Run the scraper
scrapeDesignSystem().catch(console.error);
