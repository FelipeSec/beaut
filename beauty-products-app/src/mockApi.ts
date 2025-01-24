export const mockRecommendations = {
    Hair: [
      {
        id: 1,
        name: "Argan Oil Shampoo",
        image: "https://via.placeholder.com/200x150?text=Argan+Oil+Shampoo",
        description: "Revitalize your hair with our argan oil formula.",
        price: "$15.99",
      },
      {
        id: 2,
        name: "Curl Defining Cream",
        image: "https://via.placeholder.com/200x150?text=Curl+Defining+Cream",
        description: "Perfect for enhancing and defining curls.",
        price: "$18.50",
      },
      {
        id: 3,
        name: "Keratin Hair Mask",
        image: "https://via.placeholder.com/200x150?text=Keratin+Hair+Mask",
        description: "Deep conditioning treatment for smooth hair.",
        price: "$22.00",
      },
    ],
    Makeup: [
      {
        id: 1,
        name: "Liquid Foundation",
        image: "https://via.placeholder.com/200x150?text=Liquid+Foundation",
        description: "Flawless coverage for all skin tones.",
        price: "$24.99",
      },
      {
        id: 2,
        name: "Matte Lipstick",
        image: "https://via.placeholder.com/200x150?text=Matte+Lipstick",
        description: "Long-lasting, vibrant matte finish.",
        price: "$12.99",
      },
      {
        id: 3,
        name: "Waterproof Mascara",
        image: "https://via.placeholder.com/200x150?text=Waterproof+Mascara",
        description: "Smudge-proof and long-lasting.",
        price: "$10.00",
      },
    ],
    Skincare: [
      {
        id: 1,
        name: "Vitamin C Serum",
        image: "https://via.placeholder.com/200x150?text=Vitamin+C+Serum",
        description: "Brighten and revitalize your skin.",
        price: "$30.00",
      },
      {
        id: 2,
        name: "Hyaluronic Acid Moisturizer",
        image: "https://via.placeholder.com/200x150?text=Hyaluronic+Moisturizer",
        description: "Intense hydration for dry skin.",
        price: "$20.00",
      },
      {
        id: 3,
        name: "SPF 50 Sunscreen",
        image: "https://via.placeholder.com/200x150?text=SPF+50+Sunscreen",
        description: "Protect your skin from harmful UV rays.",
        price: "$15.00",
      },
    ],
  };
  
  // Simulate an API call to fetch recommendations
  export const fetchRecommendations = (category: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRecommendations[category] || []);
      }, 1000); // Simulate a 1-second delay
    });
  };
  