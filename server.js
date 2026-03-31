const express = require("express");
const kuromoji = require("kuromoji");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(__dirname));

let tokenizer = null;

// Load tokenizer
kuromoji.builder({
    dicPath: path.join(__dirname, "dict")
}).build((err, t) => {
    if (err) {
        console.error("Tokenizer error:", err);
        return;
    }
    tokenizer = t;
    console.log("Tokenizer ready ✅");
});

// Safe translate
async function translateText(text) {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=${encodeURIComponent(text)}`;

        const res = await fetch(url);

        const contentType = res.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
            const raw = await res.text();
            console.error("Bad response:", raw.slice(0, 200));
            return "Translation error";
        }

        const data = await res.json();

        return data[0].map(t => t[0]).join("");

    } catch (err) {
        console.error("Translation crash:", err);
        return "Translation failed";
    }
}

// Main API
app.post("/process", async (req, res) => {
    try {
        if (!tokenizer) {
            return res.json({
                original: req.body.text,
                tokens: [],
                translation: "Tokenizer loading..."
            });
        }

        const tokens = tokenizer.tokenize(req.body.text);

        const formatted = tokens.map(t => ({
            word: t.surface_form,
            base: t.basic_form,
            reading: t.reading
        }));

        const translation = await translateText(req.body.text);

        res.json({
            original: req.body.text,
            tokens: formatted,
            translation
        });

    } catch (err) {
        console.error("🔥 SERVER CRASH:", err);

        res.status(500).json({
            error: true,
            details: err.message
        });
    }
});

// Start server
app.listen(3000, () => {
    console.log("Running at http://localhost:3000");
});