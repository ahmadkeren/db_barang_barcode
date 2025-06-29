const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const inputDir = path.resolve(__dirname, "products");
const outputDir = path.resolve(__dirname, "products_rembg");

fs.mkdirSync(outputDir, { recursive: true }); // Pastikan folder output ada

const files = fs.readdirSync(inputDir).filter(file => file.toLowerCase().endsWith(".png"));

let processedCount = 0;

function processNext(index) {
    if (index >= files.length) {
        console.log(`✅ Selesai memproses semua file. Total: ${processedCount} file diproses.`);
        return;
    }

    const file = files[index];
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    // Jika file output sudah ada, lewati
    if (fs.existsSync(outputPath)) {
        console.log(`➡️  Lewati: ${file} (sudah ada)`);
        processNext(index + 1);
        return;
    }

    // Jalankan rembg
    exec(`rembg i "${inputPath}" "${outputPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Gagal: ${file} - ${error.message}`);
        } else {
            processedCount++;
            console.log(`✅ ${processedCount}/${files.length} Diproses: ${file}`);
        }
        processNext(index + 1);
    });
}

if (files.length === 0) {
    console.log("📂 Tidak ada file PNG di folder 'products'.");
} else {
    console.log(`🔁 Mulai proses ${files.length} file...`);
    processNext(0);
}
