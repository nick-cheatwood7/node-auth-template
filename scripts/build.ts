import esbuild from "esbuild";

async function main() {
    try {
        const startTime = Date.now();
        await esbuild.build({
            entryPoints: ["./src/index.ts"],
            bundle: true,
            platform: "node",
            packages: "external",
            target: ["node18.0"],
            format: "esm",
            minify: true,
            sourcemap: true,
            outfile: "dist/main.js"
        });
        console.log(`📦 Build successful, took ${Date.now() - startTime}ms`);
    } catch (error) {
        console.error(error);
    }
}

main();
