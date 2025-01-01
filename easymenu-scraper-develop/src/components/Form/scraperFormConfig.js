const scrapeSource = [
  { value: "googleMaps", label: "GoogleMaps" },
  { value: "external-only", label: "External Only" },
  { value: "googleANDexternal", label: "Google + External" },
];

const scrapeMode = [
  { value: "1-only-google", label: "Step 1: Only save Google Maps link" },
  {
    value: "2-googleANDsave",
    label: "Step 2: Get data from Google Maps + store",
  },
  {
    value: "3-googleANDprovided-externalANDsave",
    label: "Step 3: Get data from Google + provided external menu link + save",
  },
  {
    value: "4-only-external",
    label: "Option 4: Get data ONLY from external menu + save",
  },
];

const imageMode = [
  { value: "links-only", label: "Only save links" },
  { value: "linksANDfiles", label: "Save links + photo files" },
  {
    value: "generate-ai",
    label: "Step 3: Generate using AI",
  },
];

export { scrapeSource, scrapeMode, imageMode };
