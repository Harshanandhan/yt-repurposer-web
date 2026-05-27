const key = "AIzaSyDyvDOFja_P65PhT8V1faUxgk0K1NIDgmo";
const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
const data = await res.json();
if (data.error) { console.log("Error:", data.error.message); process.exit(1); }
const names = data.models.map(m => m.name).filter(n => n.includes("gemini"));
console.log(names.join("\n"));
