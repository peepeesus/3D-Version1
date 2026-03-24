
const fs = require('fs');
const domain = 'xm6ysh-71.myshopify.com';
const storefrontAccessToken = '20ba1b89d4c07ea252a26396a4390c92';

async function testShopify() {
    const query = `
    {
      products(first: 20) {
        edges {
          node {
            id
            title
            handle
            description
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
          }
        }
      }
    }
    `;
    try {
        const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
            },
            body: JSON.stringify({ query }),
        });
        const result = await response.json();
        fs.writeFileSync('shopify-products.json', JSON.stringify(result, null, 2));
        console.log('Wrote to shopify-products.json');
    } catch (error) {
        fs.writeFileSync('shopify-error.txt', error.toString());
        console.error('Error fetching from Shopify:', error);
    }
}
testShopify();
