import { insertDataInSupabaseTable } from "../../db/_supabaseHelpers";
import axios from "axios";

const GlovoImageBasePaths = {
  MENUS: "menus-glovo",
  STORES: "stores-glovo",
  CUSTOMER_ASSETS: "customer-assets-glovo",
};
function convertGlovoImageIdTolUrl(shortUrl) {
  const BASE_URL = "https://glovo.dhmedia.io/image";

  // Split the short URL to extract the type and path
  if (!shortUrl.startsWith("dh:")) {
    throw new Error("Invalid URL format");
  }

  const [, path] = shortUrl.split(":");
  const [type] = path.split("/");

  switch (type) {
    case GlovoImageBasePaths.MENUS:
    case GlovoImageBasePaths.STORES:
    case GlovoImageBasePaths.CUSTOMER_ASSETS:
      break;
    default:
      throw new Error("Unsupported base path");
  }

  return `${BASE_URL}/${path}`;
}
function glovoScrapedDataToSupabase(scrapedData) {
  const scrapedDataMesage = scrapedData.message;
  const initialData = scrapedDataMesage.data[1].initialData;

  const rawMenuData = initialData.body;
  const storeMetaInfo = initialData.storeInfoData;
  const storeContactInfo = scrapedDataMesage.state.stores.store;

  let formattedMenu = [];
  rawMenuData.forEach((message) => {
    const category = message.data;
    const arr = {
      category: category.title,
      items: [],
    };
    category.elements.forEach((element) => {
      const newData = {
        name: element.data.name,
        price: element.data.price,
        description: element.data.description,
        image: element.data.images.map((imageId) => {
          return convertGlovoImageIdTolUrl(imageId.imageServiceId);
        })[0],
      };
      arr.items.push(newData);
    });
    formattedMenu.push(arr);
  });

  const mappedDataToSupabase = {
    external_resturantName: storeMetaInfo.title,
    google_phone: storeContactInfo.phoneNumber,
    google_address: storeContactInfo.address,
    google_coverPhotoUrl: convertGlovoImageIdTolUrl(
      storeMetaInfo.backgroundImageId
    ),
    external_logoUrl: convertGlovoImageIdTolUrl(storeMetaInfo.logoImageId),
    external_timestamp: new Date(),
    _menuFetchedFrom: "glovo",
    external_menuJson: formattedMenu,
  };

  return mappedDataToSupabase;
}

function getJustEatCoverUrlFromLogoUrl(url) {
  const urlStart = url.indexOf("images/");
  const urlEnd = url.indexOf(".gif" || ".png" || ".jpg");
  const sliced = url.slice(urlStart + 7, urlEnd + 4);
  return `https://just-eat-prod-eu-res.cloudinary.com/image/upload/f_auto/q_auto/d_it:cuisines:pizza-6.jpg/v1/it/restaurants/${sliced}`;
}
function justEatScrapedDataToSupabase(manifestApiResponse, itemsApiResponse) {
  const manifestApiResponseDataData = manifestApiResponse.data.data.LogoUrl;

  let formattedMenu = [];
  manifestApiResponse.data.Menus.map((menuData) => {
    menuData.Categories.map((category) => {
      const obj = {
        category: category.Name,
        items: [],
      };
      category.ItemIds.map((id) => {
        const data = getJustEatMatchedItems(itemsApiResponse, id);
        obj.items.push(data);
      });
      formattedMenu.push(obj);
    });
  });

  const mappedDataToSupabase = {
    external_resturantName: manifestApiResponseDataData.Name,
    google_phone: manifestApiResponseDataData.AllergenPhoneNumber,
    google_address: `${manifestApiResponseDataData.Location.Address} ${manifestApiResponseDataData.Location.City}`,
    google_coverPhotoUrl: getJustEatCoverUrlFromLogoUrl(
      manifestApiResponseDataData.LogoUrl
    ),
    external_logoUrl: manifestApiResponseDataData.LogoUrl,
    external_timestamp: new Date(),
    _menuFetchedFrom: "justeat",
    external_menuJson: formattedMenu,
  };

  return mappedDataToSupabase;
}

function cocaiExpressScrapedDataToSupabase(
  manifestApiResponse,
  itemsApiResponse,
  cocaiexpress
) {
  const mappedDataToSupabase = {
    external_resturantName: manifestApiResponse.data.data.legal_name,
    google_phone: manifestApiResponse.data.data.contacts[0].phone,
    google_address: manifestApiResponse.data.data.address,
    google_coverPhotoUrl:
      `https://www.cocaiexpress.com/api/uploads/stores/${cocaiexpress}/` +
      manifestApiResponse.data.data.img_path,
    external_logoUrl:
      `https://www.cocaiexpress.com/api/uploads/stores/${cocaiexpress}/` +
      manifestApiResponse.data.data.logo_path,
    external_timestamp: new Date(),
    _menuFetchedFrom: "cocaiexpress",
    external_menuJson: itemsApiResponse,
    google_website: manifestApiResponse.data.data.web_site,
  };

  return mappedDataToSupabase;
}

function deliverooScrapedDataToSupabase(scrapedData) {
  const scrapedDataMessage = scrapedData.message.sanitizedResult;
  const phone = scrapedData.message.sanitizedPhone[0].value[0];

  let formattedMenu = [];
  scrapedDataMessage.items.forEach((item) => {
    const categoryId = item.categoryId;
    const category = scrapedDataMessage.categories.find(
      (cat) => cat.id === categoryId
    );

    if (category) {
      const existingCategory = formattedMenu.find(
        (menu) => menu.category === category.name
      );

      const newData = {
        name: item.name,
        price: item.price.formatted,
        description: item.description,
        images: item.image || null,
      };

      if (existingCategory) {
        existingCategory.items.push(newData);
      } else {
        formattedMenu.push({
          category: category.name,
          items: [newData],
        });
      }
    }
  });

  const mappedDataToSupabase = {
    external_resturantName: scrapedDataMessage.restaurant.name,
    google_phone: phone || null,
    google_address: scrapedDataMessage.restaurant.location.address.address1,
    google_coverPhotoUrl: scrapedDataMessage.metatags.image,
    external_logoUrl: null,
    external_timestamp: new Date(),
    _menuFetchedFrom: "deliveroo",
    external_menuJson: formattedMenu,
  };

  return mappedDataToSupabase;
}

function cleanUrl(url) {
  const parsedUrl = new URL(url);
  return parsedUrl.origin + parsedUrl.pathname;
}

function slicedJustEatUrl(url) {
  const sliceStart = url.indexOf("restaurants-") + 12;
  const sliceEnd = url.indexOf("/menu");
  const slicedUrl = url.slice(sliceStart, sliceEnd);
  return slicedUrl;
}

function slicedCocaiExpressUrl(url) {
  const parts = url.split("/");
  const storeValue = parts[parts.length - 1];

  return storeValue;
}

// Function to fetch a file and convert it to Base64
async function fileUrlToBase64(fileUrl) {
  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString("base64");
  } catch (error) {
    console.error("Error converting file URL to Base64:", error);
    throw error;
  }
}

// Function to fetch data from a given API URL
async function fetchFromAPI(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

const getJustEatMatchedItems = (response, ID) => {
  const item = response.data.Items.find((item) => item.Id == ID);
  if (item) {
    const obj = {
      name: item.Name,
      price: item.Variations[0].BasePrice,
      description: item.Description,
      image: item.imageSources || "not found",
    };
    return obj;
  }
  return null;
};

const getCocaiStructuredData = (response, cocaiexpress) => {
  var obj = [];

  response.data.data.forEach((item) => {
    const imageUrl = item.img_path
      ? `https://www.cocaiexpress.com/api/uploads/stores/${cocaiexpress}/products/${item.img_path.substring(
          0,
          item.img_path.length - 4
        )}/${item.img_path}`
      : "not found";
    console.log(imageUrl);
    const data = {
      name: item.name,
      price: item.price,
      description: item.description,
      image: imageUrl,
    };
    const category = obj.find(
      (category) => category.category == item.category_id
    );
    if (category) {
      category.items.push(data);
    } else {
      obj.push({
        category: item.category_id,
        items: [data],
      });
    }
  });
  return obj;
};
// Function to identify the external type (Glovo, JustEat, etc.)
function checkExternalType(url) {
  if (url.includes("glovoapp.com")) {
    return "glovo";
  } else if (url.includes("justeat.it")) {
    return "justeat";
  } else if (url.includes("deliveroo.it")) {
    return "deliveroo";
  } else if (url.includes("cocaiexpress.com")) {
    return "cocaiexpress";
  } else {
    return "unknown";
  }
}

// Function to fetch data from an external URL and store it in the database
async function fetchFromExternalUrlAndStoreInDb(url) {
  const type = checkExternalType(url);

  if (type === ",") {
    //TODO:: Aashir - What is this exactly? :P
  } else if (type === "glovo") {
    const scrapedData = await fetchFromAPI(`/api/scraper/glovo-cmd?url=${url}`);
    const glovoToSupabaseData = glovoScrapedDataToSupabase(scrapedData);

    console.log("glovoToSupabaseData", glovoToSupabaseData);

    await insertDataInSupabaseTable("restaurants", glovoToSupabaseData);

    alert("Data Uploaded Successfully");
    return glovoToSupabaseData;
  } else if (type == "cocaiexpress") {
    const cocaiexpress = slicedCocaiExpressUrl(url);
    const manifestApiUrl = `https://www.cocaiexpress.com/api/v1/food/store/${cocaiexpress}`;
    const itemsApiUrl = `https://www.cocaiexpress.com/api/v1/food/store/product?&store_id=${cocaiexpress}`;

    try {
      const manifestApiResponse = await axios.get(manifestApiUrl);
      const itemsApiResponse = await axios.get(itemsApiUrl);
      const structuredData = getCocaiStructuredData(
        itemsApiResponse,
        cocaiexpress
      );
      const response = cocaiExpressScrapedDataToSupabase(
        manifestApiResponse,
        structuredData,
        cocaiexpress
      );

      await insertDataInSupabaseTable("restaurants", response);

      alert("Data Uploaded Successfully");
      return response;
    } catch (error) {
      console.error("Error fetching from JustEat API:", error);
    }
  } else if (type == "deliveroo") {
    const scrapedData = await fetchFromAPI(`/api/scraper/deliveroo?url=${url}`);
    console.log("scraped data ", scrapedData.message.sanitizedResult);
    const deliverooToSupabaseData = deliverooScrapedDataToSupabase(scrapedData);
    await insertDataInSupabaseTable("restaurants", deliverooToSupabaseData);
    alert("Data Uploaded Successfully");
  } else if (type === "justeat") {
    const justEat = slicedJustEatUrl(url);
    const manifestApiUrl = `https://menu-globalmenucdn.justeat-int.com/${justEat}_it_manifest.json`;
    const itemsApiUrl = `https://menu-globalmenucdn.justeat-int.com/${justEat}_it_items.json`;

    try {
      const manifestApiResponse = await axios.get(manifestApiUrl);
      const itemsApiResponse = await axios.get(itemsApiUrl);
      const justEatToSupabaseData = justEatScrapedDataToSupabase(
        manifestApiResponse,
        itemsApiResponse
      );

      await insertDataInSupabaseTable("restaurants", justEatToSupabaseData);

      alert("Data Uploaded Successfully");
      return justEatToSupabaseData;
    } catch (error) {
      console.error("Error fetching from JustEat API:", error);
    }
  } else {
    console.error("Unknown external type");
  }
}

// Function to convert Google Maps data to the Supabase format
function googleMapsToSupabaseConverter(data) {
  return {
    google_resturantName: data.name || "not found",
    google_address: data.address || "not found",
    google_phone: "0xzdads8932" || "not found",
    google_website: data.website || "not found",
    google_coverPhotoUrl: `${data.coverPhoto}` || "not found",
    google_menuPhotosUrls: `${data.menuPhotos}` || "not found",
    google_defaultMenuLinks: data.menuLink || "not found",
    google_menuSources:
      (data.orderTooltip && data.orderTooltip.text) || "not found",
    google_menuSources_url:
      (data.orderTooltip && data.orderTooltip.url) || "not found",
    google_businessHours: "7am-10pm",
    google_timestamp: new Date().toISOString(),
  };
}

export {
  fileUrlToBase64,
  checkExternalType,
  fetchFromExternalUrlAndStoreInDb,
  googleMapsToSupabaseConverter,
  justEatScrapedDataToSupabase,
  glovoScrapedDataToSupabase,
  cleanUrl,
};
