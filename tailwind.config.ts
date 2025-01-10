import { OpacityIcon } from "@radix-ui/react-icons"
import type { Config } from "tailwindcss"
import { object } from "zod"

const config = {
darkMode: ["class"],
content: [
'./pages/**/*.{ts,tsx,css}',
'./components/**/*.{ts,tsx,css}',
'./app/**/*.{ts,tsx,css}',
'./src/**/*.{ts,tsx,css}',
],
prefix: "",
theme: {
container: {
center: true,
padding: "2rem",
screens: {
"2xl": "1400px",
},
},
extend: {
    height:{
        wholeScreen:'1vh'
    },
    spacing: {
      '128': '32rem',
    },
borderColor: {
base: 'var(--border)',
loader:'var(--loaderColor)'
},
textColor:{
    basic:{
        default:"var(--text-default)",
     },
     article:{
      default:"var(--text-article)",
   },
     secondary:{
        default:"var( --text-secondary)"
     },
     invers:{
        default:"var( --text-invers)"
     },
     reg:{
        default:"var( --text-reg)"
     }
},
backgroundColor:{
   
   task:{
      base:"var(--background-task-color)"
   },
    basic:{
        default:"var(--background-section-color)"
     },
     button:{
        base:"var(--background-button-color)"
     },
     cards:{
        base:"var(--background-cards-color)"
     },
     main:{
        base:"var(--background-main-color)"
     },
     objects: {
      base:"var(--background-obj-color)"
     },
     Lobjects: {
      base:"var(  --background-obj-light-color)"
     },
     reg : {
      base:"var(  --background-reg-color)"
     },
     regbut : {
      base:"var(  --background-reg-button-color)"
     }

     
},

colors: {
border: "hsl(var(--border))",
input: "hsl(var(--input))",
ring: "hsl(var(--ring))",
background: "hsl(var(--background))",
foreground: "hsl(var(--foreground))",
error: "var(--error-color)",
primary: {
DEFAULT: "hsl(var(--primary))",
foreground: "hsl(var(--primary-foreground))",
},
secondary: {
DEFAULT: "hsl(var(--secondary))",
foreground: "hsl(var(--secondary-foreground))",
},
destructive: {
DEFAULT: "hsl(var(--destructive))",
foreground: "hsl(var(--destructive-foreground))",
},
muted: {
DEFAULT: "hsl(var(--muted))",
foreground: "hsl(var(--muted-foreground))",
},
accent: {
DEFAULT: "hsl(var(--accent))",
foreground: "hsl(var(--accent-foreground))",
},
popover: {
DEFAULT: "hsl(var(--popover))",
foreground: "hsl(var(--popover-foreground))",
},
card: {
DEFAULT: "hsl(var(--card))",
foreground: "hsl(var(--card-foreground))",
},
},
borderRadius: {
lg: "var(--radius)",
md: "calc(var(--radius) - 2px)",
sm: "calc(var(--radius) - 4px)",
},
keyframes: {
"accordion-down": {
from: { height: "0" },
to: { height: "var(--radix-accordion-content-height)" },
},
"accordion-up": {
from: { height: "var(--radix-accordion-content-height)" },
to: { height: "0" },
},
},
animation: {
"accordion-down": "accordion-down 0.2s ease-out",
"accordion-up": "accordion-up 0.2s ease-out",
},
},
},
plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config