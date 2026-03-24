
const SHOPIFY_DOMAIN = 'xm6ysh-71.myshopify.com';
const SHOPIFY_TOKEN = '20ba1b89d4c07ea252a26396a4390c92';

async function fetchShopify(query) {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
        },
        body: JSON.stringify({ query }),
    });
    return await response.json();
}

const PRODUCTS_QUERY = `
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

function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = products.map(({ node }, index) => `
        <div class="product-card group relative overflow-hidden bg-white p-4" data-index="${index}">
            <div class="aspect-[3/4] overflow-hidden bg-zinc-100 mb-6 relative">
                <img 
                    src="${node.images.edges[0]?.node.url || 'https://via.placeholder.com/600x800'}" 
                    alt="${node.title}" 
                    class="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                >
                <div class="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-black/5 backdrop-blur-sm">
                    <button 
                        onclick="addToCart('${node.variants.edges[0]?.node.id}')"
                        class="w-full h-12 bg-black text-white text-[10px] uppercase tracking-widest font-bold hover:bg-zinc-800 transition-colors"
                    >
                        Add to Bag
                    </button>
                </div>
            </div>
            <div class="flex justify-between items-start">
                <div class="text-left">
                    <h3 class="serif text-xl mb-1">${node.title}</h3>
                    <p class="text-[10px] uppercase tracking-widest text-zinc-400">Erwaldo Carbon Series</p>
                </div>
                <p class="serif text-lg">${parseFloat(node.variants.edges[0]?.node.price.amount).toFixed(0)} ${node.variants.edges[0]?.node.price.currencyCode}</p>
            </div>
        </div>
    `).join('');

    // Animate Reveal
    gsap.from(".product-card", {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
            trigger: container,
            start: "top 80%"
        }
    });
}

async function initShopifyCollection(containerId) {
    const data = await fetchShopify(PRODUCTS_QUERY);
    if (data.data && data.data.products) {
        renderProducts(data.data.products.edges, containerId);
    }
}

// Simple Checkout Link (for one-page demo)
function addToCart(variantId) {
    // Generate a checkout URL for a single item for simplicity in this demo
    const cleanId = variantId.split('/').pop();
    const checkoutUrl = `https://${SHOPIFY_DOMAIN}/cart/${cleanId}:1`;
    window.location.href = checkoutUrl;
}
