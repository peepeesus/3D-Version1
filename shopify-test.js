
const domain = 'xm6ysh-71.myshopify.com';
const storefrontAccessToken = '20ba1b89d4c07ea252a26396a4390c92';

async function testShopify() {
    const query = `
    {
      shop {
        name
        description
      }
      products(first: 5) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
    `;

    try {
        console.log('Fetching from Shopify...');
        const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
            },
            body: JSON.stringify({ query }),
        });

        const result = await response.json();
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error fetching from Shopify:', error);
    }
}

testShopify();
