const productsSchema = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  let {query} = ctx.query;

  try {
    //Fetch data from DB
    const productsList = await productsSchema.find({$or:
      [
        {title: {$regex: '.*' + query + '.*'}}, 
        {description: {$regex: '.*' + query + '.*'}},
      ]
    });
    //Result Array
    let resArr = [];
    //If products didn't found => return empty array
    if (productsList.length === 0){
      ctx.body = {products: []};    
    } else {
      //Else => make result array according task
      productsList.forEach((item, index) => {
        resArr[index] = {
          id: item._id,
          title: item.title,
          category: item.category,
          subcategory: item.subcategory,
          price: item.price,
          description: item.description,
          images: [],
        };      
        item.images.forEach((subitem, subindex) => {
          resArr[index].images[subindex] = subitem;
        });
      });
      //Return object with products
      ctx.body = {products: resArr};
    }
  } catch {
    //In case of error => return error 500
    ctx.status = 500;
    ctx.body = "Error 500";    
  }
};
