const mockFormattedResturantData = {
  resturantMeta: {
    name: "Kabab House",
    address: "Some road 23",
    phone: "+391234567890",
  },
  socialLinks: {
    facebook: "fb.com/saifookhan",
    instagram: "instagram.com/saifooexplores",
  },
  delivery: {
    vendors: [
      { glovo: "glovoapp.com/123" },
      { justEat: "justEat.it/123" },
      { deliveroo: "deliveroo.com/123" },
    ],
  },
  menu: [
    {
      catrgoryName:"burger",
      items: [
        {
          name: "Kabab Large",
          price: "12.53",
          description: "This is an awesome Kabab",
          image: "https://example.com/photo.png",
        },
        {
          name: "Kabab Small",
          price: "9.99",
          description: "This is a small Kabab",
          image: "https://example.com/photo.png",
        },
      ]
    },
    {
      catrgoryName:"drinks",
      items: [
        {
          name: "pepsi",
          price: "12.53",
          description: "This is an awesome Kabab",
          image: "https://example.com/photo.png",
        },
        {
          name: "pepsi",
          price: "9.99",
          description: "This is a small Kabab",
          image: "https://example.com/photo.png",
        },
      ]
    },
  ],
  scraperMeta: {
    scrapedFrom: ["google", "external"],
    scrapedDate: "TIMESTAMP",
    images: "scraped", // generated, scraped
  },
};

export { mockFormattedResturantData };
