import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
    base: "/",
    server: {
        host: "0.0.0.0",
        port: 8082,

	    // Så servern inte börjar testa exempelvis 8081 om 8080 it är ledig
        strictPort: true,
    },
    plugins: [react()],
})
