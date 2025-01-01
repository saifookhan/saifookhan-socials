// const fileUrlToBase64 = async (fileUrl) => {
async function fileUrlToBase64(fileUrl) {
  try {
    // Fetch the file from the URL
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Get the binary data as a buffer
    const arrayBuffer = await response.arrayBuffer();

    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(arrayBuffer);
    // Convert the buffer to a Base64 string
    return buffer.toString("base64");
  } catch (error) {
    console.error("Error converting file URL to Base64:", error);
    throw error;
  }
}

export { fileUrlToBase64 };
