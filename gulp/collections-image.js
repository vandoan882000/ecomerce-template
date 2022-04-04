const fs = require('fs');
const path = require('path');

const collectionFile = path.resolve(__dirname, '../src/data/collections.data.js');

const content = fs.readFileSync(collectionFile).toString().replace(/(const|let|var)(?=\s*data\s)/g, "return") || "{}";
const getJSON = new Function(content.trim());
const collections = getJSON();
let count = 0;

const collectionMapping = collection => {
  const { products } = collection;

  return products.map((product) => {
    count++;
    return {
      ...product,
      featured_image: {
        ...product.featured_image,
        preview_image: `${count}.jpg`
      }
    }
  })
}

const result = Object.entries(collections).reduce((obj, [key, collection]) => {
  return {
    ...obj,
    [key]: collectionMapping(collection)
  }
}, {})

fs.writeFileSync(path.resolve(__dirname, '..', 'abc.js'), `const data = ${JSON.stringify(result, null, 2)}`);
