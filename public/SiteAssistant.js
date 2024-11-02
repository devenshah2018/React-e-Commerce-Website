//import { Builder, By, Key } from 'selenium-webdriver';

class SiteAssistant extends HTMLElement {
    constructor() {
        super();
        this.site = "https://www.nike.com";
        this.recognition = null;
        this.apiKey = "sk-proj-X58wigsslfWqA9wfNGU3T3BlbkFJad6QDaBQxVNsE2Qalej0";
        this.pageMappings = {
            "men's shoes": "/w/mens-shoes-nik1zy7ok",
            "women's sweatshirts and hoodies": "/w/womens-hoodies-pullovers-5e1x6z6rive"
        };
        this.isListening = false;  // Add listening control flag
        this.createComponentUI();
    }

    connectedCallback() {
        this.initializeSpeechRecognition();
    }

    createComponentUI() {
        const button = document.createElement('button');
        button.textContent = 'Activate Voice Assistant';
        button.onclick = () => this.startListening();
        this.appendChild(button);

        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop Listening';
        stopButton.onclick = () => this.stopListening();
        this.appendChild(stopButton);
    }

    initializeSpeechRecognition() {
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = "en-US";

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Transcript:", transcript);
            this.processTranscript(transcript);
        };

        this.recognition.onerror = (error) => {
            console.error("Speech Recognition Error:", error);
            this.speak("Sorry, I couldn't understand. Please try again.");
        };

        this.recognition.onend = () => {
            if (this.isListening) {
                this.startListening();
            }
        };
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            this.isListening = true;
            this.recognition.start();
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.isListening = false;
            this.recognition.stop();
        }
    }

    async processTranscript(transcript) {
        try {
            console.log(transcript);
            const action = await this.analyzeTranscriptWithOpenAI(transcript);
            this.executeSearch(action);
            //this.executeAction(action);
        } catch (error) {
            console.error("Error processing transcript:", error);
            this.speak("There was an error understanding your request.");
        }
    }

    async analyzeTranscriptWithOpenAI(transcript) {
        const products = [
            "Intelligent Wooden Fish",
            "Rustic Metal Pizza",
            "Practical Soft Gloves",
            "Licensed Fresh Shirt",
            "Sleek Plastic Pants",
            "Elegant Bronze Chair",
            "Generic Fresh Table",
            "Unbranded Steel Pizza",
            "Intelligent Rubber Bacon",
            "Ergonomic Rubber Shirt",
            "Intelligent Granite Ball",
            "Oriental Granite Table",
            "Small Bronze Salad",
            "Handmade Plastic Chair",
            "Incredible Rubber Computer"
        ];
        const query = `You are a shopping assistant. From the following transcript, determine which of the products closely relate. Return only a single entry from the list of products. Here is a list of possible products: ${JSON.stringify(products)}. Here is the transcript: ${transcript}.`;
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: query }],
                max_tokens: 50
            })
        });
        const data = await response.json();
        const action = data.choices[0].message.content;
        console.log("OpenAI Analysis Result:", action);
        return action;
    }

    executeAction(action) {
        action = action.toLowerCase();
        for (const [keyword, url] of Object.entries(this.pageMappings)) {
            if (action.includes(keyword)) {
                this.speak(`Navigating to ${keyword}.`);
                window.open(this.site + url, '_blank');
                return;
            }
        }
        this.speak("I'm not sure how to help with that request.");
    }

    async executeSearch(keyword) {
        const searchBar = document.getElementById('suno-search-target');
        if (searchBar) {
            // Focus on the search bar
            searchBar.focus();
    
            // Set the search bar's value
            const changeEvent = new Event('change', { bubbles: true });
            searchBar.dispatchEvent(changeEvent);
            searchBar.value = keyword;
    
            const inputEvent = new Event('input', { bubbles: true });
            searchBar.dispatchEvent(inputEvent);
    
            // Optionally dispatch change event
            searchBar.dispatchEvent(changeEvent);
            
            // Ensure the value is updated in the DOM
            console.log("Search keyword set:", searchBar.value);
        } else {
            console.error("Search bar not found!");
        }
    }
    
    

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    }
}

// Register the custom element
customElements.define('site-assistant', SiteAssistant);
