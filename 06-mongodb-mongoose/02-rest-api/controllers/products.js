const productsSchema = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  try{
    //Fetch data from DB
    const productsList = await productsSchema.find({subcategory: subcategory});
    //Result array
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
  } catch (err) {
    //In case of error => return error 500
    ctx.status = 500;
    ctx.body = "Error 500";
  }
};

module.exports.productList = async function productList(ctx, next) {
  try {
    //Fetch data from DB
    const productsList = await productsSchema.find();
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
  } catch (err) {
      //In case of error => return error 500
      ctx.status = 500;
      ctx.body = "Error 500";
  }
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;

  try {
    //Fetch data from DB
    const product = await productsSchema.findById(id);
    //Result Object
    let resProd = {};
    //Result Object filling according task
    resProd.id = product.id;
    resProd.title = product.title;
    resProd.category = product.category;
    resProd.subcategory = product.subcategory;
    resProd.price = product.price;
    resProd.description = product.description;
    resProd.images = [];
    product.images.forEach((item, index) => {
      resProd.images[index] = item;
    })
    //Return object with the product
    ctx.body = {product: resProd};
  } catch (err) {
    /* In case of error:
    1. Check error name, if err.name === "CastError" => Error 400
    2. Otherwise Error 500 
     */
    if (err.name === "CastError"){
      ctx.status = 400;
      ctx.body = "Error 400";
    } else {
      ctx.status = 404;
      ctx.body = "Error 404";
    }
  }
};

