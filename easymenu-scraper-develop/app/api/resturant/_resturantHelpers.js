// Function to transform the data
function transformData(data) {
  // Extract social links based on keywords
  const socialLinks = {};
  const possibleLinks = [data.google_website];

  possibleLinks.forEach((link) => {
    if (!link) return;
    if (link.includes("facebook")) {
      socialLinks.facebook = link;
    } else if (link.includes("instagram")) {
      socialLinks.instagram = link;
    } else {
      socialLinks.website = link;
    }
  });

  // Extract delivery vendors from menu sources
  const deliveryVendors = [];
  const sources = [data.google_menuSources, data._menuFetchedFrom];

  sources.forEach((source) => {
    if (!source) return;
    if (source.includes("glovo"))
      deliveryVendors.push({ glovo: `glovoapp.com/${data.id || "123"}` });
    if (source.includes("justEat"))
      deliveryVendors.push({ justEat: `justEat.it/${data.id || "123"}` });
    if (source.includes("deliveroo"))
      deliveryVendors.push({ deliveroo: `deliveroo.com/${data.id || "123"}` });
  });

  return {
    resturantMeta: {
      name: data.google_resturantName || data.external_resturantName,
      address: data.google_address || null,
      phone: data.google_phone || null,
    },
    socialLinks: {
      facebook: socialLinks.facebook || null,
      instagram: socialLinks.instagram || null,
      website: socialLinks.website || null,
    },
    // delivery: {
    //   vendors: deliveryVendors.length ? deliveryVendors : [],
    // },
    scraperMeta: {
      scrapedFrom: sources.filter(Boolean), //TODO:: Fix services
      scrapedDate: data.google_timestamp || data.external_timestamp || "NA",
      images: {
        logoImageUrl: data.external_logoUrl,
        coverPhotos: data.google_coverPhotoUrl,
        menuPhotos: data.google_menuPhotosUrls,
      },
    },
    menu: data.external_menuJson,
  };
}

export { transformData };
