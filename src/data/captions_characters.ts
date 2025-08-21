// Supported creators from Captions.ai
export const SUPPORTED_CREATORS = [
  "Alan-1", "Cam-1", "Carter-1", "Douglas-1", "Jason", 
  "Leah-1", "Madison-1", "Monica-1", "Violet-1"
];

// Real video previews - using placeholder videos that actually work for now
// TODO: Replace with actual creator videos when available via proper video hosting
export const THUMBNAILS: Record<string, { imageUrl: string; videoUrl: string }> = {
  "Alan-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1RF9dKmcjPdNpXS__WGv-plVqc1WV1tfB&sz=w400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  "Cam-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1pX1zc7JthBwqYtiSV5LM4_Hw7Llj47NS&sz=w400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  "Carter-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1lQf7N6S5v2RnSvxhKhlnBitt_v2Rk0Kt&sz=w400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  "Douglas-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1pq3z55igHaAGnzsTm9AWPhijeOpi0b1f&sz=w400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  },
  "Jason": {
    imageUrl: "https://drive.google.com/thumbnail?id=1odqVmHsGnUF6M2nQ8zn7oBHEwLLd0Fgn&sz=w400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  },
  "Leah-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1XONuP0SEWfdxbcT9dQjBO_eWzmrZcMk-&sz=w400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  },
  "Madison-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1g3yq2Z63r8MofeSmHvF1EWnVjLZH7rHm&sz=w400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
  },
  "Monica-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1nHounF8SnIOgYFTa4N4pn2btIGW0uVLT&sz=w400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  "Violet-1": {
    imageUrl: "https://drive.google.com/thumbnail?id=1VI8VX9-I2o9PLy90sr6Kr5PpqqAQQPZf&sz=w400",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  }
};