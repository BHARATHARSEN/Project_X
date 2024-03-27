class APIFilters {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
      const keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }
        : {};

      this.query = this.query.find({ ...keyword });
      // 'this' is current APIFilters object instance
      return this;
    };

    filters(){
      const queryCopy = { ...this.queryStr };
      console.log(queryCopy);

      //Fields to remove

      const fieldsToRemove = ["keyword"];
      fieldsToRemove.forEach((el) => delete queryCopy[el]);
      console.log(queryCopy);

      this.query = this.query.find(this.queryStr);
      // 'this' is current APIFilters object instance
      return this;
    }
}

export default APIFilters ;