/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surfaces
        "surface-page":           "var(--surface-page)",
        "surface-card":           "var(--surface-card)",
        "surface-sidebar":        "var(--surface-sidebar)",
        "surface-sidebar-accent": "var(--surface-sidebar-accent)",

        // Brand ramp
        "brand-50":               "var(--brand-50)",
        "brand-100":              "var(--brand-100)",
        "brand-200":              "var(--brand-200)",
        "brand-300":              "var(--brand-300)",
        "brand-400":              "var(--brand-400)",
        "brand-500":              "var(--brand-500)",
        "brand-600":              "var(--brand-600)",
        "brand-700":              "var(--brand-700)",
        "brand-800":              "var(--brand-800)",
        "brand-900":              "var(--brand-900)",
        "brand-tint":             "var(--brand-tint)",
        "brand-tint-strong":      "var(--brand-tint-strong)",
        "brand-bar":              "var(--brand-bar)",

        // Text
        "text-primary":           "var(--text-primary)",
        "text-secondary":         "var(--text-secondary)",
        "text-subtle":            "var(--text-subtle)",
        "text-heading":           "var(--text-heading)",
        "text-muted":             "var(--text-muted)",
        "text-muted-strong":      "var(--text-muted-strong)",
        "text-supporting":        "var(--text-supporting)",

        // Borders
        "border-default":         "var(--border-default)",
        "border-soft":            "var(--border-soft)",
        "border-subtle":          "var(--border-subtle)",

        // Status
        "status-pending":         "var(--status-pending)",
        "status-success":         "var(--status-success)",
        "status-success-soft":    "var(--status-success-soft)",
        "status-warning":         "var(--status-warning)",
        "status-warning-soft":    "var(--status-warning-soft)",
        "status-danger":          "var(--status-danger)",
        "status-danger-soft":     "var(--status-danger-soft)",
      },
      borderRadius: {
        "4xl": "32px",
      }
    }
  },
  plugins: [],
};