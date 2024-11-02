const express = require('express');
const { Builder, By } = require('selenium-webdriver');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());


app.post('/search', async (req, res) => {
    const { keyword } = req.body;

    // Initialize the WebDriver
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        // Open the target website
        await driver.get('http://localhost:3000/'); // replace with your target URL

        // Locate the search bar element
        const searchBar = await driver.findElement(By.id('suno-search-target')); // change selector as needed

        // Type the keyword into the search bar and submit
        await searchBar.sendKeys(keyword); // Optionally you can send Key.RETURN for form submission

        // Wait for a while to let the search results load (adjust as needed)
        await driver.sleep(3000);

        // You can also capture the results here and send them back if needed

        res.status(200).json({ success: true, message: 'Search executed successfully' });
    } catch (error) {
        console.error('Error executing search:', error);
        res.status(500).json({ success: false, message: 'Error executing search' });
    } finally {
        await driver.quit();
    }
});

app.listen(PORT, () => {
    console.log(`Selenium server running on http://localhost:${PORT}`);
});
