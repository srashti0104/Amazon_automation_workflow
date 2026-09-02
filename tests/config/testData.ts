export const testData = {
  STOREFRONT_URL: 'https://www.amazon.in',
  SIGN_IN_URL: 'https://www.amazon.in/?ref_=nav_signin',

  USER: {
    email: process.env.AMAZON_EMAIL || '<Enter Your Email/Phone Number>',
    password: process.env.AMAZON_PASSWORD || '<Password>',
  }
};
