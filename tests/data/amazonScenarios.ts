export type AmazonScenario = {
  name: string;
  searchTerm: string;
  resultText: string;
  addToCartLabel: string;
  cashOnDeliveryLabel: string;
};

export const amazonScenarios: AmazonScenario[] = [
  {
    name: 'coffee',
    searchTerm: 'coffee',
    resultText: 'Nescafé Classic Instant Coffee Powder, 90g Jar',
    addToCartLabel: 'Add to cart',
    cashOnDeliveryLabel: 'Cash on Delivery/Pay on Delivery'
  },
];
