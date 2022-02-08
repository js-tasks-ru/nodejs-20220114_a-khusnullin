const categorySchema = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  try {
    //Fetch categories from DB
    const categoriesList = await categorySchema.find();
    //Result Array
    let resArr = [];
    //Make Result Array according task
    categoriesList.forEach((item, index) => {
      resArr[index] = {
        id: item._id,
        title: item.title,
        subcategories: []
      };
      item.subcategories.forEach((subitem, subindex) => {
        resArr[index].subcategories[subindex] = {
          id: subitem._id,
          title: subitem.title,
        };
      });
    });
    //Return object with categories 
    ctx.body = {categories: resArr};
  } catch (err) {
    //In case of error => return error 500
    ctx.status = 500;
    ctx.body = "Error 500";
  }
};
