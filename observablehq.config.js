export default {
  title: "TVM Studio",
  root: "src",
  output: "dist",

  // GitHub Pages will serve at /tvm-studio/
  cleanUrls: true,
  base: process.env.GH_PAGES === "1" ? "/tvm-studio/" : "/",

  theme: ["light", "alt"],

  head: `
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📊</text></svg>">
  `,

  pages: [
    { name: "Home", path: "/" },
    {
      name: "Problems",
      open: true,
      pages: [
        { name: "Annuity Due", path: "/q1" },
        { name: "Two-Stage Lump", path: "/q2" },
        { name: "Missing Cash Flow", path: "/q3" },
        { name: "APR Backout", path: "/q4" },
        { name: "EAR Bond", path: "/q5" },
        { name: "Mortgage", path: "/q6" },
        { name: "Multi-Stage DDM", path: "/q7" }
      ]
    },
    {
      name: "Reference",
      pages: [
        { name: "Excel TVM Functions", path: "/reference/excel-tvm" }
      ]
    }
  ],

  footer: `
    Built by <a href="https://ianhelfrich.com">Dr. Ian Helfrich</a>.
  `,

  search: false
};
