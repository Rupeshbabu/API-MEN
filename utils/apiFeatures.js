class APIFeatures {
    constructor(query, queryString){
      this.query = query;
      this.queryString = queryString
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      const excludeFields = ['page', 'sort', 'limit', 'fields'];
      excludeFields.forEach((el) => delete queryObj[el]);
      
      //2. Adv. Filtering
      // {difficulty: 'easy', duration: {$gte: 5}}
      // {difficulty: 'easy', duration: {gte: '5'}}
      //gte, gt, lte, lt
      let queryStr = JSON.stringify(queryObj);
      queryStr =  queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      
  
      this.query = this.query.find(JSON.parse(queryStr));
       //EXCUTE QUERY
      // let query = Tour.find(JSON.parse(queryStr));
      return this;
    }
  
    sort(){
      if(this.queryString.sort){
        const sortBy = this.queryString.query.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
        //sort('price ratingAverage')
      }else{
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
  
    limitFields(){
      if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join (' ');
        this.query = this.query.select(fields);
      }else{
        this.query = this.query.select('-__v');
      }
  
      return this;
    }
  
    pagination() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
      //page=2&limit=10, => 1-10 page1, 11-20 page 2, 20-30 page 3
      this.query = this.query.skip(skip).limit(limit);
      
      // if(this.queryString.page){
      //   const numTours = await Tour.countDocuments();
      //   if(skip >= numTours) throw new Error('This Page does not exist!');
      // }
      return this;
    }
  }

  module.exports = APIFeatures;