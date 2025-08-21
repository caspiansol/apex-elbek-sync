// Supported creators from Captions.ai
export const SUPPORTED_CREATORS = [
  "Alan-1", "Cam-1", "Carter-1", "Douglas-1", "Jason", 
  "Leah-1", "Madison-1", "Monica-1", "Violet-1"
];

// Real video previews from Google Drive (using direct download links for video playback)
export const THUMBNAILS: Record<string, { imageUrl: string; videoUrl: string }> = {
  "Alan-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1RF9dKmcjPdNpXS__WGv-plVqc1WV1tfB&sz=w400",
    videoUrl: "https://drive.google.com/uc?export=download&id=1RF9dKmcjPdNpXS__WGv-plVqc1WV1tfB"
  },
  "Cam-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1pX1zc7JthBwqYtiSV5LM4_Hw7Llj47NS&sz=w400",
    videoUrl: "https://drive.google.com/uc?export=download&id=1pX1zc7JthBwqYtiSV5LM4_Hw7Llj47NS"
  },
  "Carter-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1lQf7N6S5v2RnSvxhKhlnBitt_v2Rk0Kt&sz=w400",
    videoUrl: "https://drive.google.com/uc?export=download&id=1lQf7N6S5v2RnSvxhKhlnBitt_v2Rk0Kt"
  },
  "Douglas-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1pq3z55igHaAGnzsTm9AWPhijeOpi0b1f&sz=w400",
    videoUrl: "https://drive.google.com/uc?export=download&id=1pq3z55igHaAGnzsTm9AWPhijeOpi0b1f"
  },
  "Jason": {
    imageUrl: "https://drive.google.com/thumbnail?id=1odqVmHsGnUF6M2nQ8zn7oBHEwLLd0Fgn&sz=w400",
    videoUrl: "https://drive.google.com/uc?export=download&id=1odqVmHsGnUF6M2nQ8zn7oBHEwLLd0Fgn"
  },
  "Leah-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1XONuP0SEWfdxbcT9dQjBO_eWzmrZcMk-&sz=w400",
    videoUrl: "https://drive.google.com/uc?export=download&id=1XONuP0SEWfdxbcT9dQjBO_eWzmrZcMk-"
  },
  "Madison-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1g3yq2Z63r8MofeSmHvF1EWnVjLZH7rHm&sz=w400",
    videoUrl: "https://drive.google.com/uc?export=download&id=1g3yq2Z63r8MofeSmHvF1EWnVjLZH7rHm"
  },
  "Monica-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1nHounF8SnIOgYFTa4N4pn2btIGW0uVLT&sz=w400",
    videoUrl: "https://drive.google.com/uc?export=download&id=1nHounF8SnIOgYFTa4N4pn2btIGW0uVLT"
  },
  "Violet-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1VI8VX9-I2o9PLy90sr6Kr5PpqqAQQPZf&sz=w400",
    videoUrl: "https://drive.google.com/uc?export=download&id=1VI8VX9-I2o9PLy90sr6Kr5PpqqAQQPZf"
  }
};